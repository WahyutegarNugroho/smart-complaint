'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'

// --- EXISTING ACTIONS (COMPLAINTS) ---

export async function createComplaint(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let result: { success: boolean; error?: string } = { success: false }
  
  try {
    if (!user) {
      result = { success: false, error: 'auth_required' }
    } else {
      const profile = await prisma.profile.findUnique({
        where: { userId: user.id }
      })
      if (!profile) throw new Error('profile_not_found')

      const imageFile = formData.get('image') as File | null
      let imageUrl = null

      // 🖼️ Robust Image Upload
      if (imageFile && typeof imageFile !== 'string' && imageFile.size > 0) {
        const fileExt = imageFile.name?.split('.').pop() || 'jpg'
        const fileName = `complaint-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('complaints')
          .upload(filePath, imageFile, {
            contentType: imageFile.type,
            upsert: true
          })

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('complaints')
            .getPublicUrl(filePath)
          imageUrl = urlData.publicUrl
        }
      }

      // 🗓️ Safe Date Parsing
      const rawDate = formData.get('incidentDate') as string
      const incidentDate = rawDate ? new Date(rawDate) : new Date()
      const validDate = isNaN(incidentDate.getTime()) ? new Date() : incidentDate

      await prisma.complaint.create({
        data: {
          title: formData.get('title') as string,
          content: formData.get('content') as string,
          category: formData.get('category') as string || 'umum',
          isUrgent: formData.get('isUrgent') === 'true',
          incidentDate: validDate,
          location: formData.get('location') as string,
          rt: formData.get('rt') as string,
          rw: formData.get('rw') as string,
          imageUrl: imageUrl,
          authorId: profile.id,
          status: 'PENDING'
        }
      })

      revalidatePath('/dashboard')
      result = { success: true }
    }
  } catch (err) {
    console.error('CreateComplaint Critical Error:', err)
    result = { success: false, error: 'system_error' }
  }

  // Redirect outside try-catch to satisfy Next.js
  if (result.success) {
    redirect('/dashboard?message=Laporan berhasil terbit')
  } else if (result.error === 'auth_required') {
    redirect('/login')
  } else {
    redirect(`/dashboard?error=${result.error}`)
  }
}

export async function respondToComplaint(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const complaintId = formData.get('complaintId') as string
  if (!complaintId) redirect('/dashboard')

  let result: { success: boolean; error?: string } = { success: false }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })
    
    const existingComplaint = await prisma.complaint.findUnique({
      where: { id: complaintId }
    })

    if (!profile || (profile.role === 'MASYARAKAT' && existingComplaint?.authorId !== profile.id)) {
      result = { success: false, error: 'forbidden' }
    } else {
      const content = formData.get('content') as string
      if (!content) {
        result = { success: false, error: 'content_required' }
      } else {
        const status = formData.get('status') as 'PENDING' | 'PROCESSING' | 'COMPLETED'
        const imageFile = formData.get('responseImage') as File | null
        let responseImageUrl = null

        // Robust check for file presence and size
        if (imageFile && typeof imageFile !== 'string' && imageFile.size > 0) {
          try {
            const fileExt = imageFile.name?.split('.').pop() || 'jpg'
            const fileName = `res-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
            const filePath = `${user.id}/${fileName}`

            const { error: uploadError } = await supabase.storage
              .from('complaints')
              .upload(filePath, imageFile, {
                contentType: imageFile.type,
                upsert: true
              })

            if (!uploadError) {
              const { data: urlData } = supabase.storage
                .from('complaints')
                .getPublicUrl(filePath)
              responseImageUrl = urlData.publicUrl
            } else {
              console.error('Supabase Upload Error:', uploadError)
            }
          } catch (uploadExc) {
            console.error('File Processing Exception:', uploadExc)
          }
        }

        // Check if status will change
        let statusChanged = false
        if (status && status !== existingComplaint?.status && profile.role !== 'MASYARAKAT') {
          statusChanged = true
        }

        await prisma.response.create({
          data: {
            content: content,
            imageUrl: responseImageUrl,
            complaintId: complaintId,
            officerId: profile.id
          }
        })

        // 🛡️ SECURITY: Only Officers/Admins can change status through response
        if (status && profile.role !== 'MASYARAKAT') {
          try {
            await prisma.complaint.update({
              where: { id: complaintId },
              data: { status: status }
            })
          } catch (statusErr) {
            console.error('Non-critical Status Update Error:', statusErr)
          }
        }

        // Send notification to the citizen
        if (existingComplaint && existingComplaint.authorId !== profile.id) {
          const statusText = status === 'PENDING' ? 'MENUNGGU' : status === 'PROCESSING' ? 'DIPROSES' : 'SELESAI'
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
        result = { success: true }
      }
    }
  } catch (err) {
    console.error('RespondToComplaint Error:', err)
    result = { success: false, error: 'system_error' }
  }

  // Perform redirect OUTSIDE try-catch
  if (result.success) {
    redirect(`/dashboard/complaint/${complaintId}?message=Tanggapan berhasil dikirim`)
  } else {
    redirect(`/dashboard/complaint/${complaintId}?error=${result.error || 'unknown'}`)
  }
}

export async function toggleUrgentStatus(formData: FormData) {
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

    const id = formData.get('id') as string
    const isUrgent = formData.get('isUrgent') === 'true'

    await prisma.complaint.update({
      where: { id },
      data: { isUrgent: !isUrgent }
    })

    revalidatePath(`/dashboard/complaint/${id}`)
    revalidatePath('/dashboard')
  } catch (err) {
    console.error('ToggleUrgentStatus Error:', err)
    // Optional: throw to show error on client or redirect with error
  }
}

