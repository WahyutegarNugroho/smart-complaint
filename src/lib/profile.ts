import { cache } from 'react'
import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'

export const getCachedProfile = cache(async () => {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) return null

    let profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })

    // Fallback check by email (username)
    if (!profile && user.email) {
      profile = await prisma.profile.findFirst({
        where: { username: user.email }
      })

      if (profile) {
        profile = await prisma.profile.update({
          where: { id: profile.id },
          data: { userId: user.id }
        })
      }
    }

    // Auto-create if missing or incomplete
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

    // FINAL VALIDATION: Ensure critical fields exist
    if (!profile.id || !profile.role) {
      throw new Error('Incomplete profile data')
    }

    return { profile, user }
  } catch (err) {
    console.error('getCachedProfile Critical Error:', err)
    return null
  }
})
