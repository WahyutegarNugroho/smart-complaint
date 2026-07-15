'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { validateString } from '@/lib/validate'
import { checkLoginAttempt, recordFailedAttempt, resetLoginAttempts } from '@/lib/login-rate-limit'
import { isRedirectError } from '@/lib/redirect-guard'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const headerList = await headers()
  const ip = headerList.get('x-real-ip') || headerList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  const check = await checkLoginAttempt(ip)
  if (check.locked) {
    redirect('/login?error=locked&remaining=' + check.remainingSeconds)
  }

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    const result = await recordFailedAttempt(ip)
    if (result.locked) {
      redirect('/login?error=locked&remaining=' + result.remainingSeconds)
    }
    redirect('/login?error=' + encodeURIComponent(error.message) + '&remainingAttempts=' + result.remainingAttempts)
  }

  await resetLoginAttempts(ip)

  // 🔄 Force session refresh to ensure cookies are set
  await supabase.auth.getUser()

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const fullName = formData.get('full_name') as string
  const password = formData.get('password') as string

  // 📝 Input Validation
  const errName = validateString(fullName, 'Nama lengkap', 100)
  if (errName) redirect('/register?error=' + encodeURIComponent(errName))

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect('/register?error=' + encodeURIComponent('Email tidak valid'))
  }

  if (!password || password.length < 6) {
    redirect('/register?error=' + encodeURIComponent('Password minimal 6 karakter'))
  }

  console.log('Signup attempt')

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  })

  if (error) {
    console.error('Signup Auth Error:', error.message)
    redirect('/register?error=' + encodeURIComponent(error.message))
  }

  console.log('Signup Auth Success')

  if (data.user) {
    try {
      console.log('Attempting Prisma upsert...')
      await prisma.profile.upsert({
        where: { userId: data.user.id },
        update: { username: email, name: fullName },
        create: {
          userId: data.user.id,
          username: email,
          name: fullName,
          role: 'MASYARAKAT'
        }
      })
      console.log(`Prisma upsert Success`)
    } catch (dbError: unknown) {
      // ⚠️ Don't catch Next.js redirect errors
      if (isRedirectError(dbError)) throw dbError;
      
      const error = dbError as Error;
      console.error('Signup Prisma Error:', error.message)
      
      const errorMessage = error.message?.includes('max clients reached') 
        ? 'Database sedang sibuk. Silahkan coba beberapa saat lagi.'
        : 'Gagal membuat profil. Akun terdaftar di Auth tapi gagal di Database.'
      
      redirect('/register?error=' + encodeURIComponent(errorMessage))
    }
  }

  // 🔄 Force session refresh to ensure cookies are set if session exists
  if (data.session) {
    await supabase.auth.getUser()
  }

  // If session is null, it means email confirmation is required
  if (!data.session) {
    console.log('Signup complete - Email confirmation required')
    redirect('/login?message=' + encodeURIComponent('Pendaftaran Berhasil! Silahkan cek email Anda untuk verifikasi akun sebelum login.'))
  }

  console.log('Signup complete - Redirecting to dashboard')
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect('/forgot-password?error=' + encodeURIComponent('Email tidak valid'))
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  if (!siteUrl) {
    throw new Error('NEXT_PUBLIC_SITE_URL environment variable is not set')
  }
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/reset-password`,
  })

  if (error) {
    redirect('/forgot-password?error=' + encodeURIComponent(error.message))
  }

  redirect('/login?message=' + encodeURIComponent('Link reset password telah dikirim ke email Anda'))
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?error=' + encodeURIComponent('Sesi tidak valid. Silakan ulangi reset password.'))

  const password = formData.get('password') as string
  if (!password || password.length < 6) {
    redirect('/reset-password?error=' + encodeURIComponent('Password minimal 6 karakter'))
  }

  const { error } = await supabase.auth.updateUser({ password })
  if (error) {
    redirect('/reset-password?error=' + encodeURIComponent(error.message))
  }

  redirect('/login?message=' + encodeURIComponent('Password berhasil diubah. Silakan login.'))
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
