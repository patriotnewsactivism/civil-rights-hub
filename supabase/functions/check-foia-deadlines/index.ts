import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// State-specific response deadlines (in business days)
const STATE_RESPONSE_DAYS: Record<string, number> = {
  "Federal": 20,
  "California": 10,
  "New York": 5,
  "Texas": 10,
  "Florida": 10,
  "Illinois": 5,
  "Pennsylvania": 5,
  "Ohio": 10,
  "Georgia": 3,
  "North Carolina": 10,
  "Michigan": 5,
  "New Jersey": 7,
  "Virginia": 5,
  "Washington": 5,
  "Arizona": 5,
  "Massachusetts": 10,
  "Tennessee": 7,
  "Indiana": 7,
  "Missouri": 3,
  "Maryland": 10,
  "Wisconsin": 10,
  "Colorado": 3,
  "Minnesota": 10,
  "South Carolina": 15,
  "Alabama": 10,
  "Louisiana": 3,
  "Kentucky": 3,
  "Oregon": 5,
  "Oklahoma": 3,
  "Connecticut": 4,
  "Utah": 10,
  "Iowa": 10,
  "Nevada": 5,
  "Arkansas": 3,
  "Mississippi": 7,
  "Kansas": 3,
  "New Mexico": 15,
  "Nebraska": 4,
  "West Virginia": 5,
  "Idaho": 3,
  "Hawaii": 10,
  "New Hampshire": 5,
  "Maine": 5,
  "Montana": 5,
  "Rhode Island": 10,
  "Delaware": 15,
  "South Dakota": 5,
  "North Dakota": 5,
  "Alaska": 10,
  "Vermont": 3,
  "Wyoming": 5,
};

function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let addedDays = 0;
  
  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      addedDays++;
    }
  }
  
  return result;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all active FOIA requests that have been submitted
    const { data: requests, error: fetchError } = await supabase
      .from("foia_requests")
      .select("*")
      .not("status", "in", "(completed,denied)")
      .not("submitted_at", "is", null);

    if (fetchError) {
      throw fetchError;
    }

    const now = new Date();
    const notificationsCreated: string[] = [];

    for (const request of requests || []) {
      // Calculate deadline
      const submittedAt = new Date(request.submitted_at);
      const responseDays = STATE_RESPONSE_DAYS[request.state] || 20;
      const deadline = request.response_due_date 
        ? new Date(request.response_due_date) 
        : addBusinessDays(submittedAt, responseDays);
      
      const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      // Check if we already sent a notification in the last 24 hours
      const { data: recentNotifications } = await supabase
        .from("notifications")
        .select("id")
        .eq("related_entity_id", request.id)
        .eq("type", "deadline")
        .gte("created_at", new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString())
        .limit(1);

      if (recentNotifications && recentNotifications.length > 0) {
        continue; // Already notified recently
      }

      let notificationData = null;

      if (daysUntilDeadline < 0) {
        // Overdue
        notificationData = {
          user_id: request.user_id,
          title: "FOIA Request Overdue",
          message: `Your FOIA request "${request.subject}" to ${request.agency_name} is ${Math.abs(daysUntilDeadline)} days past the response deadline. Consider filing an appeal or follow-up.`,
          type: "deadline",
          related_entity_type: "foia_request",
          related_entity_id: request.id,
        };
      } else if (daysUntilDeadline <= 3) {
        // Approaching deadline (within 3 days)
        notificationData = {
          user_id: request.user_id,
          title: "FOIA Deadline Approaching",
          message: `Your FOIA request "${request.subject}" to ${request.agency_name} response is due in ${daysUntilDeadline} day${daysUntilDeadline !== 1 ? "s" : ""}.`,
          type: "deadline",
          related_entity_type: "foia_request",
          related_entity_id: request.id,
        };
      } else if (daysUntilDeadline === 7) {
        // 1 week warning
        notificationData = {
          user_id: request.user_id,
          title: "FOIA Response Due Next Week",
          message: `Your FOIA request "${request.subject}" to ${request.agency_name} response is due in 1 week.`,
          type: "info",
          related_entity_type: "foia_request",
          related_entity_id: request.id,
        };
      }

      if (notificationData) {
        const { error: insertError } = await supabase
          .from("notifications")
          .insert(notificationData);

        if (insertError) {
          console.error("Error creating notification:", insertError);
        } else {
          notificationsCreated.push(request.id);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Checked ${requests?.length || 0} requests, created ${notificationsCreated.length} notifications`,
        notificationsCreated,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in check-foia-deadlines function:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);