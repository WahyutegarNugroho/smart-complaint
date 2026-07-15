import prisma from '@/lib/prisma'
import { EscalationLevel, Status } from '@prisma/client'

const SLA_RULES: {
  level: EscalationLevel
  status: Status
  hours: number
  reason: string
  prevLevel: EscalationLevel
}[] = [
  { level: 'LEVEL_1', status: 'PENDING', hours: 24, reason: 'Laporan PENDING lebih dari 24 jam tanpa tanggapan', prevLevel: 'NONE' },
  { level: 'LEVEL_2', status: 'PENDING', hours: 48, reason: 'Laporan PENDING lebih dari 48 jam — eskalasi level 2', prevLevel: 'LEVEL_1' },
  { level: 'LEVEL_3', status: 'PROCESSING', hours: 72, reason: 'Laporan PROCESSING lebih dari 72 jam tanpa penyelesaian', prevLevel: 'LEVEL_2' },
]

export async function processEscalations() {
  const now = new Date()
  let escalatedCount = 0

  const adminIds = await prisma.profile.findMany({
    where: { role: 'ADMIN' },
    select: { id: true },
    take: 100,
  })

  for (const rule of SLA_RULES) {
    const cutoff = new Date(now.getTime() - rule.hours * 60 * 60 * 1000)

    const complaints = await prisma.complaint.findMany({
      where: {
        status: rule.status,
        escalationLevel: rule.prevLevel,
        createdAt: { lte: cutoff },
      },
      take: 500,
    })

    for (const complaint of complaints) {
      try {
        await prisma.$transaction([
          prisma.complaint.update({
            where: { id: complaint.id },
            data: {
              escalationLevel: rule.level,
              escalatedAt: now,
            },
          }),
          prisma.escalationLog.create({
            data: {
              complaintId: complaint.id,
              fromLevel: rule.prevLevel,
              toLevel: rule.level,
              reason: rule.reason,
            },
          }),
          prisma.notification.create({
            data: {
              userId: complaint.authorId,
              message: `Laporan Anda "${complaint.title}" telah masuk eskalasi ${rule.level === 'LEVEL_1' ? 'peringatan' : rule.level === 'LEVEL_2' ? 'level 2' : 'level 3'}. ${rule.reason}`,
              type: 'WARNING',
            },
          }),
        ])

        if (rule.level === 'LEVEL_2' && adminIds.length > 0) {
          await prisma.notification.createMany({
            data: adminIds.map(admin => ({
              userId: admin.id,
              message: `Laporan "${complaint.title}" (RT ${complaint.rt}/${complaint.rw}) sudah 48 jam, perlu perhatian segera.`,
              type: 'WARNING' as const,
            })),
          })
        }

        escalatedCount++
      } catch (err) {
        console.error(`Escalation Error for complaint ${complaint.id}:`, err)
      }
    }
  }

  return escalatedCount
}

export async function resetEscalation(complaintId: string) {
  try {
    await prisma.complaint.update({
      where: { id: complaintId },
      data: {
        escalationLevel: EscalationLevel.NONE,
        escalatedAt: null,
      },
    })
  } catch (err) {
    console.error('ResetEscalation Error:', err)
  }
}

export async function getEscalationInfo(complaintId: string) {
  const logs = await prisma.escalationLog.findMany({
    where: { complaintId },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })
  return logs
}
