import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { isStaff } from '@/lib/authorization'
import { apiErrorResponse, logServerError, mapPrismaError } from '@/lib/errors'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) {
      return apiErrorResponse('VALIDATION_ERROR', 'ID laporan tidak valid.', 400)
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return apiErrorResponse('UNAUTHORIZED', 'Sesi Anda telah berakhir.', 401)
    }

    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            rt: true,
            rw: true,
            isVerified: true,
          },
        },
      },
    })

    if (!complaint) {
      return apiErrorResponse('NOT_FOUND', 'Laporan tidak ditemukan.', 404)
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { id: true, role: true }
    })
    if (!profile) {
      return apiErrorResponse('FORBIDDEN', 'Profil pengguna tidak ditemukan.', 403)
    }

    const isAuthor = complaint.authorId === profile.id

    if (!isStaff(profile) && !isAuthor) {
      return apiErrorResponse('FORBIDDEN', 'Akses ditolak.', 403)
    }

    return NextResponse.json(complaint)
  } catch (err) {
    logServerError('api.complaint.detail', err)
    const mapped = mapPrismaError(err)
    return apiErrorResponse(mapped.code, mapped.userMessage, mapped.status)
  }
}
