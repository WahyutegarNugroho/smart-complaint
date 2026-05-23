import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function getAuthenticatedUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return { supabase, user }
}

export async function getAuthenticatedUserOptional() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  return { supabase, user }
}

export async function getAuthenticatedProfile() {
  const { supabase, user } = await getAuthenticatedUser()
  const profile = await prisma.profile.findUnique({ where: { userId: user.id } })
  if (!profile) throw new Error('profile_not_found')
  return { supabase, user, profile }
}

export async function getAuthenticatedProfileOptional() {
  const result = await getAuthenticatedUserOptional()
  if (!result) return null
  const { supabase, user } = result
  const profile = await prisma.profile.findUnique({ where: { userId: user.id } })
  if (!profile) return null
  return { supabase, user, profile }
}
