import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { apiErrorResponse, logServerError, mapPrismaError } from '@/lib/errors'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return apiErrorResponse('UNAUTHORIZED', 'Sesi Anda telah berakhir.', 401)
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { id: true }
    })
    if (!profile) {
      return apiErrorResponse('FORBIDDEN', 'Profil pengguna tidak ditemukan.', 403)
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: profile.id },
      orderBy: [
        { isRead: 'asc' },
        { createdAt: 'desc' }
      ],
      take: 10
    })

    return NextResponse.json(notifications)
  } catch (err) {
    logServerError('api.notifications', err)
    const mapped = mapPrismaError(err)
    return apiErrorResponse(mapped.code, mapped.userMessage, mapped.status)
  }
}
