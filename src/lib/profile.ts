import { cache } from 'react'
import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'

export const getCachedProfile = cache(async () => {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { profile: null, user: null, status: 'UNAUTHENTICATED' }
    }

    // 🔍 1. Primary Lookup (By Supabase ID)
    let profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })

    // 🔍 2. Secondary Lookup (By Email/Username) if primary fails
    if (!profile && user.email) {
      const existingByEmail = await prisma.profile.findUnique({
        where: { username: user.email }
      })

      if (existingByEmail) {
        // Fix desync: Link existing profile to this Supabase ID
        profile = await prisma.profile.update({
          where: { id: existingByEmail.id },
          data: { userId: user.id }
        })
      }
    }

    // 🛠️ 3. Auto-Create if still missing
    if (!profile) {
      try {
        profile = await prisma.profile.create({
          data: {
            userId: user.id,
            username: user.email || `user_${user.id.slice(0, 8)}`,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            role: 'MASYARAKAT'
          }
        })
      } catch (createErr: unknown) {
        // Handle race condition: if profile was created by another request simultaneously
        if (createErr && typeof createErr === 'object' && 'code' in createErr && createErr.code === 'P2002') {
          profile = await prisma.profile.findUnique({
            where: { userId: user.id }
          })
          
          // Last ditch effort: find by username again
          if (!profile && user.email) {
            profile = await prisma.profile.findUnique({
              where: { username: user.email }
            })
          }
        } else {
          throw createErr
        }
      }
    }

    if (!profile || !profile.id || !profile.role) {
      throw new Error('Incomplete profile data after recovery attempts')
    }

    return { profile, user, status: 'AUTHENTICATED' }
  } catch (err: unknown) {
    console.error('getCachedProfile Critical Failure:', err)
    return { profile: null, user: null, status: 'ERROR' }
  }
})