// --- ANNOUNCEMENT ACTIONS ---

export async function createAnnouncement(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const profile = await prisma.profile.findUnique({ where: { userId: user.id } })
    if (!profile || profile.role !== 'ADMIN') throw new Error('Izin ditolak')

    await prisma.announcement.create({
      data: {
        title: formData.get('title') as string,
        content: formData.get('content') as string,
        authorId: profile.id
      }
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/admin/announcements')
  } catch (err) {
    console.error('CreateAnnouncement Error:', err)
  }
  redirect('/dashboard/admin/announcements?message=Pengumuman berhasil diterbitkan')
}

export async function updateAnnouncement(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const id = formData.get('id') as string
    await prisma.announcement.update({
      where: { id },
      data: {
        title: formData.get('title') as string,
        content: formData.get('content') as string
      }
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/admin/announcements')
  } catch (err) {
    console.error('UpdateAnnouncement Error:', err)
  }
  redirect('/dashboard/admin/announcements?message=Pengumuman berhasil diubah')
}

export async function deleteAnnouncement(formData: FormData) {
  try {
    const id = formData.get('id') as string
    await prisma.announcement.delete({ where: { id } })
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/admin/announcements')
  } catch (err) {
    console.error('DeleteAnnouncement Error:', err)
  }
}

// --- NOTIFICATION ACTIONS ---

export async function markNotificationAsRead(notificationId: string) {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    })
    revalidatePath('/dashboard')
  } catch (err) {
    console.error('MarkNotificationAsRead Error:', err)
  }
}

// --- AUDIT ACTIONS ---

export async function adminDeleteComplaint(formData: FormData) {
  try {
    const id = formData.get('id') as string
    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: { author: true }
    })

    if (!complaint) return

    // Kirim Notifikasi ke Warga
    await prisma.notification.create({
      data: {
        userId: complaint.authorId,
        message: `Laporan Anda yang berjudul "${complaint.title}" telah dihapus oleh Admin karena melanggar ketentuan/spam.`,
        type: 'DELETE'
      }
    })

    await prisma.complaint.delete({ where: { id } })

    revalidatePath('/dashboard')
  } catch (err) {
    console.error('AdminDeleteComplaint Error:', err)
  }
  redirect('/dashboard?message=Laporan telah dihapus dan warga diberi tahu')
}

// --- ADMIN ACTIONS (USER MANAGEMENT) ---

export async function updateUserRole(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user: adminUser } } = await supabase.auth.getUser()
    if (!adminUser) redirect('/login')

    const adminProfile = await prisma.profile.findUnique({
      where: { userId: adminUser.id }
    })
    if (!adminProfile || adminProfile.role !== 'ADMIN') throw new Error('Hanya Admin yang dapat mengubah role')

    const targetProfileId = formData.get('profileId') as string
    const newRole = formData.get('role') as 'MASYARAKAT' | 'PETUGAS' | 'ADMIN'

    await prisma.profile.update({
      where: { id: targetProfileId },
      data: { role: newRole }
    })

    revalidatePath('/dashboard/admin/users')
  } catch (err) {
    console.error('UpdateUserRole Error:', err)
  }
}

export async function toggleUserVerification(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user: adminUser } } = await supabase.auth.getUser()
    if (!adminUser) redirect('/login')

    const adminProfile = await prisma.profile.findUnique({
      where: { userId: adminUser.id }
    })
    if (!adminProfile || adminProfile.role !== 'ADMIN') throw new Error('Izin ditolak')

    const targetProfileId = formData.get('profileId') as string
    const currentStatus = formData.get('isVerified') === 'true'

    await prisma.profile.update({
      where: { id: targetProfileId },
      data: { isVerified: !currentStatus }
    })

    revalidatePath('/dashboard/admin/users')
  } catch (err) {
    console.error('ToggleUserVerification Error:', err)
  }
}

export async function deleteUserAccount(formData: FormData) {
  try {
    const targetProfileId = formData.get('profileId') as string
    await prisma.profile.delete({ where: { id: targetProfileId } })
    revalidatePath('/dashboard/admin/users')
  } catch (err) {
    console.error('DeleteUserAccount Error:', err)
  }
}

// --- PROFILE ACTIONS ---

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })
    if (!profile) throw new Error('profile_not_found')

    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        name: formData.get('name') as string,
        nik: formData.get('nik') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        rt: formData.get('rt') as string,
        rw: formData.get('rw') as string,
      }
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/settings')
    redirect('/dashboard/settings?message=Profil berhasil diperbarui')
  } catch (err) {
    console.error('UpdateProfile Error:', err)
    if (err instanceof Error && (err as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')) throw err;
    redirect('/dashboard/settings?error=system_error')
  }
}

export async function updateComplaint(formData: FormData) {
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

  const imageFile = formData.get('image') as File
  let imageUrl = existing.imageUrl

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('complaints')
      .upload(filePath, imageFile)

    if (!uploadError) {
      const { data: urlData } = supabase.storage
        .from('complaints')
        .getPublicUrl(filePath)
      imageUrl = urlData.publicUrl
    }
  }

  await prisma.complaint.update({
    where: { id: complaintId },
    data: {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      incidentDate: new Date(formData.get('incidentDate') as string),
      location: formData.get('location') as string,
      rt: formData.get('rt') as string,
      rw: formData.get('rw') as string,
      imageUrl: imageUrl,
    }
  })

  revalidatePath(`/dashboard/complaint/${complaintId}`)
  revalidatePath('/dashboard')
  redirect(`/dashboard/complaint/${complaintId}?message=Laporan berhasil diperbarui`)
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
    const status = formData.get('status') as 'PENDING' | 'PROCESSING' | 'COMPLETED'

    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: { status }
    })

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
