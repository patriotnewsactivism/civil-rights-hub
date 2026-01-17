-- Update notifications table to support FOIA notifications
-- Adapted from conflicting migration 20260117095634_98742b76-60bf-4361-a8ca-4f7216185461.sql

-- 1. Add missing columns and relax constraints
DO $$
BEGIN
    -- Add title
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'title') THEN
        ALTER TABLE public.notifications ADD COLUMN title TEXT;
    END IF;

    -- Add message (if distinct from content)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'message') THEN
        ALTER TABLE public.notifications ADD COLUMN message TEXT;
    END IF;
    
    -- Add related_entity_type
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'related_entity_type') THEN
        ALTER TABLE public.notifications ADD COLUMN related_entity_type TEXT;
    END IF;

    -- Add related_entity_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'related_entity_id') THEN
        ALTER TABLE public.notifications ADD COLUMN related_entity_id UUID;
    END IF;

    -- Add read_at
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'read_at') THEN
        ALTER TABLE public.notifications ADD COLUMN read_at TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Drop strict type check if it exists (to allow 'info', 'deadline', etc.)
    ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
END $$;

-- 2. Skip Table Creation (Already Exists)
/*
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
*/

-- Enable RLS
-- ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 3. Skip Policies (Already Exists or similar enough)
/*
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
ON public.notifications
FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
ON public.notifications
FOR INSERT
WITH CHECK (true);
*/

-- 4. Create indexes if not exists (using safe names or IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON public.notifications(user_id, created_at DESC);

-- Enable realtime for notifications
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- 5. Create Functions

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
DROP TRIGGER IF EXISTS on_foia_status_change ON public.foia_requests;
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
