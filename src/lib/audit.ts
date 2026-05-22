import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'

export async function createAuditLog(action: string, details: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const profile = await prisma.profile.findUnique({ where: { userId: user.id } })
    if (!profile) return

    await prisma.auditLog.create({
      data: { action, details, adminId: profile.id }
    })
  } catch (err) {
    console.error('AuditLog Error:', err)
  }
}
