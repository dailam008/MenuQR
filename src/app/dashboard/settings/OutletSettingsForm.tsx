'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Store, MapPin, FileText, Image, CheckCircle2, AlertCircle, Link2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import type { Outlet, OutletInsert, Database } from '@/types/database'
import { usePlanLimit } from '@/hooks/usePlanLimit'

type OutletUpdate = Database['public']['Tables']['outlets']['Update']


interface Props {
  outlet: Outlet | null
  userId: string
}

export default function OutletSettingsForm({ outlet, userId }: Props) {
  const router = useRouter()
  const [name, setName] = useState(outlet?.name || '')
  const [slug, setSlug] = useState(outlet?.slug || '')
  const [address, setAddress] = useState(outlet?.address || '')
  const [description, setDescription] = useState(outlet?.description || '')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>(outlet?.logo_url || '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const { isPro } = usePlanLimit()
  const fileRef = useRef<HTMLInputElement>(null)

  function handleNameChange(val: string) {
    setName(val)
    if (!outlet) setSlug(slugify(val))
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setError('Ukuran logo maksimal 2MB'); return }
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    const supabase = createClient()

    try {
      let logoUrl = outlet?.logo_url || null

      // Upload logo if changed
      if (logoFile) {
        const ext = logoFile.name.split('.').pop()
        const path = `logos/${userId}/${Date.now()}.${ext}`
        const { error: uploadErr } = await supabase.storage
          .from('menu-images')
          .upload(path, logoFile, { upsert: true })
        if (uploadErr) throw new Error('Gagal upload logo: ' + uploadErr.message)
        const { data: urlData } = supabase.storage.from('menu-images').getPublicUrl(path)
        logoUrl = urlData.publicUrl
      }

      const basePayload: OutletInsert = {
        owner_id: userId,
        name: name.trim(),
        slug: slug.trim(),
        address: address.trim() || null,
        description: description.trim() || null,
        logo_url: logoUrl,
        custom_domain: null,
      }

      let err
      if (outlet) {
        const updatePayload: OutletUpdate = {
          name: basePayload.name,
          slug: basePayload.slug,
          address: basePayload.address,
          description: basePayload.description,
          logo_url: basePayload.logo_url,
          custom_domain: null,
          updated_at: new Date().toISOString(),
        }
        ;({ error: err } = await supabase.from('outlets').update(updatePayload).eq('id', outlet.id))
      } else {
        const { data: inserted, error: insertErr } = await supabase
          .from('outlets')
          .insert({ ...basePayload, is_active: true })
          .select('id')
          .single()
        err = insertErr

        if (!err && inserted) {
          // Switch active outlet to the new one
          await fetch('/api/outlets/switch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: inserted.id })
          })
        }
      }

      if (err) throw new Error(err.message)

      setSuccess(true)
      router.refresh()

      if (!outlet) {
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      }

    } catch (e: unknown) {
      setError((e as Error).message || 'Terjadi kesalahan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="card w-full max-w-[600px] p-5 sm:p-7">
        {success && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 14, color: '#16a34a' }}>
            <CheckCircle2 size={16} />
            Outlet berhasil {outlet ? 'diperbarui' : 'dibuat'}!
          </div>
        )}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 14, color: '#dc2626' }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Logo Upload */}
          <div className="form-group">
            <label className="form-label">Logo Warung</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                id="logo-upload-area"
                className="upload-area"
                style={{ width: 80, height: 80, borderRadius: 16, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', flexShrink: 0 }}
                onClick={() => fileRef.current?.click()}
              >
                {logoPreview
                  ? <img src={logoPreview} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <Image size={24} color="#9ca3af" />
                }
              </div>
              <div>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => fileRef.current?.click()}>
                  {logoPreview ? 'Ganti Logo' : 'Upload Logo'}
                </button>
                <p className="form-hint" style={{ marginTop: 4 }}>JPG, PNG, max 2MB</p>
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoChange} />
          </div>

          {/* Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="outlet-name">Nama Warung *</label>
            <div style={{ position: 'relative' }}>
              <Store size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input id="outlet-name" type="text" className="form-input" style={{ paddingLeft: 38 }} placeholder="Warung Makan Bu Ijah" value={name} onChange={e => handleNameChange(e.target.value)} required />
            </div>
          </div>

          {/* Slug */}
          <div className="form-group">
            <label className="form-label" htmlFor="outlet-slug">
              URL Menu Publik *
              <span style={{ fontWeight: 400, color: '#9ca3af', marginLeft: 4 }}>(tidak bisa diubah setelah dibuat)</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Link2 size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                id="outlet-slug"
                type="text"
                className="form-input"
                style={{ paddingLeft: 38 }}
                placeholder="warung-bu-ijah"
                value={slug}
                onChange={e => setSlug(slugify(e.target.value))}
                required
                readOnly={!!outlet}
              />
            </div>
            {slug && (
              <p className="form-hint">
                URL menu: <strong>/menu/{slug}</strong>
              </p>
            )}
          </div>

          {/* Address */}
          <div className="form-group">
            <label className="form-label" htmlFor="outlet-address">Alamat</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#9ca3af' }} />
              <input id="outlet-address" type="text" className="form-input" style={{ paddingLeft: 38 }} placeholder="Jl. Merdeka No. 10, Jakarta" value={address} onChange={e => setAddress(e.target.value)} />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="outlet-desc">Deskripsi</label>
            <div style={{ position: 'relative' }}>
              <FileText size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#9ca3af' }} />
              <textarea id="outlet-desc" className="form-input" style={{ paddingLeft: 38 }} placeholder="Warung makan keluarga dengan masakan rumahan lezat..." value={description} onChange={e => setDescription(e.target.value)} rows={3} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
          <button id="btn-save-outlet" type="submit" className="btn btn-primary" disabled={loading}>
            {loading
              ? <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }} className="animate-spin" />
              : outlet ? 'Simpan Perubahan' : 'Buat Outlet'
            }
          </button>
        </div>
      </div>
    </form>
  )
}
