'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Store, MapPin, FileText, Upload, CheckCircle2, AlertCircle, Globe, Info, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import type { Outlet, OutletInsert, Database } from '@/types/database'

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
  const fileRef = useRef<HTMLInputElement>(null)

  function handleNameChange(val: string) {
    setName(val)
    if (!outlet) {
      setSlug(slugify(val))
    }
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { 
      setError('Ukuran file logo maksimal 2MB')
      return 
    }
    setError('')
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  function removeLogo() {
    setLogoFile(null)
    setLogoPreview('')
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    const finalSlug = slug.trim() || slugify(name.trim())
    if (!name.trim()) {
      setError('Nama outlet wajib diisi.')
      return
    }
    if (!finalSlug) {
      setError('URL slug outlet wajib diisi.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    const supabase = createClient()

    try {
      let logoUrl = logoPreview ? (outlet?.logo_url || null) : null

      // Upload logo if changed
      if (logoFile) {
        const ext = logoFile.name.split('.').pop()
        const path = `logos/${userId}/${Date.now()}.${ext}`
        const { error: uploadErr } = await supabase.storage
          .from('menu-images')
          .upload(path, logoFile, { upsert: true })
        if (uploadErr) throw new Error('Gagal mengunggah logo: ' + uploadErr.message)
        const { data: urlData } = supabase.storage.from('menu-images').getPublicUrl(path)
        logoUrl = urlData.publicUrl
      }

      const basePayload: OutletInsert = {
        owner_id: userId,
        name: name.trim(),
        slug: finalSlug,
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
        }, 1200)
      }

    } catch (e: unknown) {
      setError((e as Error).message || 'Terjadi kesalahan saat menyimpan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 1000 }}>
      {/* Alert Notifikasi */}
      {success && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 10,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 20,
          fontSize: 13.5,
          color: '#16a34a'
        }}>
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <span>Data outlet berhasil disimpan{outlet ? '' : ', mengalihkan ke dashboard...'}.</span>
        </div>
      )}

      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 10,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 20,
          fontSize: 13.5,
          color: '#dc2626'
        }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Grid 2 Kolom Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 24 }}>
        
        {/* Kolom Kiri: Informasi Utama */}
        <div className="card" style={{ padding: '24px', borderRadius: 12, border: '1px solid #f1f5f9', background: '#ffffff' }}>
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 14, marginBottom: 18 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>Informasi Outlet</h2>
            <p style={{ fontSize: 12.5, color: '#64748b', margin: '3px 0 0' }}>Nama dan tautan publik katalog menu Anda</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Nama Warung */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="outlet-name" style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Nama Warung / Resto <span style={{ color: '#ea580c' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Store size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  id="outlet-name"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 38, height: 42, fontSize: 13.5, borderRadius: 8 }}
                  placeholder="Contoh: Kedai Kopi Nusantara"
                  value={name}
                  onChange={e => handleNameChange(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* URL Slug Menu */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="outlet-slug" style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Tautan Menu Publik <span style={{ color: '#ea580c' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Globe size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  id="outlet-slug"
                  type="text"
                  className="form-input"
                  style={{ 
                    paddingLeft: 38, 
                    height: 42, 
                    fontSize: 13.5, 
                    borderRadius: 8,
                    background: outlet ? '#f8fafc' : '#ffffff',
                    color: outlet ? '#64748b' : '#0f172a'
                  }}
                  placeholder="kedai-kopi-nusantara"
                  value={slug}
                  onChange={e => setSlug(slugify(e.target.value))}
                  required
                  readOnly={!!outlet}
                />
              </div>
              <p style={{ fontSize: 11.5, color: '#64748b', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Info size={12} color="#94a3b8" />
                <span>Link menu: <strong>/menu/{slug || 'nama-outlet'}</strong></span>
              </p>
            </div>

            {/* Deskripsi */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="outlet-desc" style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Deskripsi Singkat
              </label>
              <div style={{ position: 'relative' }}>
                <FileText size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} />
                <textarea
                  id="outlet-desc"
                  className="form-input"
                  style={{ paddingLeft: 38, fontSize: 13.5, borderRadius: 8, minHeight: 90 }}
                  placeholder="Jelaskan menu andalan atau konsep tempat Anda..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Logo & Lokasi */}
        <div className="card" style={{ padding: '24px', borderRadius: 12, border: '1px solid #f1f5f9', background: '#ffffff' }}>
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 14, marginBottom: 18 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>Logo & Alamat</h2>
            <p style={{ fontSize: 12.5, color: '#64748b', margin: '3px 0 0' }}>Identitas visual dan titik lokasi gerai Anda</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Logo Upload */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 8 }}>
                Logo / Foto Profil Warung
              </label>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  id="logo-upload-area"
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 12,
                    border: '1.5px dashed #cbd5e1',
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                  onClick={() => fileRef.current?.click()}
                >
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Upload size={22} color="#94a3b8" />
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: 12.5, height: 34, padding: '0 12px' }}
                      onClick={() => fileRef.current?.click()}
                    >
                      {logoPreview ? 'Ganti Logo' : 'Unggah Foto'}
                    </button>
                    {logoPreview && (
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="btn-icon"
                        style={{ width: 34, height: 34, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6 }}
                        title="Hapus Logo"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <span style={{ fontSize: 11.5, color: '#94a3b8' }}>Format JPG, PNG (maks. 2MB)</span>
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoChange} />
            </div>

            {/* Alamat */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="outlet-address" style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Alamat Fisik Outlet
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} />
                <textarea
                  id="outlet-address"
                  className="form-input"
                  style={{ paddingLeft: 38, fontSize: 13.5, borderRadius: 8, minHeight: 90 }}
                  placeholder="Contoh: Jl. Ahmad Yani No. 45, Surabaya"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tombol Simpan */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: 8 }}>
        <button
          id="btn-save-outlet"
          type="submit"
          className="btn btn-primary"
          style={{ height: 44, padding: '0 24px', fontSize: 14, fontWeight: 600, borderRadius: 8 }}
          disabled={loading}
        >
          {loading ? (
            <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }} className="animate-spin" />
          ) : (
            outlet ? 'Simpan Perubahan' : 'Buat Outlet'
          )}
        </button>
      </div>
    </form>
  )
}
