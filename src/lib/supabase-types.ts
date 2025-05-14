
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Define our Supabase database tables and relationships
export interface Database {
  public: {
    Tables: {
      scholarships: {
        Row: {
          id: string
          title: string
          country: string
          institution: string
          deadline: string
          fields: string[] 
          level: "Undergraduate" | "Masters" | "PhD" | "Research" | "Training"
          description: string
          benefits: string[]
          requirements: string[]
          application_url: string
          featured: boolean
          created_at: string
          updated_at: string
          image_url?: string
          source_url?: string
        }
        Insert: {
          id?: string
          title: string
          country: string
          institution: string
          deadline: string
          fields: string[]
          level: "Undergraduate" | "Masters" | "PhD" | "Research" | "Training"
          description: string
          benefits: string[]
          requirements: string[]
          application_url: string
          featured?: boolean
          created_at?: string
          updated_at?: string
          image_url?: string
          source_url?: string
        }
        Update: {
          id?: string
          title?: string
          country?: string
          institution?: string
          deadline?: string
          fields?: string[]
          level?: "Undergraduate" | "Masters" | "PhD" | "Research" | "Training"
          description?: string
          benefits?: string[]
          requirements?: string[]
          application_url?: string
          featured?: boolean
          created_at?: string
          updated_at?: string
          image_url?: string
          source_url?: string
        }
      }
      guides: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          country: string
          image: string
          steps: number
          author_id?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          country: string
          image?: string
          steps?: number
          author_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          country?: string
          image?: string
          steps?: number
          author_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      guide_steps: {
        Row: {
          id: string
          guide_id: string
          title: string
          content: string
          step_order: number
        }
        Insert: {
          id?: string
          guide_id: string
          title: string
          content: string
          step_order: number
        }
        Update: {
          id?: string
          guide_id?: string
          title?: string
          content?: string
          step_order?: number
        }
      }
      community_posts: {
        Row: {
          id: string
          title: string
          content: string
          author_id: string
          date: string
          likes: number
          comments: number
          tags: string[]
          image_url?: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          author_id: string
          date?: string
          likes?: number
          comments?: number
          tags?: string[]
          image_url?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          author_id?: string
          date?: string
          likes?: number
          comments?: number
          tags?: string[]
          image_url?: string
        }
      }
      post_comments: {
        Row: {
          id: string
          post_id: string
          author_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          author_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          author_id?: string
          content?: string
          created_at?: string
        }
      }
      post_likes: {
        Row: {
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          post_id?: string
          user_id?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name?: string
          avatar_url?: string
          bio?: string
          education?: string
          interests?: string[]
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string
          avatar_url?: string
          bio?: string
          education?: string
          interests?: string[]
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string
          bio?: string
          education?: string
          interests?: string[]
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      static_pages: {
        Row: {
          id: string
          page_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          page_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          page_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      ai_chat_history: {
        Row: {
          id: string
          user_id: string
          message: string
          response: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          response: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          message?: string
          response?: string
          created_at?: string
        }
      }
      saved_scholarships: {
        Row: {
          id: string
          user_id: string
          scholarship_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          scholarship_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          scholarship_id?: string
          created_at?: string
        }
      }
      translations: {
        Row: {
          key: string
          en: string
          my: string
          created_at: string
          updated_at: string
        }
        Insert: {
          key: string
          en: string
          my: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          key?: string
          en?: string
          my?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_scholarship_saved: (p_user_id: string, p_scholarship_id: string) => boolean
      save_scholarship: (p_user_id: string, p_scholarship_id: string) => void
      remove_saved_scholarship: (p_user_id: string, p_scholarship_id: string) => void
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
