export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      documents: {
        Row: {
          created_at: string
          doc_type: string | null
          file_path: string
          id: string
          org_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          doc_type?: string | null
          file_path: string
          id?: string
          org_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          doc_type?: string | null
          file_path?: string
          id?: string
          org_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          id: string
          meta: Json | null
          org_id: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          meta?: Json | null
          org_id: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          meta?: Json | null
          org_id?: string
          type?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          org_id: string
          source: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          org_id: string
          source?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          org_id?: string
          source?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          org_id: string
          role: Database["public"]["Enums"]["org_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          org_id: string
          role?: Database["public"]["Enums"]["org_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          org_id?: string
          role?: Database["public"]["Enums"]["org_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_subscriptions: {
        Row: {
          created_at: string
          id: string
          org_id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          org_id: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          org_id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_subscriptions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          created_at: string
          id: string
          org_id: string
          slug: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          org_id: string
          slug?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          org_id?: string
          slug?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      sites: {
        Row: {
          created_at: string
          id: string
          org_id: string
          screenshot_url: string | null
          site_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          org_id: string
          screenshot_url?: string | null
          site_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          org_id?: string
          screenshot_url?: string | null
          site_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          attachments: Json | null
          author: string
          created_at: string
          id: string
          message: string
          org_id: string
          user_id: string | null
        }
        Insert: {
          attachments?: Json | null
          author?: string
          created_at?: string
          id?: string
          message: string
          org_id: string
          user_id?: string | null
        }
        Update: {
          attachments?: Json | null
          author?: string
          created_at?: string
          id?: string
          message?: string
          org_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhooks: {
        Row: {
          created_at: string
          description: string | null
          execution_method: string | null
          form_fields: Json | null
          id: string
          is_active: boolean
          name: string
          org_id: string
          response_format: string | null
          schedule_config: Json | null
          updated_at: string
          webhook_type: string | null
          webhook_url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          execution_method?: string | null
          form_fields?: Json | null
          id?: string
          is_active?: boolean
          name: string
          org_id: string
          response_format?: string | null
          schedule_config?: Json | null
          updated_at?: string
          webhook_type?: string | null
          webhook_url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          execution_method?: string | null
          form_fields?: Json | null
          id?: string
          is_active?: boolean
          name?: string
          org_id?: string
          response_format?: string | null
          schedule_config?: Json | null
          updated_at?: string
          webhook_type?: string | null
          webhook_url?: string
        }
        Relationships: []
      }
      workflow_executions: {
        Row: {
          executed_at: string
          id: string
          org_id: string
          response_data: Json | null
          status: string
          user_id: string | null
          workflow_id: string
        }
        Insert: {
          executed_at?: string
          id?: string
          org_id: string
          response_data?: Json | null
          status?: string
          user_id?: string | null
          workflow_id: string
        }
        Update: {
          executed_at?: string
          id?: string
          org_id?: string
          response_data?: Json | null
          status?: string
          user_id?: string | null
          workflow_id?: string
        }
        Relationships: []
      }
      workflow_runs: {
        Row: {
          finished_at: string | null
          id: string
          logs: Json | null
          started_at: string
          status: string
          workflow_id: string
        }
        Insert: {
          finished_at?: string | null
          id?: string
          logs?: Json | null
          started_at?: string
          status: string
          workflow_id: string
        }
        Update: {
          finished_at?: string | null
          id?: string
          logs?: Json | null
          started_at?: string
          status?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_runs_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          last_executed_at: string | null
          n8n_workflow_id: string | null
          name: string
          org_id: string
          updated_at: string
          usage_limit_per_day: number | null
          usage_limit_per_hour: number | null
          webhook_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          last_executed_at?: string | null
          n8n_workflow_id?: string | null
          name: string
          org_id: string
          updated_at?: string
          usage_limit_per_day?: number | null
          usage_limit_per_hour?: number | null
          webhook_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          last_executed_at?: string | null
          n8n_workflow_id?: string | null
          name?: string
          org_id?: string
          updated_at?: string
          usage_limit_per_day?: number | null
          usage_limit_per_hour?: number | null
          webhook_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflows_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_impersonate_user: {
        Args: { _target_user_id: string }
        Returns: {
          user_id: string
          email: string
          organization_id: string
          organization_name: string
        }[]
      }
      admin_list_organizations: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          id: string
          name: string
          owner_id: string
          updated_at: string
        }[]
      }
      check_workflow_usage_limit: {
        Args: { _workflow_id: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      user_is_org_member: {
        Args: { _user_id: string; _org_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      org_role: "owner" | "admin" | "member" | "viewer"
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
      app_role: ["admin", "moderator", "user"],
      org_role: ["owner", "admin", "member", "viewer"],
    },
  },
} as const
