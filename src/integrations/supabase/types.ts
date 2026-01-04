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
      agencies: {
        Row: {
          address: string | null
          agency_type: string
          city: string | null
          created_at: string | null
          id: string
          name: string
          phone: string | null
          state: string
          total_complaints: number | null
          total_violations: number | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          agency_type: string
          city?: string | null
          created_at?: string | null
          id?: string
          name: string
          phone?: string | null
          state: string
          total_complaints?: number | null
          total_violations?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          agency_type?: string
          city?: string | null
          created_at?: string | null
          id?: string
          name?: string
          phone?: string | null
          state?: string
          total_complaints?: number | null
          total_violations?: number | null
          updated_at?: string | null
          website?: string | null
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
      community_events: {
        Row: {
          city: string | null
          created_at: string | null
          description: string
          end_date: string | null
          event_type: string
          id: string
          is_published: boolean | null
          is_virtual: boolean | null
          location_name: string | null
          organizer_id: string | null
          start_date: string
          state: string | null
          title: string
          updated_at: string | null
          virtual_link: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          description: string
          end_date?: string | null
          event_type: string
          id?: string
          is_published?: boolean | null
          is_virtual?: boolean | null
          location_name?: string | null
          organizer_id?: string | null
          start_date: string
          state?: string | null
          title: string
          updated_at?: string | null
          virtual_link?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          description?: string
          end_date?: string | null
          event_type?: string
          id?: string
          is_published?: boolean | null
          is_virtual?: boolean | null
          location_name?: string | null
          organizer_id?: string | null
          start_date?: string
          state?: string | null
          title?: string
          updated_at?: string | null
          virtual_link?: string | null
        }
        Relationships: []
      }
      content_reports: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          reason: string
          reporter_id: string
          status: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          reason: string
          reporter_id: string
          status?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          reason?: string
          reporter_id?: string
          status?: string | null
        }
        Relationships: []
      }
      direct_messages: {
        Row: {
          content: string
          created_at: string | null
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
          created_at?: string | null
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
          created_at?: string | null
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
      event_rsvps: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "community_events"
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
      forum_threads: {
        Row: {
          category: string
          content: string
          created_at: string | null
          id: string
          is_deleted: boolean | null
          is_pinned: boolean | null
          last_post_at: string | null
          like_count: number | null
          post_count: number | null
          title: string
          updated_at: string | null
          user_id: string
          view_count: number | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_pinned?: boolean | null
          last_post_at?: string | null
          like_count?: number | null
          post_count?: number | null
          title: string
          updated_at?: string | null
          user_id: string
          view_count?: number | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_pinned?: boolean | null
          last_post_at?: string | null
          like_count?: number | null
          post_count?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
          view_count?: number | null
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
      officers: {
        Row: {
          agency_id: string | null
          badge_number: string
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          rank: string | null
          total_violations: number | null
          updated_at: string | null
        }
        Insert: {
          agency_id?: string | null
          badge_number: string
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          rank?: string | null
          total_violations?: number | null
          updated_at?: string | null
        }
        Update: {
          agency_id?: string | null
          badge_number?: string
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          rank?: string | null
          total_violations?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "officers_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      panic_alerts: {
        Row: {
          address: string | null
          alert_type: string | null
          created_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          notes: string | null
          recording_url: string | null
          resolved_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          alert_type?: string | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          recording_url?: string | null
          resolved_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          alert_type?: string | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          recording_url?: string | null
          resolved_at?: string | null
          status?: string | null
          user_id?: string
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
      resource_library: {
        Row: {
          avg_rating: number | null
          category: string[] | null
          created_at: string | null
          description: string | null
          download_count: number | null
          id: string
          is_featured: boolean | null
          resource_type: string
          submitter_id: string | null
          title: string
          total_ratings: number | null
          updated_at: string | null
          url: string
        }
        Insert: {
          avg_rating?: number | null
          category?: string[] | null
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          id?: string
          is_featured?: boolean | null
          resource_type: string
          submitter_id?: string | null
          title: string
          total_ratings?: number | null
          updated_at?: string | null
          url: string
        }
        Update: {
          avg_rating?: number | null
          category?: string[] | null
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          id?: string
          is_featured?: boolean | null
          resource_type?: string
          submitter_id?: string | null
          title?: string
          total_ratings?: number | null
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      resource_ratings: {
        Row: {
          created_at: string | null
          id: string
          rating: number | null
          resource_id: string
          review: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          rating?: number | null
          resource_id: string
          review?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          rating?: number | null
          resource_id?: string
          review?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_ratings_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resource_library"
            referencedColumns: ["id"]
          },
        ]
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
      success_stories: {
        Row: {
          case_type: string | null
          created_at: string | null
          id: string
          is_verified: boolean | null
          outcome: string | null
          state: string | null
          story: string
          submitter_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          case_type?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          outcome?: string | null
          state?: string | null
          story: string
          submitter_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          case_type?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          outcome?: string | null
          state?: string | null
          story?: string
          submitter_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      thread_bookmarks: {
        Row: {
          created_at: string | null
          id: string
          thread_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          thread_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thread_bookmarks_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_subscriptions: {
        Row: {
          created_at: string | null
          id: string
          thread_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          thread_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thread_subscriptions_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_tags: {
        Row: {
          created_at: string | null
          id: string
          tag: string
          thread_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          tag: string
          thread_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          tag?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thread_tags_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_upvotes: {
        Row: {
          created_at: string | null
          id: string
          thread_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          thread_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thread_upvotes_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          badges: string[] | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string
          location: string | null
          reputation_score: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          badges?: string[] | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          location?: string | null
          reputation_score?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          badges?: string[] | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          location?: string | null
          reputation_score?: number | null
          updated_at?: string | null
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
      violation_agencies: {
        Row: {
          agency_id: string | null
          created_at: string | null
          id: string
          violation_id: string | null
        }
        Insert: {
          agency_id?: string | null
          created_at?: string | null
          id?: string
          violation_id?: string | null
        }
        Update: {
          agency_id?: string | null
          created_at?: string | null
          id?: string
          violation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "violation_agencies_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "violation_agencies_violation_id_fkey"
            columns: ["violation_id"]
            isOneToOne: false
            referencedRelation: "violations"
            referencedColumns: ["id"]
          },
        ]
      }
      violation_officers: {
        Row: {
          created_at: string | null
          id: string
          officer_id: string | null
          violation_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          officer_id?: string | null
          violation_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          officer_id?: string | null
          violation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "violation_officers_officer_id_fkey"
            columns: ["officer_id"]
            isOneToOne: false
            referencedRelation: "officers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "violation_officers_violation_id_fkey"
            columns: ["violation_id"]
            isOneToOne: false
            referencedRelation: "violations"
            referencedColumns: ["id"]
          },
        ]
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
