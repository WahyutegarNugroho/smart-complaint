import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'

export async function createAuditLog(action: string, details: string, adminId?: string) {
  try {
    const id = adminId || await resolveAdminId()
    if (!id) return

    await prisma.auditLog.create({
      data: { action, details, adminId: id }
    })
  } catch (err) {
    console.error('AuditLog Error:', err)
  }
}

async function resolveAdminId(): Promise<string | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { id: true }
    })
    return profile?.id || null
  } catch {
    return null
  }
}
