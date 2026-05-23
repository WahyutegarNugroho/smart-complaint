'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { validateString, validateRTRW, validateEnum } from '@/lib/validate'
import { uploadImage } from '@/lib/upload'
import { isRedirectError } from '@/lib/redirect-guard'
import { getAuthenticatedUser, getAuthenticatedProfile } from '@/lib/auth'

export async function createComplaint(formData: FormData) {
  try {
    const { user, profile } = await getAuthenticatedProfile()

    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const location = formData.get('location') as string
    const category = formData.get('category') as string || 'umum'
    const rawCategoryId = formData.get('categoryId') as string
    const rt = formData.get('rt') as string
    const rw = formData.get('rw') as string
    const rawLat = formData.get('latitude') as string
    const rawLng = formData.get('longitude') as string
    const latitude = rawLat ? parseFloat(rawLat) : null
    const longitude = rawLng ? parseFloat(rawLng) : null

    const validCategory = validateEnum(category, ['keamanan', 'kebersihan', 'fasilitas', 'umum'] as const)
    let validCategoryId: string | null = null
    if (rawCategoryId) {
      const catExists = await prisma.category.findUnique({ where: { id: rawCategoryId } })
      if (catExists) validCategoryId = catExists.id
    }
    const errTitle = validateString(title, 'Judul', 200)
    const errContent = validateString(content, 'Detail kronologi', 2000)
    const errLocation = validateString(location, 'Lokasi', 200)
    const errRT = validateRTRW(rt, 'RT')
    const errRW = validateRTRW(rw, 'RW')

    if (errTitle || errContent || errLocation || !validCategory || errRT || errRW) {
      redirect(`/dashboard?error=${errTitle || errContent || errLocation || 'Kategori tidak valid' || errRT || errRW}`)
    }

    const imageFile = formData.get('image') as File | null
    let imageUrl = null

    if (imageFile && typeof imageFile !== 'string' && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile, user.id, 'complaint')
    }

    const rawDate = formData.get('incidentDate') as string
    const incidentDate = rawDate ? new Date(rawDate) : new Date()
    const validDate = isNaN(incidentDate.getTime()) ? new Date() : incidentDate

    await prisma.complaint.create({
      data: {
        title,
        content,
        category: validCategory,
        categoryId: validCategoryId,
        isUrgent: formData.get('isUrgent') === 'true',
        incidentDate: validDate,
        location,
        latitude,
        longitude,
        rt,
        rw,
        imageUrl,
        authorId: profile.id,
        status: 'PENDING'
      }
    })

    revalidatePath('/dashboard')
    redirect('/dashboard?message=Laporan berhasil terbit')
  } catch (err) {
    console.error('CreateComplaint Critical Error:', err)
    if (isRedirectError(err)) throw err
    redirect('/dashboard?error=system_error')
  }
}

export async function updateComplaint(formData: FormData) {
  try {
    const { user } = await getAuthenticatedUser()

    const complaintId = formData.get('id') as string
    const existing = await prisma.complaint.findUnique({
      where: { id: complaintId },
      include: { author: true }
    })

    if (!existing || existing.author.userId !== user.id) {
      throw new Error('Izin ditolak')
    }

    if (existing.status !== 'PENDING') {
      redirect(`/dashboard/complaint/${complaintId}?error=Hanya laporan dengan status PENDING yang bisa diedit`)
    }

    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const location = formData.get('location') as string
    const rt = formData.get('rt') as string
    const rw = formData.get('rw') as string
    const rawLat = formData.get('latitude') as string
    const rawLng = formData.get('longitude') as string
    const latitude = rawLat ? parseFloat(rawLat) : existing.latitude
    const longitude = rawLng ? parseFloat(rawLng) : existing.longitude

    const errTitle = validateString(title, 'Judul', 200)
    const errContent = validateString(content, 'Detail kronologi', 2000)
    const errLocation = validateString(location, 'Lokasi', 200)
    const errRT = validateRTRW(rt, 'RT')
    const errRW = validateRTRW(rw, 'RW')

    if (errTitle || errContent || errLocation || errRT || errRW) {
      redirect(`/dashboard/complaint/${complaintId}?error=${encodeURIComponent(errTitle || errContent || errLocation || errRT || errRW || '')}`)
    }

    const imageFile = formData.get('image') as File
    let imageUrl = existing.imageUrl

    if (imageFile && imageFile.size > 0) {
      const uploadedUrl = await uploadImage(imageFile, user.id, 'complaint')
      if (uploadedUrl) imageUrl = uploadedUrl
    }

    await prisma.complaint.update({
      where: { id: complaintId },
      data: {
        title,
        content,
        incidentDate: new Date(formData.get('incidentDate') as string),
        location,
        latitude,
        longitude,
        rt,
        rw,
        imageUrl,
      }
    })

    revalidatePath(`/dashboard/complaint/${complaintId}`)
    revalidatePath('/dashboard')
    redirect(`/dashboard/complaint/${complaintId}?message=Laporan berhasil diperbarui`)
  } catch (err) {
    console.error('UpdateComplaint Error:', err)
    if (isRedirectError(err)) throw err
    redirect('/dashboard?error=system_error')
  }
}

export async function deleteComplaint(formData: FormData) {
  const { user } = await getAuthenticatedUser()
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id }
  })

  const id = formData.get('id') as string
  const complaint = await prisma.complaint.findUnique({ where: { id } })

  if (!profile || !complaint) redirect('/dashboard')

  if (profile.role !== 'ADMIN' && complaint.authorId !== profile.id) {
    redirect('/dashboard?error=forbidden')
  }

  try {
    await prisma.complaint.delete({ where: { id } })
    revalidatePath('/dashboard')
    redirect('/dashboard?message=Laporan berhasil dihapus')
  } catch (err) {
    console.error('DeleteComplaint Error:', err)
    redirect('/dashboard?error=system_error')
  }
}
