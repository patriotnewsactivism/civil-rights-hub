export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activists: {
        Row: {
          alias: string | null
          bio: string | null
          channel_url: string | null
          created_at: string
          focus_areas: string[] | null
          home_state: string | null
          id: string
          name: string
          primary_platform: string | null
          profile_image_url: string | null
          updated_at: string
          user_submitted: boolean | null
          verified: boolean | null
        }
        Insert: {
          alias?: string | null
          bio?: string | null
          channel_url?: string | null
          created_at?: string
          focus_areas?: string[] | null
          home_state?: string | null
          id?: string
          name: string
          primary_platform?: string | null
          profile_image_url?: string | null
          updated_at?: string
          user_submitted?: boolean | null
          verified?: boolean | null
        }
        Update: {
          alias?: string | null
          bio?: string | null
          channel_url?: string | null
          created_at?: string
          focus_areas?: string[] | null
          home_state?: string | null
          id?: string
          name?: string
          primary_platform?: string | null
          profile_image_url?: string | null
          updated_at?: string
          user_submitted?: boolean | null
          verified?: boolean | null
        }
        Relationships: []
      }
      attorneys: {
        Row: {
          accepts_pro_bono: boolean | null
          bar_number: string | null
          bio: string | null
          city: string | null
          created_at: string | null
          email: string | null
          firm_name: string | null
          id: string
          name: string
          phone: string | null
          specialties: string[] | null
          state: string
          updated_at: string | null
          website: string | null
          years_experience: number | null
        }
        Insert: {
          accepts_pro_bono?: boolean | null
          bar_number?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          firm_name?: string | null
          id?: string
          name: string
          phone?: string | null
          specialties?: string[] | null
          state: string
          updated_at?: string | null
          website?: string | null
          years_experience?: number | null
        }
        Update: {
          accepts_pro_bono?: boolean | null
          bar_number?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          firm_name?: string | null
          id?: string
          name?: string
          phone?: string | null
          specialties?: string[] | null
          state?: string
          updated_at?: string | null
          website?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      foia_requests: {
        Row: {
          agency_name: string
          created_at: string | null
          details: string
          id: string
          request_type: string
          requester_address: string | null
          requester_email: string
          requester_name: string
          response_due_date: string | null
          response_text: string | null
          state: string
          status: string | null
          subject: string
          submitted_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agency_name: string
          created_at?: string | null
          details: string
          id?: string
          request_type: string
          requester_address?: string | null
          requester_email: string
          requester_name: string
          response_due_date?: string | null
          response_text?: string | null
          state: string
          status?: string | null
          subject: string
          submitted_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agency_name?: string
          created_at?: string | null
          details?: string
          id?: string
          request_type?: string
          requester_address?: string | null
          requester_email?: string
          requester_name?: string
          response_due_date?: string | null
          response_text?: string | null
          state?: string
          status?: string | null
          subject?: string
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      community_events: {
        Row: {
          address: string | null
          attendee_count: number | null
          cancellation_reason: string | null
          capacity: number | null
          city: string
          created_at: string
          created_by: string | null
          description: string
          end_date: string | null
          event_type: string
          id: string
          is_cancelled: boolean | null
          is_published: boolean | null
          is_virtual: boolean | null
          latitude: string | null
          location_name: string | null
          longitude: string | null
          organizer_contact: string | null
          organizer_name: string | null
          registration_link: string | null
          registration_required: boolean | null
          rsvp_count: number | null
          start_date: string
          state: string
          tags: string[] | null
          title: string
          updated_at: string
          virtual_link: string | null
        }
        Insert: {
          address?: string | null
          attendee_count?: number | null
          cancellation_reason?: string | null
          capacity?: number | null
          city: string
          created_at?: string
          created_by?: string | null
          description: string
          end_date?: string | null
          event_type: string
          id?: string
          is_cancelled?: boolean | null
          is_published?: boolean | null
          is_virtual?: boolean | null
          latitude?: string | null
          location_name?: string | null
          longitude?: string | null
          organizer_contact?: string | null
          organizer_name?: string | null
          registration_link?: string | null
          registration_required?: boolean | null
          rsvp_count?: number | null
          start_date: string
          state: string
          tags?: string[] | null
          title: string
          updated_at?: string
          virtual_link?: string | null
        }
        Update: {
          address?: string | null
          attendee_count?: number | null
          cancellation_reason?: string | null
          capacity?: number | null
          city?: string
          created_at?: string
          created_by?: string | null
          description?: string
          end_date?: string | null
          event_type?: string
          id?: string
          is_cancelled?: boolean | null
          is_published?: boolean | null
          is_virtual?: boolean | null
          latitude?: string | null
          location_name?: string | null
          longitude?: string | null
          organizer_contact?: string | null
          organizer_name?: string | null
          registration_link?: string | null
          registration_required?: boolean | null
          rsvp_count?: number | null
          start_date?: string
          state?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          virtual_link?: string | null
        }
        Relationships: []
      }
      event_rsvps: {
        Row: {
          created_at: string
          email: string | null
          event_id: string
          id: string
          name: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          event_id: string
          id?: string
          name?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          event_id?: string
          id?: string
          name?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      resource_library: {
        Row: {
          approved_by: string | null
          author: string | null
          category: string
          created_at: string
          description: string | null
          download_count: number | null
          external_url: string | null
          file_size: number | null
          file_url: string | null
          id: string
          is_approved: boolean | null
          language: string | null
          rating: string | null
          rating_count: number | null
          resource_type: string
          source: string | null
          tags: string[] | null
          title: string
          updated_at: string
          uploaded_by: string | null
          view_count: number | null
        }
        Insert: {
          approved_by?: string | null
          author?: string | null
          category: string
          created_at?: string
          description?: string | null
          download_count?: number | null
          external_url?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_approved?: boolean | null
          language?: string | null
          rating?: string | null
          rating_count?: number | null
          resource_type: string
          source?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          uploaded_by?: string | null
          view_count?: number | null
        }
        Update: {
          approved_by?: string | null
          author?: string | null
          category?: string
          created_at?: string
          description?: string | null
          download_count?: number | null
          external_url?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_approved?: boolean | null
          language?: string | null
          rating?: string | null
          rating_count?: number | null
          resource_type?: string
          source?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      resource_ratings: {
        Row: {
          created_at: string
          id: string
          rating: number
          resource_id: string
          review: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          rating: number
          resource_id: string
          review?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          rating?: number
          resource_id?: string
          review?: string | null
          user_id?: string
        }
        Relationships: []
      }
      success_stories: {
        Row: {
          approved_by: string | null
          city: string | null
          created_at: string
          id: string
          incident_type: string | null
          is_anonymous: boolean | null
          is_approved: boolean | null
          is_featured: boolean | null
          like_count: number | null
          organizations_involved: string[] | null
          outcome: string
          resolution_date: string | null
          share_count: number | null
          state: string | null
          story: string
          submitter_name: string | null
          submitted_by: string | null
          title: string
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          city?: string | null
          created_at?: string
          id?: string
          incident_type?: string | null
          is_anonymous?: boolean | null
          is_approved?: boolean | null
          is_featured?: boolean | null
          like_count?: number | null
          organizations_involved?: string[] | null
          outcome: string
          resolution_date?: string | null
          share_count?: number | null
          state?: string | null
          story: string
          submitter_name?: string | null
          submitted_by?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          city?: string | null
          created_at?: string
          id?: string
          incident_type?: string | null
          is_anonymous?: boolean | null
          is_approved?: boolean | null
          is_featured?: boolean | null
          like_count?: number | null
          organizations_involved?: string[] | null
          outcome?: string
          resolution_date?: string | null
          share_count?: number | null
          state?: string | null
          story?: string
          submitter_name?: string | null
          submitted_by?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      direct_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_deleted_by_recipient: boolean | null
          is_deleted_by_sender: boolean | null
          is_read: boolean | null
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_deleted_by_recipient?: boolean | null
          is_deleted_by_sender?: boolean | null
          is_read?: boolean | null
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_deleted_by_recipient?: boolean | null
          is_deleted_by_sender?: boolean | null
          is_read?: boolean | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      emergency_contacts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_primary: boolean | null
          name: string
          notes: string | null
          phone: string
          priority_order: number | null
          relationship: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          notes?: string | null
          phone: string
          priority_order?: number | null
          relationship?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          notes?: string | null
          phone?: string
          priority_order?: number | null
          relationship?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      panic_alerts: {
        Row: {
          address: string | null
          alert_type: string
          contacts_notified: string[] | null
          created_at: string
          id: string
          latitude: string
          longitude: string
          message: string | null
          resolved_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          alert_type: string
          contacts_notified?: string[] | null
          created_at?: string
          id?: string
          latitude: string
          longitude: string
          message?: string | null
          resolved_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          alert_type?: string
          contacts_notified?: string[] | null
          created_at?: string
          id?: string
          latitude?: string
          longitude?: string
          message?: string | null
          resolved_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      comment_upvotes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      content_reports: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          details: string | null
          id: string
          reason: string
          reporter_id: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          details?: string | null
          id?: string
          reason: string
          reporter_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          details?: string | null
          id?: string
          reason?: string
          reporter_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Relationships: []
      }
      forum_posts: {
        Row: {
          content: string
          created_at: string
          id: string
          is_deleted: boolean | null
          is_edited: boolean | null
          like_count: number | null
          parent_post_id: string | null
          thread_id: string
          updated_at: string
          user_id: string | null
          username: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          like_count?: number | null
          parent_post_id?: string | null
          thread_id: string
          updated_at?: string
          user_id?: string | null
          username?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          like_count?: number | null
          parent_post_id?: string | null
          thread_id?: string
          updated_at?: string
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
      forum_threads: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          is_deleted: boolean | null
          is_locked: boolean | null
          is_pinned: boolean | null
          last_post_at: string | null
          like_count: number | null
          post_count: number | null
          title: string
          updated_at: string
          user_id: string | null
          username: string | null
          view_count: number | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_post_at?: string | null
          like_count?: number | null
          post_count?: number | null
          title: string
          updated_at?: string
          user_id?: string | null
          username?: string | null
          view_count?: number | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_post_at?: string | null
          like_count?: number | null
          post_count?: number | null
          title?: string
          updated_at?: string
          user_id?: string | null
          username?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      popular_tags: {
        Row: {
          last_used: string
          tag: string
          use_count: number | null
        }
        Insert: {
          last_used?: string
          tag: string
          use_count?: number | null
        }
        Update: {
          last_used?: string
          tag?: string
          use_count?: number | null
        }
        Relationships: []
      }
      post_upvotes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      thread_bookmarks: {
        Row: {
          created_at: string
          id: string
          thread_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          thread_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          thread_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      thread_tags: {
        Row: {
          created_at: string
          id: string
          tag: string
          thread_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tag: string
          thread_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tag?: string
          thread_id?: string
        }
        Relationships: []
      }
      thread_upvotes: {
        Row: {
          created_at: string
          id: string
          thread_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          thread_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          thread_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      thread_subscriptions: {
        Row: {
          created_at: string
          email_notifications: boolean | null
          id: string
          thread_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          thread_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          thread_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          read: boolean | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          media_types: string[] | null
          media_urls: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          media_types?: string[] | null
          media_urls?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          media_types?: string[] | null
          media_urls?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          email: string
          id: string
          location: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          email: string
          id: string
          location?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string
          id?: string
          location?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      scanner_links: {
        Row: {
          broadcastify_url: string | null
          city: string | null
          county: string | null
          created_at: string
          description: string | null
          frequency: string | null
          id: string
          is_active: boolean | null
          link_type: string | null
          listener_count: number | null
          notes: string | null
          other_url: string | null
          scanner_name: string
          scanner_radio_url: string | null
          state: string
          state_code: string
          updated_at: string
        }
        Insert: {
          broadcastify_url?: string | null
          city?: string | null
          county?: string | null
          created_at?: string
          description?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          link_type?: string | null
          listener_count?: number | null
          notes?: string | null
          other_url?: string | null
          scanner_name: string
          scanner_radio_url?: string | null
          state: string
          state_code: string
          updated_at?: string
        }
        Update: {
          broadcastify_url?: string | null
          city?: string | null
          county?: string | null
          created_at?: string
          description?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          link_type?: string | null
          listener_count?: number | null
          notes?: string | null
          other_url?: string | null
          scanner_name?: string
          scanner_radio_url?: string | null
          state?: string
          state_code?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      violations: {
        Row: {
          created_at: string
          description: string
          id: string
          incident_date: string
          latitude: number | null
          location_city: string | null
          location_state: string
          longitude: number | null
          media_urls: string[] | null
          status: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          incident_date: string
          latitude?: number | null
          location_city?: string | null
          location_state: string
          longitude?: number | null
          media_urls?: string[] | null
          status?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          incident_date?: string
          latitude?: number | null
          location_city?: string | null
          location_state?: string
          longitude?: number | null
          media_urls?: string[] | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "moderator"
        | "journalist"
        | "activist"
        | "attorney"
        | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "moderator",
        "journalist",
        "activist",
        "attorney",
        "user",
      ],
    },
  },
} as const
