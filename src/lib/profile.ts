import { cache } from 'react'
import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { Profile } from '@prisma/client'
import { User } from '@supabase/supabase-js'

export type ProfileResponse = 
  | { profile: null; user: null; status: 'UNAUTHENTICATED' }
  | { profile: Profile; user: User; status: 'AUTHENTICATED' }
  | { profile: null; user: null; status: 'ERROR'; error: string; stack?: string }

export const getCachedProfile = cache(async (): Promise<ProfileResponse> => {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { profile: null, user: null, status: 'UNAUTHENTICATED' }
    }

    let profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          userId: user.id,
          username: user.email || `user_${user.id.slice(0, 8)}`,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          role: 'MASYARAKAT'
        }
      })
    }

    return { profile, user, status: 'AUTHENTICATED' }
  } catch (err: unknown) {
    console.error('getCachedProfile Critical Failure:', err)
    const error = err as Error
    return { 
      profile: null, 
      user: null, 
      status: 'ERROR',
      error: error?.message || String(err),
      stack: error?.stack
    }
  }
})
