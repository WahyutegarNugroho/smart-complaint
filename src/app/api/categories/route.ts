import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthenticatedUserOptional } from '@/lib/auth'
import { apiErrorResponse, logServerError, mapPrismaError } from '@/lib/errors'

export async function GET() {
  try {
    const auth = await getAuthenticatedUserOptional()
    if (!auth) {
      return apiErrorResponse('UNAUTHORIZED', 'Sesi Anda telah berakhir. Silakan masuk ulang.', 401)
    }

    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(categories)
  } catch (err) {
    logServerError('api.categories', err)
    const mapped = mapPrismaError(err)
    return apiErrorResponse(mapped.code, mapped.userMessage, mapped.status)
  }
}
