'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { validateString, validateNIK, validatePhone, validateRTRW } from '@/lib/validate'
import { isRedirectError } from '@/lib/redirect-guard'
import { getAuthenticatedUser } from '@/lib/auth'

export async function updateProfile(formData: FormData) {
  const { user } = await getAuthenticatedUser()

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })
    if (!profile) throw new Error('profile_not_found')

    const name = formData.get('name') as string
    const nik = formData.get('nik') as string
    const phone = formData.get('phone') as string
    const rt = formData.get('rt') as string
    const rw = formData.get('rw') as string

    const errName = validateString(name, 'Nama', 100)
    const errNIK = validateNIK(nik)
    const errPhone = validatePhone(phone)
    const errRT = validateRTRW(rt, 'RT')
    const errRW = validateRTRW(rw, 'RW')

    if (errName || errNIK || errPhone || errRT || errRW) {
      redirect(`/dashboard/settings?error=${encodeURIComponent(errName || errNIK || errPhone || errRT || errRW || '')}`)
    }

    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        name,
        nik,
        phone,
        address: formData.get('address') as string,
        rt,
        rw,
      }
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/settings')
    redirect('/dashboard/settings?message=Profil berhasil diperbarui')
  } catch (err) {
    console.error('UpdateProfile Error:', err)
    if (isRedirectError(err)) throw err;
    redirect('/dashboard/settings?error=system_error')
  }
}
