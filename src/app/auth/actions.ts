'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  // 🔄 Force session refresh to ensure cookies are set
  await supabase.auth.getUser()

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const logFile = 'signup_debug.log'
  const fs = require('fs')
  const log = (msg: string) => fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`)

  const supabase = await createClient()

  const email = formData.get('email') as string
  const fullName = formData.get('full_name') as string
  const password = formData.get('password') as string

  log(`Signup attempt for: ${email}`)

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
    log(`Supabase Auth Error: ${error.message}`)
    redirect('/register?error=' + encodeURIComponent(error.message))
  }

  log(`Supabase Auth Success for user: ${data.user?.id}`)

  if (data.user) {
    try {
      log(`Attempting Prisma upsert for ${email}...`)
      await prisma.profile.upsert({
        where: { username: email },
        update: { userId: data.user.id },
        create: {
          userId: data.user.id,
          username: email,
          name: fullName,
          role: 'MASYARAKAT'
        }
      })
      log(`Prisma upsert Success`)
    } catch (dbError: any) {
      // ⚠️ Don't catch Next.js redirect errors
      if (dbError.digest?.startsWith('NEXT_REDIRECT')) throw dbError;
      
      log(`Prisma Error: ${dbError.message}`)
      console.error('Database Error during signup:', dbError)
      
      const errorMessage = dbError.message?.includes('max clients reached') 
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
    log('Signup complete - Email confirmation required')
    redirect('/login?message=' + encodeURIComponent('Pendaftaran Berhasil! Silahkan cek email Anda untuk verifikasi akun sebelum login.'))
  }

  log('Signup complete - Redirecting to dashboard')
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
