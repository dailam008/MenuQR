import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'
import sharp from 'sharp'
import crypto from 'crypto'

// Limit file size to 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Fetch active outlet for this owner to isolate paths
    const { data: outlet } = await supabase
      .from('outlets')
      .select('id')
      .eq('owner_id', user.id)
      .single()

    if (!outlet) {
      return NextResponse.json({ error: 'Outlet tidak ditemukan. Silakan buat outlet terlebih dahulu.' }, { status: 400 })
    }

    // 3. Extract form data
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada berkas yang dikirimkan.' }, { status: 400 })
    }

    // 4. Validation (Size & Type)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Ukuran foto terlalu besar. Maksimal 5MB.' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Format berkas tidak didukung. Gunakan JPG, PNG, atau WebP.' }, { status: 400 })
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 5. Image Processing using Sharp (Convert to WebP & Resize to 3 sizes)
    const fileId = crypto.randomUUID()
    const basePath = `outlets/${outlet.id}/items/${fileId}`

    // Thumbnail: 200x200px (1:1 crop for admin tables)
    const thumbnailBuffer = await sharp(buffer)
      .resize(200, 200, { fit: 'cover' })
      .webp({ quality: 80 })
      .toBuffer()

    // Medium: 600x400px (3:2 crop/fit for public list card)
    const mediumBuffer = await sharp(buffer)
      .resize(600, 400, { fit: 'cover' })
      .webp({ quality: 85 })
      .toBuffer()

    // Large: 1200x800px (3:2 fit for detailed overlay modal)
    const largeBuffer = await sharp(buffer)
      .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer()

    // 6. Upload all 3 sizes to Supabase Storage
    const uploads = [
      { size: 'thumbnail', buffer: thumbnailBuffer },
      { size: 'medium', buffer: mediumBuffer },
      { size: 'large', buffer: largeBuffer }
    ]

    const urls: Record<string, string> = {}

    for (const item of uploads) {
      const filePath = `${basePath}_${item.size}.webp`
      
      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(filePath, item.buffer, {
          contentType: 'image/webp',
          upsert: true,
          duplex: 'half'
        } as any)

      if (uploadError) {
        console.error(`Failed to upload ${item.size} image:`, uploadError)
        throw new Error(`Gagal mengunggah foto ukuran ${item.size}.`)
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath)

      urls[item.size] = publicUrl
    }

    // 7. Return the 3 URLs
    return NextResponse.json({
      success: true,
      urls
    })

  } catch (error: any) {
    console.error('Error in image upload API:', error)
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan saat memproses gambar.' }, { status: 500 })
  }
}
