import { createClient } from '@/utils/supabase/server'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024
const BUCKET = 'complaints'

export async function uploadImage(
  file: File,
  userId: string,
  prefix: string = 'complaint'
): Promise<string | null> {
  if (file.size > MAX_SIZE) {
    console.error(`Image too large: ${file.size}`)
    return null
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    console.error(`Invalid file type: ${file.type}`)
    return null
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
    return null
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filePath)

  return urlData.publicUrl
}
