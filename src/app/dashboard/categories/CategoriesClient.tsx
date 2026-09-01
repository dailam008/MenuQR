'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Check, X, GripVertical } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Category, CategoryInsert, Database } from '@/types/database'

type CategoryUpdate = Database['public']['Tables']['categories']['Update']

interface Props {
  outletId: string
  initialCategories: Category[]
}

export default function CategoriesClient({ outletId, initialCategories }: Props) {
  const [categories, setCategories] = useState(initialCategories)
  const [newName, setNewName] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  async function addCategory() {
    if (!newName.trim()) return
    setLoading(true)
    setError('')
    const insertPayload: CategoryInsert = {
      outlet_id: outletId,
      name: newName.trim(),
      sort_order: categories.length,
    }
    const { data, error: err } = await supabase
      .from('categories')
      .insert(insertPayload)
      .select()
      .single()
    if (err) { setError(err.message); setLoading(false); return }
    setCategories(prev => [...prev, data as Category])
    setNewName('')
    setLoading(false)
  }

  async function updateCategory(id: string) {
    if (!editName.trim()) return
    const updatePayload: CategoryUpdate = { name: editName.trim() }
    const { error: err } = await supabase
      .from('categories').update(updatePayload).eq('id', id)
    if (err) { setError(err.message); return }
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name: editName.trim() } : c))
    setEditId(null)
  }

  async function deleteCategory(id: string) {
    const { error: err } = await supabase.from('categories').delete().eq('id', id)
    if (err) { setError(err.message); return }
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div style={{ maxWidth: 560 }}>
      {/* Tambah kategori */}
      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 12 }}>Tambah Kategori</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            id="new-category-name"
            type="text"
            className="form-input"
            placeholder="Contoh: Makanan Berat, Minuman, Snack..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCategory()}
            style={{ flex: 1 }}
          />
          <button
            id="btn-add-category"
            onClick={addCategory}
            className="btn btn-primary"
            disabled={loading || !newName.trim()}
          >
            <Plus size={16} />
            Tambah
          </button>
        </div>
        {error && <p className="form-error" style={{ marginTop: 8 }}>{error}</p>}
      </div>

      {/* List */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {categories.length === 0 ? (
          <div className="empty-state" style={{ padding: '40px 24px' }}>
            <div className="empty-state-icon"><Plus size={24} /></div>
            <p style={{ fontSize: 14, color: '#9ca3af' }}>Belum ada kategori. Coba tambahkan dulu di atas.</p>
          </div>
        ) : (
          <div>
            {categories.map((cat, idx) => (
              <div
                key={cat.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 16px',
                  borderBottom: idx < categories.length - 1 ? '1px solid #f3f4f6' : 'none',
                }}
              >
                <GripVertical size={16} color="#d1d5db" style={{ cursor: 'grab', flexShrink: 0 }} />
                {editId === cat.id ? (
                  <input
                    id={`edit-cat-${cat.id}`}
                    type="text"
                    className="form-input"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') updateCategory(cat.id); if (e.key === 'Escape') setEditId(null) }}
                    style={{ flex: 1, height: 36, padding: '4px 10px' }}
                    autoFocus
                  />
                ) : (
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#374151' }}>{cat.name}</span>
                )}
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  {editId === cat.id ? (
                    <>
                      <button id={`save-cat-${cat.id}`} onClick={() => updateCategory(cat.id)} className="btn-icon" style={{ color: '#16a34a', background: '#dcfce7', border: '1px solid #bbf7d0' }} title="Simpan">
                        <Check size={14} />
                      </button>
                      <button id={`cancel-cat-${cat.id}`} onClick={() => setEditId(null)} className="btn-icon" title="Batal">
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button id={`edit-cat-btn-${cat.id}`} onClick={() => { setEditId(cat.id); setEditName(cat.name) }} className="btn-icon" title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button id={`delete-cat-${cat.id}`} onClick={() => deleteCategory(cat.id)} className="btn-icon" style={{ color: '#dc2626', background: '#fee2e2', border: '1px solid #fecaca' }} title="Hapus">
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p style={{ marginTop: 12, fontSize: 12, color: '#9ca3af' }}>
        Catatan: menghapus kategori tidak otomatis menghapus menu di dalamnya.
      </p>
    </div>
  )
}
