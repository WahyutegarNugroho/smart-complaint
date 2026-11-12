import 'server-only'
import { getCachedProfile } from '@/lib/profile'
import { isAdmin, isStaff } from '@/lib/authorization'
import { Profile } from '@prisma/client'

export async function getAuthorizedAdminProfile(): Promise<Profile | null> {
  const authData = await getCachedProfile()
  if (authData.status !== 'AUTHENTICATED' || !authData.profile) return null
  if (!isAdmin(authData.profile)) return null
  return authData.profile
}

export async function getAuthorizedStaffProfile(): Promise<Profile | null> {
  const authData = await getCachedProfile()
  if (authData.status !== 'AUTHENTICATED' || !authData.profile) return null
  if (!isStaff(authData.profile)) return null
  return authData.profile
}

export async function getAuthorizedProfile(): Promise<Profile | null> {
  const authData = await getCachedProfile()
  if (authData.status !== 'AUTHENTICATED' || !authData.profile) return null
  return authData.profile
}

