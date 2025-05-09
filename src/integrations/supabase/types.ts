export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_chat_history: {
        Row: {
          created_at: string
          id: string
          message: string
          response: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          response: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          response?: string
          user_id?: string
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          author_id: string
          comments: number | null
          content: string
          date: string
          id: string
          image_url: string | null
          likes: number | null
          share_count: number | null
          tags: string[] | null
          title: string
        }
        Insert: {
          author_id: string
          comments?: number | null
          content: string
          date?: string
          id?: string
          image_url?: string | null
          likes?: number | null
          share_count?: number | null
          tags?: string[] | null
          title: string
        }
        Update: {
          author_id?: string
          comments?: number | null
          content?: string
          date?: string
          id?: string
          image_url?: string | null
          likes?: number | null
          share_count?: number | null
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      guide_steps: {
        Row: {
          content: string
          guide_id: string
          id: string
          step_order: number
          title: string
        }
        Insert: {
          content: string
          guide_id: string
          id?: string
          step_order: number
          title: string
        }
        Update: {
          content?: string
          guide_id?: string
          id?: string
          step_order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "guide_steps_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
        ]
      }
      guides: {
        Row: {
          author_id: string | null
          category: string
          country: string
          created_at: string
          description: string
          id: string
          image: string | null
          steps: number | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category: string
          country: string
          created_at?: string
          description: string
          id?: string
          image?: string | null
          steps?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: string
          country?: string
          created_at?: string
          description?: string
          id?: string
          image?: string | null
          steps?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          likes: number | null
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes?: number | null
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes?: number | null
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          education: string | null
          email: string
          full_name: string | null
          id: string
          interests: string[] | null
          is_admin: boolean | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          education?: string | null
          email: string
          full_name?: string | null
          id: string
          interests?: string[] | null
          is_admin?: boolean | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          education?: string | null
          email?: string
          full_name?: string | null
          id?: string
          interests?: string[] | null
          is_admin?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      saved_scholarships: {
        Row: {
          created_at: string
          id: string
          scholarship_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          scholarship_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          scholarship_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_scholarships_scholarship_id_fkey"
            columns: ["scholarship_id"]
            isOneToOne: false
            referencedRelation: "scholarships"
            referencedColumns: ["id"]
          },
        ]
      }
      scholarships: {
        Row: {
          application_url: string
          benefits: string[]
          country: string
          created_at: string
          deadline: string
          description: string
          featured: boolean | null
          fields: string[]
          id: string
          image_url: string | null
          institution: string
          level: string
          requirements: string[]
          source_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          application_url: string
          benefits?: string[]
          country: string
          created_at?: string
          deadline: string
          description: string
          featured?: boolean | null
          fields?: string[]
          id: string
          image_url?: string | null
          institution: string
          level: string
          requirements?: string[]
          source_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          application_url?: string
          benefits?: string[]
          country?: string
          created_at?: string
          deadline?: string
          description?: string
          featured?: boolean | null
          fields?: string[]
          id?: string
          image_url?: string | null
          institution?: string
          level?: string
          requirements?: string[]
          source_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      static_pages: {
        Row: {
          content: string
          created_at: string
          id: string
          page_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          page_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          page_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          is_from_ai: boolean | null
          scholarship_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_from_ai?: boolean | null
          scholarship_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_from_ai?: boolean | null
          scholarship_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
