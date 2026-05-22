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

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })

    if (!profile) {
      throw new Error('Profile tidak ditemukan. Silakan hubungi admin atau daftar ulang.')
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
