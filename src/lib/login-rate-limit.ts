import prisma from '@/lib/prisma'

const MAX_ATTEMPTS = 5
const LOCK_DURATION_MS = 60_000

export async function checkLoginAttempt(ip: string) {
  try {
    const record = await prisma.loginAttempt.findUnique({ where: { ip } })
    if (!record) return { locked: false, remainingSeconds: 0 }

    const now = Date.now()
    if (record.count >= MAX_ATTEMPTS && now < record.resetAt.getTime()) {
      const remainingSeconds = Math.ceil((record.resetAt.getTime() - now) / 1000)
      return { locked: true, remainingSeconds }
    }

    return { locked: false, remainingSeconds: 0 }
  } catch (err) {
    console.error('checkLoginAttempt Error:', err)
    return { locked: false, remainingSeconds: 0 }
  }
}

export async function recordFailedAttempt(ip: string) {
  try {
    const now = new Date()
    const resetAt = new Date(now.getTime() + LOCK_DURATION_MS)
    const existing = await prisma.loginAttempt.findUnique({ where: { ip } })

    if (!existing || now > existing.resetAt) {
      await prisma.loginAttempt.upsert({
        where: { ip },
        update: { count: 1, resetAt },
        create: { ip, count: 1, resetAt },
      })
    } else {
      await prisma.loginAttempt.update({
        where: { ip },
        data: { count: { increment: 1 } },
      })
    }
  } catch (err) {
    console.error('recordFailedAttempt Error:', err)
  }
}

export async function resetLoginAttempts(ip: string) {
  try {
    await prisma.loginAttempt.delete({ where: { ip } })
  } catch {
    // ignore if not found
  }
}
