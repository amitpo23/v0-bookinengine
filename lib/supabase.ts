import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Only create client if we have valid credentials
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Server-side client with service role key (for admin operations)
export const supabaseAdmin = supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : null

// Types for database tables
export interface User {
  id: string
  email: string
  name?: string
  image?: string
  phone?: string
  address?: string
  city?: string
  country?: string
  google_id?: string
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id?: string
  booking_reference: string
  hotel_name: string
  check_in: string
  check_out: string
  guests: any
  total_price: number
  status: string
  booking_data: any
  created_at: string
}
