
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'your-supabase-url'
const supabaseAnonKey = 'your-supabase-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          product_name: string
          purchase_price: number
          retail_price: number
          stock: number
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          product_name: string
          purchase_price: number
          retail_price: number
          stock: number
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          product_name?: string
          purchase_price?: number
          retail_price?: number
          stock?: number
          created_at?: string
          user_id?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          phone: string
          address: string
          credit: number
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          address: string
          credit?: number
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          address?: string
          credit?: number
          created_at?: string
          user_id?: string
        }
      }
      bills: {
        Row: {
          id: string
          customer_id: string | null
          customer_name: string | null
          date: string
          total: number
          payment_method: 'Cash' | 'Credit' | 'Digital'
          status: 'paid' | 'unpaid' | 'partial'
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          customer_id?: string | null
          customer_name?: string | null
          date: string
          total: number
          payment_method: 'Cash' | 'Credit' | 'Digital'
          status?: 'paid' | 'unpaid' | 'partial'
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          customer_id?: string | null
          customer_name?: string | null
          date?: string
          total?: number
          payment_method?: 'Cash' | 'Credit' | 'Digital'
          status?: 'paid' | 'unpaid' | 'partial'
          created_at?: string
          user_id?: string
        }
      }
      bill_items: {
        Row: {
          id: string
          bill_id: string
          product_id: string
          product_name: string
          qty: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          bill_id: string
          product_id: string
          product_name: string
          qty: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          bill_id?: string
          product_id?: string
          product_name?: string
          qty?: number
          price?: number
          created_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          title: string
          amount: number
          date: string
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          amount: number
          date: string
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          amount?: number
          date?: string
          created_at?: string
          user_id?: string
        }
      }
    }
  }
}
