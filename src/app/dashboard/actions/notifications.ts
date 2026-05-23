'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { getAuthenticatedUserOptional } from '@/lib/auth'

export async function markNotificationAsRead(notificationId: string) {
  try {
    const auth = await getAuthenticatedUserOptional()
    if (!auth) return
    const { user } = auth
    const profile = await prisma.profile.findUnique({ where: { userId: user.id } })
    if (!profile) return

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId }
    })
    if (!notification || notification.userId !== profile.id) return

    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    })
    revalidatePath('/dashboard')
  } catch (err) {
    console.error('MarkNotificationAsRead Error:', err)
  }
}
