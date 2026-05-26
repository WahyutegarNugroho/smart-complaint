import { createClient } from '@/utils/supabase/server'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024
const BUCKET = 'complaints'

export const UPLOAD_ERROR_MAP: Record<string, string> = {
  file_too_large: 'Ukuran gambar maksimal 5MB',
  invalid_type: 'Tipe file tidak didukung (hanya JPG, PNG, WebP, GIF)',
  upload_failed: 'Gagal mengupload gambar',
}

export type UploadResult =
  | { success: true; url: string }
  | { success: false; error: 'file_too_large' | 'invalid_type' | 'upload_failed' }

export async function uploadImage(
  file: File,
  userId: string,
  prefix: string = 'complaint'
): Promise<UploadResult> {
  if (file.size > MAX_SIZE) {
    return { success: false, error: 'file_too_large' }
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { success: false, error: 'invalid_type' }
  }

  const supabase = await createClient()
  const fileExt = file.name?.split('.').pop() || 'jpg'
  const fileName = `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${userId}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, { contentType: file.type })

  if (uploadError) {
    console.error('Supabase Upload Error:', uploadError)
    return { success: false, error: 'upload_failed' }
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filePath)

  return { success: true, url: urlData.publicUrl }
}
