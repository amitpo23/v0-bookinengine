import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { supabaseAdmin } from './supabase'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false

      try {
        // Check if user exists in Supabase
        const { data: existingUser } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single()

        if (!existingUser) {
          // Create new user in Supabase
          await supabaseAdmin.from('users').insert({
            email: user.email,
            name: user.name,
            image: user.image,
            google_id: account?.providerAccountId,
          })
        } else {
          // Update existing user
          await supabaseAdmin
            .from('users')
            .update({
              name: user.name,
              image: user.image,
              google_id: account?.providerAccountId,
            })
            .eq('email', user.email)
        }

        return true
      } catch (error) {
        console.error('Error in signIn callback:', error)
        return false
      }
    },

    async session({ session, token }) {
      if (session.user) {
        // Fetch additional user data from Supabase
        const { data: userData } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .single()

        if (userData) {
          session.user.id = userData.id
          session.user.address = userData.address
          session.user.city = userData.city
          session.user.phone = userData.phone
        }
      }

      return session
    },
  },

  pages: {
    signIn: '/', // Redirect to home page for sign in
    error: '/', // Error page
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
}

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      phone?: string | null
      address?: string | null
      city?: string | null
    }
  }
}
