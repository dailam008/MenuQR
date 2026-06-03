'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Image, FileText, Tag, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Category, MenuItem, MenuItemInsert, Database } from '@/types/database'
import { deleteMenuImageStorage } from '@/lib/supabase/storage'
import { parseMenuImage, stripHtml } from '@/lib/utils'

type MenuItemUpdate = Database['public']['Tables']['menu_items']['Update']

const TAGS = [
  { id: 'pedas', label: '🌶️ Pedas' },
  { id: 'manis', label: '🍯 Manis' },
  { id: 'vegetarian', label: '🥦 Vegetarian' },
  { id: 'bestseller', label: '⭐ Best Seller' },
  { id: 'baru', label: '🆕 Menu Baru' },
]

const MAX_DESC = 100

interface FieldErrors { name?: string; price?: string; description?: string }

interface Props {
  outletId: string
  categories: Category[]
  existingItem?: MenuItem
}

export default function MenuItemForm({ outletId, categories, existingItem }: Props) {
  const router = useRouter()
  const [name, setName] = useState(existingItem?.name || '')
  const [description, setDescription] = useState(existingItem?.description || '')
  const [price, setPrice] = useState(existingItem?.price?.toString() || '')
  const [categoryId, setCategoryId] = useState(existingItem?.category_id || '')
  const [isAvailable, setIsAvailable] = useState(existingItem?.is_available ?? true)
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const name = existingItem?.name || ''
    return TAGS.filter(t => name.includes(t.label.replace(/[^a-zA-Z]/g, ' ').trim())).map(t => t.id)
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(() => {
    const imgObj = parseMenuImage(existingItem?.image_url || null)
    return imgObj ? imgObj.medium : ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const fileRef = useRef<HTMLInputElement>(null)

  function toggleTag(id: string) {
    setSelectedTags(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])
  }

  function validate(): boolean {
    const errs: FieldErrors = {}
    if (!name.trim()) errs.name = 'Nama menu wajib diisi'
    if (!price || isNaN(parseInt(price)) || parseInt(price) <= 0) errs.price = 'Harga harus lebih dari 0'
    if (description.length > MAX_DESC) errs.description = `Deskripsi maksimal ${MAX_DESC} karakter`
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) { setError('Ukuran gambar maksimal 3MB'); return }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setError('')
    setSuccess(false)

    const supabase = createClient()

    try {
      let imageUrl = existingItem?.image_url || null

      if (imageFile) {
        // Delete old image files if they exist to prevent storage leak
        if (existingItem?.image_url) {
          await deleteMenuImageStorage(existingItem.image_url)
        }

        const uploadFormData = new FormData()
        uploadFormData.append('file', imageFile)

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        })

        if (!res.ok) {
          const resJson = await res.json()
          throw new Error(resJson.error || 'Gagal memproses gambar')
        }

        const uploadData = await res.json()
        imageUrl = JSON.stringify(uploadData.urls)
      }

      const tagSuffix = selectedTags.length ? ' [' + selectedTags.join(',') + ']' : ''
      const insertPayload: MenuItemInsert = {
        outlet_id: outletId,
        name: stripHtml(name) + tagSuffix,
        description: description.trim() ? stripHtml(description) : null,
        price: parseInt(price, 10),
        category_id: categoryId || null,
        image_url: imageUrl,
        is_available: isAvailable,
      }

      let err
      if (existingItem) {
        const updatePayload: MenuItemUpdate = {
          name: insertPayload.name,
          description: insertPayload.description,
          price: insertPayload.price,
          category_id: insertPayload.category_id,
          image_url: insertPayload.image_url,
          is_available: insertPayload.is_available,
          updated_at: new Date().toISOString(),
        }
        ;({ error: err } = await supabase.from('menu_items').update(updatePayload).eq('id', existingItem.id))
      } else {
        ;({ error: err } = await supabase.from('menu_items').insert({ ...insertPayload, sort_order: 0 }))
      }

      if (err) throw new Error(err.message)

      setSuccess(true)
      if (!existingItem) {
        setTimeout(() => router.push('/dashboard/menu'), 1200)
      }
    } catch (e: unknown) {
      setError((e as Error).message || 'Terjadi kesalahan.')
    } finally {
      setLoading(false)
    }
  }

  function formatPriceInput(val: string) {
    const num = val.replace(/\D/g, '')
    setPrice(num)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ gap: 20, maxWidth: 800 }} className="grid grid-cols-1 md:grid-cols-2">
        {/* Left: Form fields */}
        <div className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {success && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#16a34a' }}>
              <CheckCircle2 size={16} />
              Menu berhasil {existingItem ? 'diperbarui' : 'ditambahkan'}!
            </div>
          )}
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#dc2626' }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="item-name">Nama Menu *</label>
            <input
              id="item-name" type="text"
              className={`form-input${fieldErrors.name ? ' error' : ''}`}
              placeholder="Nasi Goreng Spesial"
              value={name}
              onChange={e => { setName(e.target.value); setFieldErrors(p => ({ ...p, name: undefined })) }}
            />
            {fieldErrors.name && <p className="form-hint" style={{ color: '#dc2626' }}>⚠ {fieldErrors.name}</p>}
          </div>

          {/* Description */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label className="form-label" htmlFor="item-desc">Deskripsi</label>
              <span style={{ fontSize: 12, color: description.length > MAX_DESC ? '#dc2626' : '#9ca3af' }}>
                {description.length}/{MAX_DESC}
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <FileText size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#9ca3af' }} />
              <textarea
                id="item-desc"
                className={`form-input${description.length > MAX_DESC ? ' error' : ''}`}
                style={{ paddingLeft: 38 }}
                placeholder="Nasi goreng dengan telur, ayam, dan bumbu spesial..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                maxLength={MAX_DESC + 20}
              />
            </div>
            {fieldErrors.description && <p className="form-hint" style={{ color: '#dc2626' }}>⚠ {fieldErrors.description}</p>}
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">Tag (opsional)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {TAGS.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  style={{
                    padding: '6px 12px', borderRadius: 999, fontSize: 13, cursor: 'pointer',
                    background: selectedTags.includes(tag.id) ? '#fff7ed' : '#f9fafb',
                    border: `1.5px solid ${selectedTags.includes(tag.id) ? '#f97316' : '#e5e7eb'}`,
                    color: selectedTags.includes(tag.id) ? '#ea6c0a' : '#6b7280',
                    fontWeight: selectedTags.includes(tag.id) ? 700 : 400,
                    transition: 'all 0.15s',
                  }}
                >
                  {tag.label}
                </button>
              ))}
            </div>
            <p className="form-hint">Tag akan tampil di nama menu sebagai info tambahan</p>
          </div>

          {/* Price */}
          <div className="form-group">
            <label className="form-label" htmlFor="item-price">Harga (Rp) *</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 13, fontWeight: 600 }}>Rp</span>
              <input
                id="item-price"
                type="text"
                inputMode="numeric"
                className={`form-input${fieldErrors.price ? ' error' : ''}`}
                style={{ paddingLeft: 36 }}
                placeholder="15.000"
                value={price ? parseInt(price).toLocaleString('id-ID') : ''}
                onChange={e => { formatPriceInput(e.target.value); setFieldErrors(p => ({ ...p, price: undefined })) }}
                onBlur={() => { if (price) setPrice(parseInt(price).toString()) }}
              />
            </div>
            {fieldErrors.price && <p className="form-hint" style={{ color: '#dc2626' }}>⚠ {fieldErrors.price}</p>}
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label" htmlFor="item-category">Kategori</label>
            <div style={{ position: 'relative' }}>
              <Tag size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <select id="item-category" className="form-input" style={{ paddingLeft: 38 }} value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                <option value="">— Tanpa Kategori —</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            {categories.length === 0 && (
              <p className="form-hint">
                <Link href="/dashboard/categories" style={{ color: '#f97316' }}>Buat kategori</Link> dulu untuk mengorganisir menu.
              </p>
            )}
          </div>

          {/* Availability */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#f9fafb', borderRadius: 10, border: '1px solid #e5e7eb' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Tersedia</div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>Tampilkan item ini di menu publik</div>
            </div>
            <label className="toggle" htmlFor="item-available">
              <input id="item-available" type="checkbox" checked={isAvailable} onChange={e => setIsAvailable(e.target.checked)} />
              <div className="toggle-slider" />
            </label>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button id="btn-save-menu" type="submit" className="btn btn-primary" disabled={loading}>
              {loading
                ? <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }} className="animate-spin" />
                : existingItem ? 'Simpan Perubahan' : 'Tambah Menu'
              }
            </button>
            <Link href="/dashboard/menu" className="btn btn-secondary">
              <ArrowLeft size={16} />
              Kembali
            </Link>
          </div>
        </div>

        {/* Right: Image upload */}
        <div className="card" style={{ padding: 28 }}>
          <label className="form-label" style={{ marginBottom: 12, display: 'block' }}>Foto Menu</label>
          <div
            id="image-upload-zone"
            className={`upload-area`}
            style={{ height: imagePreview ? 'auto' : 200, padding: imagePreview ? 0 : 24, overflow: 'hidden', cursor: 'pointer' }}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('dragover') }}
            onDragLeave={e => e.currentTarget.classList.remove('dragover')}
            onDrop={e => {
              e.preventDefault()
              e.currentTarget.classList.remove('dragover')
              const file = e.dataTransfer.files[0]
              if (file) {
                const input = fileRef.current
                if (input) {
                  const dt = new DataTransfer()
                  dt.items.add(file)
                  input.files = dt.files
                  handleImageChange({ target: input } as any)
                }
              }
            }}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 10 }} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image size={22} color="#9ca3af" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Klik atau drag foto</p>
                  <p style={{ fontSize: 12, color: '#9ca3af' }}>JPG, PNG, WebP — maks. 3MB</p>
                </div>
              </div>
            )}
          </div>
          {imagePreview && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ marginTop: 10, width: '100%' }}
              onClick={() => fileRef.current?.click()}
            >
              Ganti Foto
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />

          {/* Tips */}
          <div style={{ marginTop: 20, padding: 14, background: '#fff7ed', borderRadius: 10, border: '1px solid #fed7aa' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#9a3412', marginBottom: 6 }}>💡 Tips foto menu</p>
            <ul style={{ fontSize: 12, color: '#c2410c', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>Gunakan pencahayaan yang cukup terang</li>
              <li>Foto dari atas (top-down) atau 45 derajat</li>
              <li>Ratio 1:1 atau 4:3 untuk hasil terbaik</li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  )
}
