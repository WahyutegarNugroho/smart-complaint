import { cache } from 'react'
import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'

export const getCachedProfile = cache(async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

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

  // Auto-create if missing
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

  return { profile, user }
})
