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
      collections: {
        Row: {
          color: string
          created_at: string
          description: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      external_sources: {
        Row: {
          created_at: string
          id: string
          product_id: string
          product_uuid: string | null
          source_type: string
          title: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          product_uuid?: string | null
          source_type: string
          title: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          product_uuid?: string | null
          source_type?: string
          title?: string
          url?: string
        }
        Relationships: []
      }
      product_links: {
        Row: {
          created_at: string
          id: string
          price: number | null
          product_id: string
          product_name: string
          product_uuid: string | null
          rating: number | null
          review_count: number | null
          source_name: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          price?: number | null
          product_id: string
          product_name: string
          product_uuid?: string | null
          rating?: number | null
          review_count?: number | null
          source_name: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          price?: number | null
          product_id?: string
          product_name?: string
          product_uuid?: string | null
          rating?: number | null
          review_count?: number | null
          source_name?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      product_notes: {
        Row: {
          content: string | null
          created_at: string
          id: string
          product_id: string
          product_uuid: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          product_id: string
          product_uuid?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          product_id?: string
          product_uuid?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          collection_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          price: string | null
          product_url: string | null
          source_name: string | null
          title: string
          user_id: string
        }
        Insert: {
          collection_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          price?: string | null
          product_url?: string | null
          source_name?: string | null
          title: string
          user_id: string
        }
        Update: {
          collection_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          price?: string | null
          product_url?: string | null
          source_name?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_product_to_collection: {
        Args: { p_product_id: string; p_collection_id: string }
        Returns: string
      }
      create_collection: {
        Args: { p_name: string; p_description: string; p_color: string }
        Returns: string
      }
      create_product: {
        Args: {
          p_title: string
          p_description: string
          p_price: string
          p_image_url: string
          p_product_url: string
          p_source_name: string
          p_collection_id: string
        }
        Returns: string
      }
      delete_collection: {
        Args: { p_collection_id: string }
        Returns: boolean
      }
      delete_external_source: {
        Args: { p_source_id: string }
        Returns: boolean
      }
      delete_product: {
        Args: { p_product_id: string }
        Returns: boolean
      }
      delete_product_link: {
        Args: { p_link_id: string }
        Returns: boolean
      }
      get_external_sources: {
        Args: { p_product_id: string }
        Returns: {
          created_at: string
          id: string
          product_id: string
          product_uuid: string | null
          source_type: string
          title: string
          url: string
        }[]
      }
      get_external_sources_old: {
        Args: { p_product_id: string }
        Returns: {
          created_at: string
          id: string
          product_id: string
          product_uuid: string | null
          source_type: string
          title: string
          url: string
        }[]
      }
      get_product: {
        Args: { p_product_id: string }
        Returns: {
          collection_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          price: string | null
          product_url: string | null
          source_name: string | null
          title: string
          user_id: string
        }[]
      }
      get_product_links: {
        Args: { p_product_id: string }
        Returns: {
          created_at: string
          id: string
          price: number | null
          product_id: string
          product_name: string
          product_uuid: string | null
          rating: number | null
          review_count: number | null
          source_name: string
          updated_at: string
          url: string
        }[]
      }
      get_product_links_old: {
        Args: { p_product_id: string }
        Returns: {
          created_at: string
          id: string
          price: number | null
          product_id: string
          product_name: string
          product_uuid: string | null
          rating: number | null
          review_count: number | null
          source_name: string
          updated_at: string
          url: string
        }[]
      }
      get_product_notes: {
        Args: { p_product_id: string }
        Returns: {
          content: string | null
          created_at: string
          id: string
          product_id: string
          product_uuid: string | null
          updated_at: string
          user_id: string
        }[]
      }
      get_product_notes_old: {
        Args: { p_product_id: string }
        Returns: {
          content: string | null
          created_at: string
          id: string
          product_id: string
          product_uuid: string | null
          updated_at: string
          user_id: string
        }[]
      }
      get_products_by_collection: {
        Args: { p_collection_id: string }
        Returns: {
          collection_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          price: string | null
          product_url: string | null
          source_name: string | null
          title: string
          user_id: string
        }[]
      }
      get_user_collections: {
        Args: Record<PropertyKey, never>
        Returns: {
          color: string
          created_at: string
          description: string | null
          id: string
          name: string
          user_id: string
        }[]
      }
      get_user_products: {
        Args: Record<PropertyKey, never>
        Returns: {
          collection_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          price: string | null
          product_url: string | null
          source_name: string | null
          title: string
          user_id: string
        }[]
      }
      remove_product_from_collection: {
        Args: { p_product_id: string; p_collection_id: string }
        Returns: boolean
      }
      save_external_source: {
        Args: {
          p_product_id: string
          p_title: string
          p_url: string
          p_source_type: string
        }
        Returns: string
      }
      save_external_source_old: {
        Args: {
          p_product_id: string
          p_title: string
          p_url: string
          p_source_type: string
        }
        Returns: string
      }
      save_product_link: {
        Args: {
          p_product_id: string
          p_source_name: string
          p_product_name: string
          p_url: string
          p_price?: number
          p_rating?: number
          p_review_count?: number
        }
        Returns: string
      }
      save_product_link_old: {
        Args: {
          p_product_id: string
          p_source_name: string
          p_product_name: string
          p_url: string
          p_price?: number
          p_rating?: number
          p_review_count?: number
        }
        Returns: string
      }
      save_product_notes: {
        Args: { p_product_id: string; p_content: string }
        Returns: undefined
      }
      save_product_notes_old: {
        Args: { p_product_id: string; p_user_id: string; p_content: string }
        Returns: undefined
      }
      update_product: {
        Args: {
          p_product_id: string
          p_title: string
          p_description: string
          p_price: string
          p_image_url: string
          p_product_url: string
          p_source_name: string
          p_collection_id: string
        }
        Returns: boolean
      }
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
