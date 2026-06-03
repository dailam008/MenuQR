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
      outlets: {
        Row: {
          id: string
          owner_id: string
          name: string
          slug: string
          address: string | null
          description: string | null
          logo_url: string | null
          custom_domain: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          slug: string
          address?: string | null
          description?: string | null
          logo_url?: string | null
          custom_domain?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          slug?: string
          address?: string | null
          description?: string | null
          logo_url?: string | null
          custom_domain?: string | null
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          outlet_id: string
          name: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          outlet_id: string
          name: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          outlet_id?: string
          name?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: 'categories_outlet_id_fkey'
            columns: ['outlet_id']
            isOneToOne: false
            referencedRelation: 'outlets'
            referencedColumns: ['id']
          }
        ]
      }
      menu_items: {
        Row: {
          id: string
          outlet_id: string
          category_id: string | null
          name: string
          description: string | null
          price: number
          image_url: string | null
          is_available: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          outlet_id: string
          category_id?: string | null
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          is_available?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          outlet_id?: string
          category_id?: string | null
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          is_available?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'menu_items_outlet_id_fkey'
            columns: ['outlet_id']
            isOneToOne: false
            referencedRelation: 'outlets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'menu_items_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          }
        ]
      }
      users: {
        Row: {
          id: string
          email: string | null
          plan: 'free' | 'pro'
          pro_started_at: string | null
          pro_expired_at: string | null
          payment_ref: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          plan?: 'free' | 'pro'
          pro_started_at?: string | null
          pro_expired_at?: string | null
          payment_ref?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          plan?: 'free' | 'pro'
          pro_started_at?: string | null
          pro_expired_at?: string | null
          payment_ref?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      upgrade_logs: {
        Row: {
          id: string
          user_id: string
          notified_at: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          notified_at?: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          notified_at?: string
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'upgrade_logs_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      cron_logs: {
        Row: {
          id: string
          run_at: string
          cron_name: string
          users_affected: number
          status: string
          log_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          run_at?: string
          cron_name: string
          users_affected?: number
          status: string
          log_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          run_at?: string
          cron_name?: string
          users_affected?: number
          status?: string
          log_message?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Outlet = Tables<'outlets'>
export type Category = Tables<'categories'>
export type MenuItem = Tables<'menu_items'>

export type OutletInsert = Database['public']['Tables']['outlets']['Insert']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type MenuItemInsert = Database['public']['Tables']['menu_items']['Insert']

export type OutletUpdate = Database['public']['Tables']['outlets']['Update']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']
export type MenuItemUpdate = Database['public']['Tables']['menu_items']['Update']
