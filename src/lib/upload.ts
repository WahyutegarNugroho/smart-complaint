import { createClient } from '@/utils/supabase/server'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024
const BUCKET = 'complaints'

function validateMagicBytes(file: File, expectedType: string): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = function (e) {
      const buffer = new Uint8Array(e.target?.result as ArrayBuffer)
      let valid = false
      
      switch (expectedType) {
        case 'image/jpeg':
          valid = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF &&
            [0xE0, 0xE1, 0xE2, 0xE8].includes(buffer[3])
          break
        case 'image/png':
          valid = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47 &&
                  buffer[4] === 0x0D && buffer[5] === 0x0A && buffer[6] === 0x1A && buffer[7] === 0x0A
          break
        case 'image/webp':
          valid = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
                  buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
          break
        case 'image/gif':
          valid = buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 &&
                  (buffer[3] === 0x38 && (buffer[4] === 0x37 || buffer[4] === 0x39) && buffer[5] === 0x61)
          break
        default:
          valid = false
      }
      
      resolve(valid)
    }
    reader.read(file.slice(0, 12))
  })
}

export const UPLOAD_ERROR_MAP: Record<string, string> = {
  file_too_large: 'Ukuran gambar maksimal 5MB',
  invalid_type: 'Tipe file tidak didukung (hanya JPG, PNG, WebP, GIF)',
  invalid_magic: 'File tidak valid (konten tidak sesuai tipe)',
  upload_failed: 'Gagal mengupload gambar',
}

export type UploadResult =
  | { success: true; url: string }
  | { success: false; error: 'file_too_large' | 'invalid_type' | 'invalid_magic' | 'upload_failed' }

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

  const isValidMagic = await validateMagicBytes(file, file.type)
  if (!isValidMagic) {
    return { success: false, error: 'invalid_magic' }
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