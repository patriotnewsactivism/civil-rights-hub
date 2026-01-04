export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      action_templates: {
        Row: {
          bill_id: string | null
          body_text: string
          created_at: string | null
          id: string
          position: string
          subject_line: string | null
          template_type: string
          updated_at: string | null
        }
        Insert: {
          bill_id?: string | null
          body_text: string
          created_at?: string | null
          id?: string
          position: string
          subject_line?: string | null
          template_type: string
          updated_at?: string | null
        }
        Update: {
          bill_id?: string | null
          body_text?: string
          created_at?: string | null
          id?: string
          position?: string
          subject_line?: string | null
          template_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "action_templates_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "legislation"
            referencedColumns: ["id"]
          },
        ]
      }
      activists: {
        Row: {
          alias: string | null
          bio: string | null
          channel_url: string | null
          created_at: string | null
          focus_areas: string[] | null
          home_state: string | null
          id: string
          name: string
          primary_platform: string | null
          profile_image_url: string | null
          updated_at: string | null
          user_submitted: boolean | null
          verified: boolean | null
        }
        Insert: {
          alias?: string | null
          bio?: string | null
          channel_url?: string | null
          created_at?: string | null
          focus_areas?: string[] | null
          home_state?: string | null
          id?: string
          name: string
          primary_platform?: string | null
          profile_image_url?: string | null
          updated_at?: string | null
          user_submitted?: boolean | null
          verified?: boolean | null
        }
        Update: {
          alias?: string | null
          bio?: string | null
          channel_url?: string | null
          created_at?: string | null
          focus_areas?: string[] | null
          home_state?: string | null
          id?: string
          name?: string
          primary_platform?: string | null
          profile_image_url?: string | null
          updated_at?: string | null
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
          total_settlements_paid: number | null
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
          total_settlements_paid?: number | null
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
          total_settlements_paid?: number | null
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
          created_at: string
          email: string | null
          firm: string | null
          id: string
          languages: string[] | null
          name: string
          phone: string | null
          practice_areas: string[]
          rating: number | null
          review_count: number | null
          specialties: string[] | null
          state: string
          updated_at: string
          website: string | null
          years_experience: number | null
        }
        Insert: {
          accepts_pro_bono?: boolean | null
          bar_number?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          firm?: string | null
          id?: string
          languages?: string[] | null
          name: string
          phone?: string | null
          practice_areas: string[]
          rating?: number | null
          review_count?: number | null
          specialties?: string[] | null
          state: string
          updated_at?: string
          website?: string | null
          years_experience?: number | null
        }
        Update: {
          accepts_pro_bono?: boolean | null
          bar_number?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          firm?: string | null
          id?: string
          languages?: string[] | null
          name?: string
          phone?: string | null
          practice_areas?: string[]
          rating?: number | null
          review_count?: number | null
          specialties?: string[] | null
          state?: string
          updated_at?: string
          website?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      bill_sponsors: {
        Row: {
          bill_id: string | null
          created_at: string | null
          id: string
          is_primary: boolean | null
          representative_id: string | null
        }
        Insert: {
          bill_id?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          representative_id?: string | null
        }
        Update: {
          bill_id?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          representative_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bill_sponsors_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "legislation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bill_sponsors_representative_id_fkey"
            columns: ["representative_id"]
            isOneToOne: false
            referencedRelation: "representatives"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "comment_upvotes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "violation_comments"
            referencedColumns: ["id"]
          },
        ]
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
          latitude: number | null
          location_name: string | null
          longitude: number | null
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
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
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
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
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
      court_calendars: {
        Row: {
          address: string | null
          case_name: string
          case_number: string | null
          case_type: string | null
          city: string
          court_name: string
          court_type: string | null
          courtroom: string | null
          created_at: string
          defendant: string | null
          description: string
          external_url: string | null
          hearing_date: string
          hearing_type: string | null
          id: string
          is_public: boolean | null
          issues: string[] | null
          judge_name: string | null
          notes: string | null
          organizations_involved: string[] | null
          phone_number: string | null
          plaintiff: string | null
          state: string
          status: string | null
          updated_at: string
          zoom_link: string | null
        }
        Insert: {
          address?: string | null
          case_name: string
          case_number?: string | null
          case_type?: string | null
          city: string
          court_name: string
          court_type?: string | null
          courtroom?: string | null
          created_at?: string
          defendant?: string | null
          description: string
          external_url?: string | null
          hearing_date: string
          hearing_type?: string | null
          id?: string
          is_public?: boolean | null
          issues?: string[] | null
          judge_name?: string | null
          notes?: string | null
          organizations_involved?: string[] | null
          phone_number?: string | null
          plaintiff?: string | null
          state: string
          status?: string | null
          updated_at?: string
          zoom_link?: string | null
        }
        Update: {
          address?: string | null
          case_name?: string
          case_number?: string | null
          case_type?: string | null
          city?: string
          court_name?: string
          court_type?: string | null
          courtroom?: string | null
          created_at?: string
          defendant?: string | null
          description?: string
          external_url?: string | null
          hearing_date?: string
          hearing_type?: string | null
          id?: string
          is_public?: boolean | null
          issues?: string[] | null
          judge_name?: string | null
          notes?: string | null
          organizations_involved?: string[] | null
          phone_number?: string | null
          plaintiff?: string | null
          state?: string
          status?: string | null
          updated_at?: string
          zoom_link?: string | null
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
          is_starred_by_recipient: boolean | null
          is_starred_by_sender: boolean | null
          parent_message_id: string | null
          read_at: string | null
          recipient_id: string
          sender_id: string
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_deleted_by_recipient?: boolean | null
          is_deleted_by_sender?: boolean | null
          is_read?: boolean | null
          is_starred_by_recipient?: boolean | null
          is_starred_by_sender?: boolean | null
          parent_message_id?: string | null
          read_at?: string | null
          recipient_id: string
          sender_id: string
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_deleted_by_recipient?: boolean | null
          is_deleted_by_sender?: boolean | null
          is_read?: boolean | null
          is_starred_by_recipient?: boolean | null
          is_starred_by_sender?: boolean | null
          parent_message_id?: string | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "direct_messages_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "direct_messages"
            referencedColumns: ["id"]
          },
        ]
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
      federal_laws: {
        Row: {
          amendments: string | null
          category: string
          created_at: string
          enforcement_details: string | null
          enforcing_agency: string | null
          external_links: Json | null
          full_text: string | null
          id: string
          key_provisions: string[] | null
          protected_classes: string[] | null
          related_laws: string[] | null
          short_name: string | null
          statute_citation: string
          summary: string
          title: string
          updated_at: string
          year_enacted: number | null
        }
        Insert: {
          amendments?: string | null
          category: string
          created_at?: string
          enforcement_details?: string | null
          enforcing_agency?: string | null
          external_links?: Json | null
          full_text?: string | null
          id?: string
          key_provisions?: string[] | null
          protected_classes?: string[] | null
          related_laws?: string[] | null
          short_name?: string | null
          statute_citation: string
          summary: string
          title: string
          updated_at?: string
          year_enacted?: number | null
        }
        Update: {
          amendments?: string | null
          category?: string
          created_at?: string
          enforcement_details?: string | null
          enforcing_agency?: string | null
          external_links?: Json | null
          full_text?: string | null
          id?: string
          key_provisions?: string[] | null
          protected_classes?: string[] | null
          related_laws?: string[] | null
          short_name?: string | null
          statute_citation?: string
          summary?: string
          title?: string
          updated_at?: string
          year_enacted?: number | null
        }
        Relationships: []
      }
      foia_agencies: {
        Row: {
          accepts_email: boolean | null
          accepts_fax: boolean | null
          accepts_in_person: boolean | null
          accepts_mail: boolean | null
          accepts_online: boolean | null
          acronym: string | null
          agency_type: string
          appeal_response_days: number | null
          city: string | null
          city_address: string | null
          county: string | null
          created_at: string | null
          expedited_response_days: number | null
          fee_structure: string | null
          fee_waiver_available: boolean | null
          foia_contact_name: string | null
          foia_email: string | null
          foia_fax: string | null
          foia_guide_url: string | null
          foia_office_name: string | null
          foia_online_portal_url: string | null
          foia_phone: string | null
          has_fees: boolean | null
          id: string
          is_active: boolean | null
          mailing_address: string | null
          name: string
          notes: string | null
          parent_agency_id: string | null
          standard_response_days: number | null
          state: string | null
          state_address: string | null
          street_address: string | null
          updated_at: string | null
          verified_date: string | null
          website_url: string | null
          zip_code: string | null
        }
        Insert: {
          accepts_email?: boolean | null
          accepts_fax?: boolean | null
          accepts_in_person?: boolean | null
          accepts_mail?: boolean | null
          accepts_online?: boolean | null
          acronym?: string | null
          agency_type: string
          appeal_response_days?: number | null
          city?: string | null
          city_address?: string | null
          county?: string | null
          created_at?: string | null
          expedited_response_days?: number | null
          fee_structure?: string | null
          fee_waiver_available?: boolean | null
          foia_contact_name?: string | null
          foia_email?: string | null
          foia_fax?: string | null
          foia_guide_url?: string | null
          foia_office_name?: string | null
          foia_online_portal_url?: string | null
          foia_phone?: string | null
          has_fees?: boolean | null
          id?: string
          is_active?: boolean | null
          mailing_address?: string | null
          name: string
          notes?: string | null
          parent_agency_id?: string | null
          standard_response_days?: number | null
          state?: string | null
          state_address?: string | null
          street_address?: string | null
          updated_at?: string | null
          verified_date?: string | null
          website_url?: string | null
          zip_code?: string | null
        }
        Update: {
          accepts_email?: boolean | null
          accepts_fax?: boolean | null
          accepts_in_person?: boolean | null
          accepts_mail?: boolean | null
          accepts_online?: boolean | null
          acronym?: string | null
          agency_type?: string
          appeal_response_days?: number | null
          city?: string | null
          city_address?: string | null
          county?: string | null
          created_at?: string | null
          expedited_response_days?: number | null
          fee_structure?: string | null
          fee_waiver_available?: boolean | null
          foia_contact_name?: string | null
          foia_email?: string | null
          foia_fax?: string | null
          foia_guide_url?: string | null
          foia_office_name?: string | null
          foia_online_portal_url?: string | null
          foia_phone?: string | null
          has_fees?: boolean | null
          id?: string
          is_active?: boolean | null
          mailing_address?: string | null
          name?: string
          notes?: string | null
          parent_agency_id?: string | null
          standard_response_days?: number | null
          state?: string | null
          state_address?: string | null
          street_address?: string | null
          updated_at?: string | null
          verified_date?: string | null
          website_url?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "foia_agencies_parent_agency_id_fkey"
            columns: ["parent_agency_id"]
            isOneToOne: false
            referencedRelation: "foia_agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      foia_documents: {
        Row: {
          file_name: string
          file_size: number | null
          file_type: string | null
          id: string
          notes: string | null
          request_id: string | null
          storage_path: string
          uploaded_at: string | null
        }
        Insert: {
          file_name: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          notes?: string | null
          request_id?: string | null
          storage_path: string
          uploaded_at?: string | null
        }
        Update: {
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          notes?: string | null
          request_id?: string | null
          storage_path?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "foia_documents_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "foia_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      foia_request_updates: {
        Row: {
          created_at: string | null
          id: string
          message: string
          new_status: string | null
          old_status: string | null
          request_id: string | null
          update_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          new_status?: string | null
          old_status?: string | null
          request_id?: string | null
          update_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          new_status?: string | null
          old_status?: string | null
          request_id?: string | null
          update_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "foia_request_updates_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "foia_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      foia_requests: {
        Row: {
          acknowledgment_received_date: string | null
          agency_id: string | null
          agency_name: string
          agency_type: string | null
          appeal_date: string | null
          appeal_filed: boolean | null
          confirmation_email: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          follow_up_count: number | null
          id: string
          notes: string | null
          request_body: string
          request_subject: string
          response_deadline: string | null
          response_received_date: string | null
          state: string | null
          status: string | null
          submitted_date: string | null
          template_id: string | null
          tracking_number: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          acknowledgment_received_date?: string | null
          agency_id?: string | null
          agency_name: string
          agency_type?: string | null
          appeal_date?: string | null
          appeal_filed?: boolean | null
          confirmation_email?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          follow_up_count?: number | null
          id?: string
          notes?: string | null
          request_body: string
          request_subject: string
          response_deadline?: string | null
          response_received_date?: string | null
          state?: string | null
          status?: string | null
          submitted_date?: string | null
          template_id?: string | null
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          acknowledgment_received_date?: string | null
          agency_id?: string | null
          agency_name?: string
          agency_type?: string | null
          appeal_date?: string | null
          appeal_filed?: boolean | null
          confirmation_email?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          follow_up_count?: number | null
          id?: string
          notes?: string | null
          request_body?: string
          request_subject?: string
          response_deadline?: string | null
          response_received_date?: string | null
          state?: string | null
          status?: string | null
          submitted_date?: string | null
          template_id?: string | null
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "foia_requests_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "foia_agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "foia_requests_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "foia_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      foia_templates: {
        Row: {
          agency_name: string | null
          agency_type: string | null
          appeal_process: string | null
          created_at: string
          fee_information: string | null
          id: string
          instructions: string
          is_popular: boolean | null
          notes: string | null
          response_deadline_days: number | null
          state: string | null
          state_code: string | null
          statute_citation: string | null
          subject_line: string
          submission_address: string | null
          submission_email: string | null
          submission_method: string[] | null
          submission_url: string | null
          template_body: string
          template_type: string | null
          title: string
          updated_at: string
          use_count: number | null
        }
        Insert: {
          agency_name?: string | null
          agency_type?: string | null
          appeal_process?: string | null
          created_at?: string
          fee_information?: string | null
          id?: string
          instructions: string
          is_popular?: boolean | null
          notes?: string | null
          response_deadline_days?: number | null
          state?: string | null
          state_code?: string | null
          statute_citation?: string | null
          subject_line: string
          submission_address?: string | null
          submission_email?: string | null
          submission_method?: string[] | null
          submission_url?: string | null
          template_body: string
          template_type?: string | null
          title: string
          updated_at?: string
          use_count?: number | null
        }
        Update: {
          agency_name?: string | null
          agency_type?: string | null
          appeal_process?: string | null
          created_at?: string
          fee_information?: string | null
          id?: string
          instructions?: string
          is_popular?: boolean | null
          notes?: string | null
          response_deadline_days?: number | null
          state?: string | null
          state_code?: string | null
          statute_citation?: string | null
          subject_line?: string
          submission_address?: string | null
          submission_email?: string | null
          submission_method?: string[] | null
          submission_url?: string | null
          template_body?: string
          template_type?: string | null
          title?: string
          updated_at?: string
          use_count?: number | null
        }
        Relationships: []
      }
      forum_post_votes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_post_votes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          content: string
          created_at: string
          downvotes: number | null
          id: string
          is_deleted: boolean | null
          is_edited: boolean | null
          like_count: number | null
          parent_post_id: string | null
          thread_id: string
          updated_at: string
          upvotes: number | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          content: string
          created_at?: string
          downvotes?: number | null
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          like_count?: number | null
          parent_post_id?: string | null
          thread_id: string
          updated_at?: string
          upvotes?: number | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          downvotes?: number | null
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          like_count?: number | null
          parent_post_id?: string | null
          thread_id?: string
          updated_at?: string
          upvotes?: number | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_parent_post_id_fkey"
            columns: ["parent_post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_posts_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
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
      legislation: {
        Row: {
          bill_number: string
          category: string[] | null
          created_at: string | null
          description: string | null
          full_text_url: string | null
          id: string
          introduced_date: string | null
          last_action_date: string | null
          last_action_description: string | null
          level: string
          oppose_count: number | null
          primary_sponsor_id: string | null
          state: string | null
          status: string
          support_count: number | null
          title: string
          updated_at: string | null
          vote_count_abstain: number | null
          vote_count_no: number | null
          vote_count_yes: number | null
        }
        Insert: {
          bill_number: string
          category?: string[] | null
          created_at?: string | null
          description?: string | null
          full_text_url?: string | null
          id?: string
          introduced_date?: string | null
          last_action_date?: string | null
          last_action_description?: string | null
          level: string
          oppose_count?: number | null
          primary_sponsor_id?: string | null
          state?: string | null
          status: string
          support_count?: number | null
          title: string
          updated_at?: string | null
          vote_count_abstain?: number | null
          vote_count_no?: number | null
          vote_count_yes?: number | null
        }
        Update: {
          bill_number?: string
          category?: string[] | null
          created_at?: string | null
          description?: string | null
          full_text_url?: string | null
          id?: string
          introduced_date?: string | null
          last_action_date?: string | null
          last_action_description?: string | null
          level?: string
          oppose_count?: number | null
          primary_sponsor_id?: string | null
          state?: string | null
          status?: string
          support_count?: number | null
          title?: string
          updated_at?: string | null
          vote_count_abstain?: number | null
          vote_count_no?: number | null
          vote_count_yes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "legislation_primary_sponsor_id_fkey"
            columns: ["primary_sponsor_id"]
            isOneToOne: false
            referencedRelation: "representatives"
            referencedColumns: ["id"]
          },
        ]
      }
      legislative_actions: {
        Row: {
          action_type: string
          bill_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          representative_id: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          bill_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          representative_id?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          bill_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          representative_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "legislative_actions_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "legislation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "legislative_actions_representative_id_fkey"
            columns: ["representative_id"]
            isOneToOne: false
            referencedRelation: "representatives"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          comment_id: string | null
          content: string | null
          created_at: string | null
          from_user_id: string | null
          id: string
          is_read: boolean | null
          message_id: string | null
          post_id: string | null
          thread_id: string | null
          type: string
          user_id: string
          violation_comment_id: string | null
          violation_id: string | null
        }
        Insert: {
          comment_id?: string | null
          content?: string | null
          created_at?: string | null
          from_user_id?: string | null
          id?: string
          is_read?: boolean | null
          message_id?: string | null
          post_id?: string | null
          thread_id?: string | null
          type: string
          user_id: string
          violation_comment_id?: string | null
          violation_id?: string | null
        }
        Update: {
          comment_id?: string | null
          content?: string | null
          created_at?: string | null
          from_user_id?: string | null
          id?: string
          is_read?: boolean | null
          message_id?: string | null
          post_id?: string | null
          thread_id?: string | null
          type?: string
          user_id?: string
          violation_comment_id?: string | null
          violation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "direct_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_violation_comment_id_fkey"
            columns: ["violation_comment_id"]
            isOneToOne: false
            referencedRelation: "violation_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_violation_id_fkey"
            columns: ["violation_id"]
            isOneToOne: false
            referencedRelation: "violations"
            referencedColumns: ["id"]
          },
        ]
      }
      officers: {
        Row: {
          agency_id: string | null
          badge_number: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          rank: string | null
          total_complaints: number | null
          total_violations: number | null
          updated_at: string | null
        }
        Insert: {
          agency_id?: string | null
          badge_number?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          rank?: string | null
          total_complaints?: number | null
          total_violations?: number | null
          updated_at?: string | null
        }
        Update: {
          agency_id?: string | null
          badge_number?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          rank?: string | null
          total_complaints?: number | null
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
          alert_type: string
          contacts_notified: string[] | null
          created_at: string
          id: string
          latitude: number
          longitude: number
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
          latitude: number
          longitude: number
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
          latitude?: number
          longitude?: number
          message?: string | null
          resolved_at?: string | null
          status?: string | null
          user_id?: string
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
      post_likes: {
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
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_shares: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          share_comment: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          share_comment?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          share_comment?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_shares_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "post_upvotes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          comments_count: number | null
          content: string
          created_at: string | null
          hashtags: string[] | null
          id: string
          image_url: string | null
          is_pinned: boolean | null
          likes_count: number | null
          link_title: string | null
          link_url: string | null
          mentioned_users: string[] | null
          post_type: string | null
          reference_id: string | null
          reference_type: string | null
          shares_count: number | null
          updated_at: string | null
          user_id: string
          visibility: string | null
        }
        Insert: {
          comments_count?: number | null
          content: string
          created_at?: string | null
          hashtags?: string[] | null
          id?: string
          image_url?: string | null
          is_pinned?: boolean | null
          likes_count?: number | null
          link_title?: string | null
          link_url?: string | null
          mentioned_users?: string[] | null
          post_type?: string | null
          reference_id?: string | null
          reference_type?: string | null
          shares_count?: number | null
          updated_at?: string | null
          user_id: string
          visibility?: string | null
        }
        Update: {
          comments_count?: number | null
          content?: string
          created_at?: string | null
          hashtags?: string[] | null
          id?: string
          image_url?: string | null
          is_pinned?: boolean | null
          likes_count?: number | null
          link_title?: string | null
          link_url?: string | null
          mentioned_users?: string[] | null
          post_type?: string | null
          reference_id?: string | null
          reference_type?: string | null
          shares_count?: number | null
          updated_at?: string | null
          user_id?: string
          visibility?: string | null
        }
        Relationships: []
      }
      press_freedom_incidents: {
        Row: {
          agency_involved: string | null
          charges: string | null
          city: string | null
          created_at: string
          description: string
          id: string
          incident_date: string
          location_description: string | null
          outlet_name: string | null
          source_org: string | null
          source_url: string
          state: string
          target_name: string | null
          target_type: string
          updated_at: string
          verified: boolean | null
          verified_at: string | null
          violation_type: string
        }
        Insert: {
          agency_involved?: string | null
          charges?: string | null
          city?: string | null
          created_at?: string
          description: string
          id?: string
          incident_date: string
          location_description?: string | null
          outlet_name?: string | null
          source_org?: string | null
          source_url: string
          state: string
          target_name?: string | null
          target_type: string
          updated_at?: string
          verified?: boolean | null
          verified_at?: string | null
          violation_type: string
        }
        Update: {
          agency_involved?: string | null
          charges?: string | null
          city?: string | null
          created_at?: string
          description?: string
          id?: string
          incident_date?: string
          location_description?: string | null
          outlet_name?: string | null
          source_org?: string | null
          source_url?: string
          state?: string
          target_name?: string | null
          target_type?: string
          updated_at?: string
          verified?: boolean | null
          verified_at?: string | null
          violation_type?: string
        }
        Relationships: []
      }
      representatives: {
        Row: {
          chamber: string | null
          created_at: string | null
          district: string | null
          email: string | null
          facebook: string | null
          id: string
          level: string
          name: string
          office_address: string | null
          official_id: string | null
          party: string | null
          phone: string | null
          position: string
          state: string | null
          twitter: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          chamber?: string | null
          created_at?: string | null
          district?: string | null
          email?: string | null
          facebook?: string | null
          id?: string
          level: string
          name: string
          office_address?: string | null
          official_id?: string | null
          party?: string | null
          phone?: string | null
          position: string
          state?: string | null
          twitter?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          chamber?: string | null
          created_at?: string | null
          district?: string | null
          email?: string | null
          facebook?: string | null
          id?: string
          level?: string
          name?: string
          office_address?: string | null
          official_id?: string | null
          party?: string | null
          phone?: string | null
          position?: string
          state?: string | null
          twitter?: string | null
          updated_at?: string | null
          website?: string | null
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
          rating: number | null
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
          rating?: number | null
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
          rating?: number | null
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
      scanner_frequencies: {
        Row: {
          agency_id: string | null
          agency_name: string
          agency_type: string | null
          city: string | null
          county: string | null
          created_at: string
          encryption: string | null
          frequency_mhz: number
          id: string
          jurisdiction: string | null
          modulation: string | null
          nac_or_ctcss: string | null
          notes: string | null
          source_type: string
          source_url: string
          state: string
          talkgroup_id: string | null
          trunked_system: string | null
          updated_at: string
          verified: boolean | null
          verified_at: string | null
        }
        Insert: {
          agency_id?: string | null
          agency_name: string
          agency_type?: string | null
          city?: string | null
          county?: string | null
          created_at?: string
          encryption?: string | null
          frequency_mhz: number
          id?: string
          jurisdiction?: string | null
          modulation?: string | null
          nac_or_ctcss?: string | null
          notes?: string | null
          source_type: string
          source_url: string
          state: string
          talkgroup_id?: string | null
          trunked_system?: string | null
          updated_at?: string
          verified?: boolean | null
          verified_at?: string | null
        }
        Update: {
          agency_id?: string | null
          agency_name?: string
          agency_type?: string | null
          city?: string | null
          county?: string | null
          created_at?: string
          encryption?: string | null
          frequency_mhz?: number
          id?: string
          jurisdiction?: string | null
          modulation?: string | null
          nac_or_ctcss?: string | null
          notes?: string | null
          source_type?: string
          source_url?: string
          state?: string
          talkgroup_id?: string | null
          trunked_system?: string | null
          updated_at?: string
          verified?: boolean | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scanner_frequencies_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      scanner_links: {
        Row: {
          agency_name: string | null
          broadcastify_url: string | null
          city: string | null
          county: string | null
          created_at: string
          description: string | null
          feed_type: string | null
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
          agency_name?: string | null
          broadcastify_url?: string | null
          city?: string | null
          county?: string | null
          created_at?: string
          description?: string | null
          feed_type?: string | null
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
          agency_name?: string | null
          broadcastify_url?: string | null
          city?: string | null
          county?: string | null
          created_at?: string
          description?: string | null
          feed_type?: string | null
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
      state_laws: {
        Row: {
          activist_protections: string | null
          assembly_rights_details: string | null
          can_record_police: boolean
          created_at: string
          has_shield_law: boolean | null
          id: string
          journalist_protections: string | null
          marijuana_cultivation_limit: string | null
          marijuana_decrim_amount: string | null
          marijuana_decrim_penalty: string | null
          marijuana_dispensaries_operational: boolean | null
          marijuana_employment_protections: boolean | null
          marijuana_expungement_available: boolean | null
          marijuana_felony_threshold: string | null
          marijuana_home_cultivation_allowed: boolean | null
          marijuana_last_updated: string | null
          marijuana_medical_conditions: string[] | null
          marijuana_notes: string | null
          marijuana_possession_limit: string | null
          marijuana_social_consumption_allowed: boolean | null
          marijuana_status: string | null
          police_recording_details: string
          police_recording_restrictions: string | null
          protest_permit_required: boolean | null
          recording_consent_type: string
          recording_law_citation: string | null
          recording_law_details: string
          shield_law_details: string | null
          state: string
          state_aclu_url: string | null
          state_code: string
          state_legal_aid_url: string | null
          state_resources: Json | null
          updated_at: string
        }
        Insert: {
          activist_protections?: string | null
          assembly_rights_details?: string | null
          can_record_police?: boolean
          created_at?: string
          has_shield_law?: boolean | null
          id?: string
          journalist_protections?: string | null
          marijuana_cultivation_limit?: string | null
          marijuana_decrim_amount?: string | null
          marijuana_decrim_penalty?: string | null
          marijuana_dispensaries_operational?: boolean | null
          marijuana_employment_protections?: boolean | null
          marijuana_expungement_available?: boolean | null
          marijuana_felony_threshold?: string | null
          marijuana_home_cultivation_allowed?: boolean | null
          marijuana_last_updated?: string | null
          marijuana_medical_conditions?: string[] | null
          marijuana_notes?: string | null
          marijuana_possession_limit?: string | null
          marijuana_social_consumption_allowed?: boolean | null
          marijuana_status?: string | null
          police_recording_details: string
          police_recording_restrictions?: string | null
          protest_permit_required?: boolean | null
          recording_consent_type: string
          recording_law_citation?: string | null
          recording_law_details: string
          shield_law_details?: string | null
          state: string
          state_aclu_url?: string | null
          state_code: string
          state_legal_aid_url?: string | null
          state_resources?: Json | null
          updated_at?: string
        }
        Update: {
          activist_protections?: string | null
          assembly_rights_details?: string | null
          can_record_police?: boolean
          created_at?: string
          has_shield_law?: boolean | null
          id?: string
          journalist_protections?: string | null
          marijuana_cultivation_limit?: string | null
          marijuana_decrim_amount?: string | null
          marijuana_decrim_penalty?: string | null
          marijuana_dispensaries_operational?: boolean | null
          marijuana_employment_protections?: boolean | null
          marijuana_expungement_available?: boolean | null
          marijuana_felony_threshold?: string | null
          marijuana_home_cultivation_allowed?: boolean | null
          marijuana_last_updated?: string | null
          marijuana_medical_conditions?: string[] | null
          marijuana_notes?: string | null
          marijuana_possession_limit?: string | null
          marijuana_social_consumption_allowed?: boolean | null
          marijuana_status?: string | null
          police_recording_details?: string
          police_recording_restrictions?: string | null
          protest_permit_required?: boolean | null
          recording_consent_type?: string
          recording_law_citation?: string | null
          recording_law_details?: string
          shield_law_details?: string | null
          state?: string
          state_aclu_url?: string | null
          state_code?: string
          state_legal_aid_url?: string | null
          state_resources?: Json | null
          updated_at?: string
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
          submitted_by: string | null
          submitter_name: string | null
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
          submitted_by?: string | null
          submitter_name?: string | null
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
          submitted_by?: string | null
          submitter_name?: string | null
          title?: string
          updated_at?: string
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
          created_at: string
          email_notifications: boolean | null
          id: string
          thread_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          thread_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_notifications?: boolean | null
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
      user_activity: {
        Row: {
          activity_type: string
          created_at: string | null
          id: string
          reference_id: string | null
          reference_type: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_description: string | null
          badge_icon: string | null
          badge_name: string
          badge_type: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_description?: string | null
          badge_icon?: string | null
          badge_name: string
          badge_type: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_description?: string | null
          badge_icon?: string | null
          badge_name?: string
          badge_type?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_connections: {
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
      user_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          helper_score: number | null
          helpful_answers: number | null
          id: string
          is_public: boolean | null
          is_verified: boolean | null
          last_seen_at: string | null
          location_city: string | null
          location_state: string | null
          messages_sent_count: number | null
          posts_created: number | null
          reputation_points: number | null
          role: string | null
          show_email: boolean | null
          show_location: boolean | null
          threads_created: number | null
          twitter_handle: string | null
          updated_at: string
          user_id: string
          username: string | null
          violations_count: number | null
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          helper_score?: number | null
          helpful_answers?: number | null
          id?: string
          is_public?: boolean | null
          is_verified?: boolean | null
          last_seen_at?: string | null
          location_city?: string | null
          location_state?: string | null
          messages_sent_count?: number | null
          posts_created?: number | null
          reputation_points?: number | null
          role?: string | null
          show_email?: boolean | null
          show_location?: boolean | null
          threads_created?: number | null
          twitter_handle?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
          violations_count?: number | null
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          helper_score?: number | null
          helpful_answers?: number | null
          id?: string
          is_public?: boolean | null
          is_verified?: boolean | null
          last_seen_at?: string | null
          location_city?: string | null
          location_state?: string | null
          messages_sent_count?: number | null
          posts_created?: number | null
          reputation_points?: number | null
          role?: string | null
          show_email?: boolean | null
          show_location?: boolean | null
          threads_created?: number | null
          twitter_handle?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
          violations_count?: number | null
          website_url?: string | null
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
      violation_comment_votes: {
        Row: {
          comment_id: string
          created_at: string | null
          id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          comment_id: string
          created_at?: string | null
          id?: string
          user_id: string
          vote_type: string
        }
        Update: {
          comment_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "violation_comment_votes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "violation_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      violation_comments: {
        Row: {
          content: string
          created_at: string
          downvotes: number | null
          id: string
          is_deleted: boolean | null
          like_count: number | null
          updated_at: string
          upvotes: number | null
          user_id: string | null
          username: string | null
          violation_id: string
        }
        Insert: {
          content: string
          created_at?: string
          downvotes?: number | null
          id?: string
          is_deleted?: boolean | null
          like_count?: number | null
          updated_at?: string
          upvotes?: number | null
          user_id?: string | null
          username?: string | null
          violation_id: string
        }
        Update: {
          content?: string
          created_at?: string
          downvotes?: number | null
          id?: string
          is_deleted?: boolean | null
          like_count?: number | null
          updated_at?: string
          upvotes?: number | null
          user_id?: string | null
          username?: string | null
          violation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "violation_comments_violation_id_fkey"
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
      calculate_foia_deadline: {
        Args: { agency_type: string; submitted_date: string }
        Returns: string
      }
      check_and_award_badges: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      create_notification: {
        Args: {
          p_comment_id?: string
          p_content?: string
          p_from_user_id?: string
          p_message_id?: string
          p_post_id?: string
          p_thread_id?: string
          p_type: string
          p_user_id: string
          p_violation_comment_id?: string
          p_violation_id?: string
        }
        Returns: string
      }
      get_approaching_deadline_foia_requests: {
        Args: { p_days_threshold?: number; p_user_id?: string }
        Returns: {
          agency_name: string
          days_until_deadline: number
          request_id: string
          request_subject: string
          response_deadline: string
          status: string
          submitted_date: string
        }[]
      }
      get_contributor_level: { Args: { p_user_id: string }; Returns: string }
      get_conversation_partners: {
        Args: { p_user_id: string }
        Returns: {
          last_message_at: string
          partner_avatar_url: string
          partner_display_name: string
          partner_id: string
          partner_username: string
          unread_count: number
        }[]
      }
      get_feed_posts: {
        Args: { limit_count?: number; offset_count?: number; p_user_id: string }
        Returns: {
          comments_count: number
          content: string
          created_at: string
          hashtags: string[]
          image_url: string
          likes_count: number
          post_id: string
          post_type: string
          shares_count: number
          user_id: string
          visibility: string
        }[]
      }
      get_follower_count: { Args: { p_user_id: string }; Returns: number }
      get_following_count: { Args: { p_user_id: string }; Returns: number }
      get_message_thread: {
        Args: { p_message_id: string; p_user_id: string }
        Returns: {
          content: string
          created_at: string
          id: string
          is_deleted_by_recipient: boolean | null
          is_deleted_by_sender: boolean | null
          is_read: boolean | null
          is_starred_by_recipient: boolean | null
          is_starred_by_sender: boolean | null
          parent_message_id: string | null
          read_at: string | null
          recipient_id: string
          sender_id: string
          subject: string | null
          updated_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "direct_messages"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_overdue_foia_requests: {
        Args: { p_user_id?: string }
        Returns: {
          agency_name: string
          days_overdue: number
          request_id: string
          request_subject: string
          response_deadline: string
          status: string
          submitted_date: string
        }[]
      }
      get_starred_messages: {
        Args: { p_user_id: string }
        Returns: {
          content: string
          created_at: string
          id: string
          is_deleted_by_recipient: boolean | null
          is_deleted_by_sender: boolean | null
          is_read: boolean | null
          is_starred_by_recipient: boolean | null
          is_starred_by_sender: boolean | null
          parent_message_id: string | null
          read_at: string | null
          recipient_id: string
          sender_id: string
          subject: string | null
          updated_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "direct_messages"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_total_activity_count: { Args: { p_user_id: string }; Returns: number }
      get_trending_hashtags: {
        Args: { limit_count?: number }
        Returns: {
          count: number
          hashtag: string
        }[]
      }
      get_unread_message_count: { Args: { p_user_id: string }; Returns: number }
      get_unread_notifications_count: {
        Args: { p_user_id: string }
        Returns: number
      }
      get_user_forum_post_vote: {
        Args: { p_post_id: string; p_user_id: string }
        Returns: string
      }
      get_user_violation_comment_vote: {
        Args: { p_comment_id: string; p_user_id: string }
        Returns: string
      }
      is_following: {
        Args: { p_follower_id: string; p_following_id: string }
        Returns: boolean
      }
      mark_all_notifications_read: {
        Args: { p_user_id: string }
        Returns: number
      }
      mark_notification_read: {
        Args: { p_notification_id: string; p_user_id: string }
        Returns: boolean
      }
      search_messages: {
        Args: { p_limit?: number; p_query: string; p_user_id: string }
        Returns: {
          content: string
          created_at: string
          id: string
          is_deleted_by_recipient: boolean | null
          is_deleted_by_sender: boolean | null
          is_read: boolean | null
          is_starred_by_recipient: boolean | null
          is_starred_by_sender: boolean | null
          parent_message_id: string | null
          read_at: string | null
          recipient_id: string
          sender_id: string
          subject: string | null
          updated_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "direct_messages"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      toggle_message_star: {
        Args: { p_message_id: string; p_user_id: string }
        Returns: boolean
      }
      update_user_last_seen: { Args: { p_user_id: string }; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

