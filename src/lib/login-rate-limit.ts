import prisma from '@/lib/prisma'

const MAX_ATTEMPTS = 5
const LOCK_DURATION_MS = 60_000

export async function checkLoginAttempt(ip: string) {
  try {
    const record = await prisma.loginAttempt.findUnique({ where: { ip } })
    if (!record) return { locked: false, remainingSeconds: 0, remainingAttempts: MAX_ATTEMPTS }

    const now = Date.now()
    if (now < record.resetAt.getTime()) {
      const remainingSeconds = Math.ceil((record.resetAt.getTime() - now) / 1000)
      const remainingAttempts = Math.max(0, MAX_ATTEMPTS - record.count)

      if (record.count >= MAX_ATTEMPTS) {
        return { locked: true, remainingSeconds, remainingAttempts: 0 }
      }

      return { locked: false, remainingSeconds: 0, remainingAttempts }
    }

    return { locked: false, remainingSeconds: 0, remainingAttempts: MAX_ATTEMPTS }
  } catch (err) {
    console.error('checkLoginAttempt Error:', err)
    return { locked: false, remainingSeconds: 0, remainingAttempts: MAX_ATTEMPTS }
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
      return { locked: false, remainingSeconds: 0, remainingAttempts: MAX_ATTEMPTS - 1 }
    }

    const currentCount = existing.count + 1
    await prisma.loginAttempt.update({
      where: { ip },
      data: { count: currentCount, resetAt },
    })

    const remainingAttempts = Math.max(0, MAX_ATTEMPTS - currentCount)

    if (currentCount >= MAX_ATTEMPTS) {
      return { locked: true, remainingSeconds: Math.ceil(LOCK_DURATION_MS / 1000), remainingAttempts: 0 }
    }

    return { locked: false, remainingSeconds: 0, remainingAttempts }
  } catch (err) {
    console.error('recordFailedAttempt Error:', err)
    return { locked: false, remainingSeconds: 0, remainingAttempts: 0 }
  }
}

export async function resetLoginAttempts(ip: string) {
  try {
    await prisma.loginAttempt.delete({ where: { ip } })
  } catch {
    // ignore if not found
  }
}
