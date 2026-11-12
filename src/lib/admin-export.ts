import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { rateLimit } from '@/lib/rate-limit'
import { apiErrorResponse, logServerError, mapPrismaError } from '@/lib/errors'

export async function guardAdminExport(request: NextRequest, keyPrefix: string) {
  const rl = await rateLimit(request, { keyPrefix, max: 10 })
  if (rl) return rl

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return apiErrorResponse('UNAUTHORIZED', 'Sesi Anda telah berakhir. Silakan masuk ulang.', 401)
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { role: true, name: true }
    })

    if (!profile || profile.role !== 'ADMIN') {
      return apiErrorResponse('FORBIDDEN', 'Anda tidak memiliki hak akses untuk mengekspor data.', 403)
    }

    return { user, profile }
  } catch (err) {
    logServerError('admin-export.guardAdminExport', err)
    const mapped = mapPrismaError(err)
    return apiErrorResponse(mapped.code, mapped.userMessage, mapped.status)
  }
}
