'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { validateString, validateRTRW, validateEnum } from '@/lib/validate'
import { resetEscalation } from '@/lib/escalation'

export async function createComplaint(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })
    if (!profile) throw new Error('profile_not_found')

    // 📝 Input Validation
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const location = formData.get('location') as string
    const category = formData.get('category') as string || 'umum'
    const rt = formData.get('rt') as string
    const rw = formData.get('rw') as string
    const rawLat = formData.get('latitude') as string
    const rawLng = formData.get('longitude') as string
    const latitude = rawLat ? parseFloat(rawLat) : null
    const longitude = rawLng ? parseFloat(rawLng) : null

    const validCategory = validateEnum(category, ['keamanan', 'kebersihan', 'fasilitas', 'umum'] as const)
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

    // 🖼️ Robust Image Upload
    if (imageFile && typeof imageFile !== 'string' && imageFile.size > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      if (imageFile.size > 5 * 1024 * 1024) {
        console.error('Image too large:', imageFile.size)
      } else if (!allowedTypes.includes(imageFile.type)) {
        console.error('Invalid file type:', imageFile.type)
      } else {
        const fileExt = imageFile.name?.split('.').pop() || 'jpg'
        const fileName = `complaint-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('complaints')
          .upload(filePath, imageFile, {
            contentType: imageFile.type
          })

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('complaints')
            .getPublicUrl(filePath)
          imageUrl = urlData.publicUrl
        }
      }
    }

    // 🗓️ Safe Date Parsing
    const rawDate = formData.get('incidentDate') as string
    const incidentDate = rawDate ? new Date(rawDate) : new Date()
    const validDate = isNaN(incidentDate.getTime()) ? new Date() : incidentDate

    await prisma.complaint.create({
      data: {
        title,
        content,
        category: validCategory,
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
    if (err instanceof Error && (err as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')) throw err
    redirect('/dashboard?error=system_error')
  }
}

export async function respondToComplaint(formData: FormData) {
  const complaintId = formData.get('complaintId') as string

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    if (!complaintId) redirect('/dashboard')

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })
    
    const existingComplaint = await prisma.complaint.findUnique({
      where: { id: complaintId }
    })

    if (!profile || (profile.role === 'MASYARAKAT' && existingComplaint?.authorId !== profile.id)) {
      redirect(`/dashboard/complaint/${complaintId}?error=forbidden`)
    }

    const content = formData.get('content') as string
    const errContent = validateString(content, 'Tanggapan', 2000)
    if (errContent) {
      redirect(`/dashboard/complaint/${complaintId}?error=${encodeURIComponent(errContent)}`)
    }

    const status = formData.get('status') as 'PENDING' | 'PROCESSING' | 'COMPLETED'
    const validStatus = validateEnum(status, ['PENDING', 'PROCESSING', 'COMPLETED'] as const)
    const imageFile = formData.get('responseImage') as File | null
    let responseImageUrl = null

    // Robust check for file presence and size
    if (imageFile && typeof imageFile !== 'string' && imageFile.size > 0) {
      try {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        if (imageFile.size > 5 * 1024 * 1024) {
          console.error('Response image too large:', imageFile.size)
        } else if (!allowedTypes.includes(imageFile.type)) {
          console.error('Invalid response file type:', imageFile.type)
        } else {
          const fileExt = imageFile.name?.split('.').pop() || 'jpg'
          const fileName = `res-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
          const filePath = `${user.id}/${fileName}`

          const { error: uploadError } = await supabase.storage
            .from('complaints')
            .upload(filePath, imageFile, {
              contentType: imageFile.type
            })

          if (!uploadError) {
            const { data: urlData } = supabase.storage
              .from('complaints')
              .getPublicUrl(filePath)
            responseImageUrl = urlData.publicUrl
          } else {
            console.error('Supabase Upload Error:', uploadError)
          }
        }
      } catch (uploadExc) {
        console.error('File Processing Exception:', uploadExc)
      }
    }

    // Check if status will change
    let statusChanged = false
    if (validStatus && validStatus !== existingComplaint?.status && profile.role !== 'MASYARAKAT') {
      statusChanged = true
    }

    await prisma.response.create({
      data: {
        content,
        imageUrl: responseImageUrl,
        complaintId,
        officerId: profile.id
      }
    })

    // 🛡️ SECURITY: Only Officers/Admins can change status through response
    if (validStatus && profile.role !== 'MASYARAKAT') {
      try {
        await prisma.complaint.update({
          where: { id: complaintId },
          data: { status: validStatus }
        })
        if (validStatus === 'COMPLETED' || validStatus === 'PROCESSING') {
          await resetEscalation(complaintId)
        }
      } catch (statusErr) {
        console.error('Non-critical Status Update Error:', statusErr)
      }
    }

    // Send notification to the citizen
    if (existingComplaint && existingComplaint.authorId !== profile.id) {
      const statusText = validStatus === 'PENDING' ? 'MENUNGGU' : validStatus === 'PROCESSING' ? 'DIPROSES' : 'SELESAI'
      const message = statusChanged
        ? `Laporan Anda "${existingComplaint.title}" mendapat tanggapan baru dari ${profile.name} dan statusnya diubah menjadi ${statusText}.`
        : `Laporan Anda "${existingComplaint.title}" mendapat tanggapan baru dari ${profile.name}.`
      
      await prisma.notification.create({
        data: {
          userId: existingComplaint.authorId,
          message,
          type: 'INFO'
        }
      })
    }

    revalidatePath(`/dashboard/complaint/${complaintId}`)
    revalidatePath('/dashboard')
    redirect(`/dashboard/complaint/${complaintId}?message=Tanggapan berhasil dikirim`)
  } catch (err) {
    console.error('RespondToComplaint Error:', err)
    if (err instanceof Error && (err as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')) throw err
    redirect(`/dashboard/complaint/${complaintId}?error=system_error`)
  }
}

export async function toggleUrgentStatus(formData: FormData) {
  let complaintId = ''
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })
    if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'PETUGAS')) {
      throw new Error('Izin ditolak')
    }

    complaintId = formData.get('id') as string
    const isUrgent = formData.get('isUrgent') === 'true'

    await prisma.complaint.update({
      where: { id: complaintId },
      data: { isUrgent: !isUrgent }
    })

    revalidatePath(`/dashboard/complaint/${complaintId}`)
    revalidatePath('/dashboard')
  } catch (err) {
    console.error('ToggleUrgentStatus Error:', err)
    if (err instanceof Error && (err as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')) throw err
    if (complaintId) redirect(`/dashboard/complaint/${complaintId}?error=Gagal mengubah status urgensi`)
    redirect('/dashboard?error=Gagal mengubah status urgensi')
  }
}

export async function updateComplaint(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

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

    // 📝 Input Validation
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
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      if (imageFile.size > 5 * 1024 * 1024) {
        console.error('Edit image too large:', imageFile.size)
      } else if (!allowedTypes.includes(imageFile.type)) {
        console.error('Invalid edit file type:', imageFile.type)
      } else {
        const fileExt = imageFile.name.split('.').pop() || 'jpg'
        const fileName = `complaint-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('complaints')
          .upload(filePath, imageFile, {
            contentType: imageFile.type
          })

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('complaints')
            .getPublicUrl(filePath)
          imageUrl = urlData.publicUrl
        }
      }
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
    if (err instanceof Error && (err as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')) throw err
    redirect('/dashboard?error=system_error')
  }
}

export async function updateComplaintStatus(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })
    if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'PETUGAS')) {
      throw new Error('Izin ditolak: Hanya petugas yang bisa mengubah status')
    }

    const id = formData.get('id') as string
    const rawStatus = formData.get('status') as string
    const status = validateEnum(rawStatus, ['PENDING', 'PROCESSING', 'COMPLETED'] as const)
    if (!status) throw new Error('Status tidak valid')

    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: { status }
    })

    if (status === 'COMPLETED' || status === 'PROCESSING') {
      await resetEscalation(id)
    }

    // Send notification to the citizen
    const statusText = status === 'PENDING' ? 'MENUNGGU' : status === 'PROCESSING' ? 'DIPROSES' : 'SELESAI'
    await prisma.notification.create({
      data: {
        userId: updatedComplaint.authorId,
        message: `Status laporan Anda "${updatedComplaint.title}" kini telah diubah menjadi ${statusText}.`,
        type: 'INFO'
      }
    })

    revalidatePath(`/dashboard/complaint/${id}`)
    revalidatePath('/dashboard')
  } catch (err) {
    console.error('UpdateComplaintStatus Error:', err)
  }
}

export async function deleteComplaint(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id }
  })
  
  const id = formData.get('id') as string
  const complaint = await prisma.complaint.findUnique({ where: { id } })
  
  if (!profile || !complaint) redirect('/dashboard')

  // Only Admin or Author can delete
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

export async function deleteResponse(responseId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })
    if (!profile) return { error: 'Profile not found' }

    const response = await prisma.response.findUnique({
      where: { id: responseId }
    })
    if (!response) return { error: 'Response not found' }

    // Author can delete, Admin can delete anything
    if (response.officerId !== profile.id && profile.role !== 'ADMIN') {
      return { error: 'Forbidden' }
    }

    await prisma.response.delete({
      where: { id: responseId }
    })

    revalidatePath(`/dashboard/complaint/${response.complaintId}`)
    return { success: true }
  } catch (err) {
    console.error('DeleteResponse Error:', err)
    return { error: 'system_error' }
  }
}

export async function editResponse(responseId: string, content: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })
    if (!profile) return { error: 'Profile not found' }

    const response = await prisma.response.findUnique({
      where: { id: responseId }
    })
    if (!response) return { error: 'Response not found' }

    // Only author can edit
    if (response.officerId !== profile.id) {
      return { error: 'Forbidden' }
    }

    await prisma.response.update({
      where: { id: responseId },
      data: { content }
    })

    revalidatePath(`/dashboard/complaint/${response.complaintId}`)
    return { success: true }
  } catch (err) {
    console.error('EditResponse Error:', err)
    return { error: 'system_error' }
  }
}
