'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { validateString, validateRTRW, validateEnum } from '@/lib/validate'
import { uploadImage, UPLOAD_ERROR_MAP } from '@/lib/upload'
import { isNextControlFlowError, logServerError, mapPrismaError } from '@/lib/errors'
import { isStaff } from '@/lib/authorization'
import { getAuthenticatedUser, getAuthenticatedProfile } from '@/lib/auth'

export type ComplaintFormState = {
  error?: string
} | null

function parseCoordinate(raw: string | null, min: number, max: number): number | null {
  if (!raw) return null
  const num = Number.parseFloat(raw)
  if (!Number.isFinite(num) || num < min || num > max) return null
  return num
}

export async function createComplaint(
  _prevState: ComplaintFormState,
  formData: FormData
): Promise<ComplaintFormState> {
  try {
    const { user, profile } = await getAuthenticatedProfile()

    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const location = formData.get('location') as string
    const category = (formData.get('category') as string) || 'umum'
    const rawCategoryId = formData.get('categoryId') as string
    const rt = formData.get('rt') as string
    const rw = formData.get('rw') as string
    const latitude = parseCoordinate(formData.get('latitude') as string | null, -90, 90)
    const longitude = parseCoordinate(formData.get('longitude') as string | null, -180, 180)

    const validCategory = validateEnum(category, ['keamanan', 'kebersihan', 'fasilitas', 'umum'] as const)
    let validCategoryId: string | null = null
    if (rawCategoryId) {
      const catExists = await prisma.category.findUnique({ where: { id: rawCategoryId }, select: { id: true } })
      if (catExists) validCategoryId = catExists.id
    }
    const errTitle = validateString(title, 'Judul', 200)
    const errContent = validateString(content, 'Detail kronologi', 2000)
    const errLocation = validateString(location, 'Lokasi', 200)
    const errRT = validateRTRW(rt, 'RT')
    const errRW = validateRTRW(rw, 'RW')

    if (errTitle || errContent || errLocation || !validCategory || errRT || errRW) {
      const errorMsg = errTitle ?? errContent ?? errLocation ?? errRT ?? errRW ?? 'Kategori tidak valid'
      return { error: errorMsg }
    }

    const imageFile = formData.get('image') as File | null
    let imageUrl = null

    if (imageFile && typeof imageFile !== 'string' && imageFile.size > 0) {
      const result = await uploadImage(imageFile, user.id, 'complaint')
      if (result.success) {
        imageUrl = result.url
      } else {
        return { error: UPLOAD_ERROR_MAP[result.error] }
      }
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
        isUrgent: isStaff(profile) ? formData.get('isUrgent') === 'true' : false,
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
    if (isNextControlFlowError(err)) throw err
    logServerError('actions.createComplaint', err)
    return { error: mapPrismaError(err).userMessage }
  }
}

export async function updateComplaint(
  _prevState: ComplaintFormState,
  formData: FormData
): Promise<ComplaintFormState> {
  try {
    const { user } = await getAuthenticatedUser()

    const complaintId = formData.get('id') as string
    if (!complaintId) {
      return { error: 'ID laporan tidak valid.' }
    }

    const existing = await prisma.complaint.findUnique({
      where: { id: complaintId },
      select: { status: true, latitude: true, longitude: true, imageUrl: true, author: { select: { userId: true } } }
    })

    if (!existing) {
      return { error: 'Laporan tidak ditemukan atau telah dihapus.' }
    }

    if (existing.author.userId !== user.id) {
      return { error: 'Anda tidak memiliki hak akses untuk mengubah laporan ini.' }
    }

    if (existing.status !== 'PENDING') {
      redirect(`/dashboard/complaint/${complaintId}?error=already_processed`)
    }

    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const location = formData.get('location') as string
    const rt = formData.get('rt') as string
    const rw = formData.get('rw') as string
    const parsedLat = parseCoordinate(formData.get('latitude') as string | null, -90, 90)
    const parsedLng = parseCoordinate(formData.get('longitude') as string | null, -180, 180)
    const latitude = parsedLat ?? existing.latitude
    const longitude = parsedLng ?? existing.longitude

    const errTitle = validateString(title, 'Judul', 200)
    const errContent = validateString(content, 'Detail kronologi', 2000)
    const errLocation = validateString(location, 'Lokasi', 200)
    const errRT = validateRTRW(rt, 'RT')
    const errRW = validateRTRW(rw, 'RW')

    if (errTitle || errContent || errLocation || errRT || errRW) {
      return { error: errTitle ?? errContent ?? errLocation ?? errRT ?? errRW ?? 'Input tidak valid' }
    }

    const imageFile = formData.get('image') as File | null
    let imageUrl = existing.imageUrl

    if (imageFile && typeof imageFile !== 'string' && imageFile.size > 0) {
      const result = await uploadImage(imageFile, user.id, 'complaint')
      if (result.success) {
        imageUrl = result.url
      } else {
        return { error: UPLOAD_ERROR_MAP[result.error] }
      }
    }

    const rawDate = formData.get('incidentDate') as string
    const incidentDate = rawDate ? new Date(rawDate) : new Date()
    const validDate = isNaN(incidentDate.getTime()) ? new Date() : incidentDate

    await prisma.complaint.update({
      where: { id: complaintId },
      data: {
        title,
        content,
        incidentDate: validDate,
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
    if (isNextControlFlowError(err)) throw err
    logServerError('actions.updateComplaint', err)
    return { error: mapPrismaError(err).userMessage }
  }
}

export async function deleteComplaint(formData: FormData) {
  try {
    const { user } = await getAuthenticatedUser()
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { id: true, role: true }
    })

    const id = formData.get('id') as string
    if (!id) redirect('/dashboard?error=not_found')

    const complaint = await prisma.complaint.findUnique({ where: { id }, select: { id: true, authorId: true } })

    if (!profile) redirect('/dashboard?error=unauthorized')
    if (!complaint) redirect('/dashboard?error=not_found')

    if (profile.role !== 'ADMIN' && complaint.authorId !== profile.id) {
      redirect('/dashboard?error=forbidden')
    }

    await prisma.complaint.delete({ where: { id } })
    revalidatePath('/dashboard')
    redirect('/dashboard?message=Laporan berhasil dihapus')
  } catch (err) {
    if (isNextControlFlowError(err)) throw err
    logServerError('actions.deleteComplaint', err)
    const mapped = mapPrismaError(err)
    redirect(`/dashboard?error=${encodeURIComponent(mapped.code === 'NOT_FOUND' ? 'not_found' : mapped.userMessage)}`)
  }
}
