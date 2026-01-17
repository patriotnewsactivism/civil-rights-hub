-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  related_entity_type TEXT,
  related_entity_id UUID,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications"
ON public.notifications
FOR DELETE
USING (auth.uid() = user_id);

-- System can insert notifications (via triggers)
CREATE POLICY "System can insert notifications"
ON public.notifications
FOR INSERT
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_user_created ON public.notifications(user_id, created_at DESC);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create function to notify on FOIA status change
CREATE OR REPLACE FUNCTION public.notify_foia_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create notification if status actually changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.notifications (user_id, title, message, type, related_entity_type, related_entity_id)
    VALUES (
      NEW.user_id,
      'FOIA Request Status Updated',
      'Your FOIA request "' || NEW.subject || '" status changed from ' || COALESCE(OLD.status, 'draft') || ' to ' || NEW.status,
      CASE 
        WHEN NEW.status = 'completed' THEN 'success'
        WHEN NEW.status = 'denied' THEN 'warning'
        ELSE 'info'
      END,
      'foia_request',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for FOIA status changes
CREATE TRIGGER on_foia_status_change
AFTER UPDATE ON public.foia_requests
FOR EACH ROW
EXECUTE FUNCTION public.notify_foia_status_change();

-- Create function to check for approaching deadlines (to be called by cron or edge function)
CREATE OR REPLACE FUNCTION public.check_foia_deadlines()
RETURNS void AS $$
DECLARE
  request_record RECORD;
BEGIN
  -- Find requests with deadlines approaching in 3 days or less
  FOR request_record IN
    SELECT 
      fr.id,
      fr.user_id,
      fr.subject,
      fr.response_due_date,
      COALESCE(fr.response_due_date, 
        fr.submitted_at + INTERVAL '20 business days') as calculated_deadline
    FROM public.foia_requests fr
    WHERE fr.status NOT IN ('completed', 'denied')
      AND fr.submitted_at IS NOT NULL
      AND NOT EXISTS (
        -- Don't create duplicate notifications for same deadline
        SELECT 1 FROM public.notifications n 
        WHERE n.related_entity_id = fr.id 
        AND n.type = 'deadline'
        AND n.created_at > now() - INTERVAL '24 hours'
      )
  LOOP
    -- Calculate days until deadline
    IF request_record.calculated_deadline IS NOT NULL 
       AND request_record.calculated_deadline <= now() + INTERVAL '3 days' THEN
      
      IF request_record.calculated_deadline < now() THEN
        -- Overdue notification
        INSERT INTO public.notifications (user_id, title, message, type, related_entity_type, related_entity_id)
        VALUES (
          request_record.user_id,
          'FOIA Request Overdue',
          'Your FOIA request "' || request_record.subject || '" is past its response deadline. Consider filing an appeal.',
          'deadline',
          'foia_request',
          request_record.id
        );
      ELSE
        -- Approaching deadline notification
        INSERT INTO public.notifications (user_id, title, message, type, related_entity_type, related_entity_id)
        VALUES (
          request_record.user_id,
          'FOIA Deadline Approaching',
          'Your FOIA request "' || request_record.subject || '" response is due soon.',
          'deadline',
          'foia_request',
          request_record.id
        );
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;