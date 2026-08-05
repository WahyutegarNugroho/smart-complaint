import prisma from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth'
import { isStaff } from '@/lib/authorization'

export async function requireStaff() {
  const { user } = await getAuthenticatedUser()
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: { id: true, role: true }
  })
  if (!profile || !isStaff(profile)) throw new Error('Izin ditolak')
  return { user, profile }
}
