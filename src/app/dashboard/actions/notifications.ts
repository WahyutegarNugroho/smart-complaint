'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'

export async function markNotificationAsRead(notificationId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

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
