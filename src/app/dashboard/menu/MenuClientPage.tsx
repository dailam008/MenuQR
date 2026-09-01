'use client'

import { useState, useMemo, useTransition } from 'react'
import Link from 'next/link'
import { Plus, Search, Trash2, Edit2, CheckSquare, Square, ToggleLeft, ToggleRight, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatRupiah, parseMenuImage } from '@/lib/utils'
import { ToastContainer, useToast } from '../components/Toast'
import type { Category, MenuItem } from '@/types/database'
import { deleteMenuImageStorage } from '@/lib/supabase/storage'
import { usePlanLimit } from '@/hooks/usePlanLimit'
import UpgradeWall from '../components/UpgradeWall'

type MenuItemWithCategory = MenuItem & { categories: { name: string } | null }

interface Props {
  items: MenuItemWithCategory[]
  categories: Category[]
  outletId: string
}

function EmptyStateSVG() {
  return (
    <svg width="160" height="140" viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="80" cy="120" rx="50" ry="8" fill="#f3f4f6"/>
      <rect x="35" y="30" width="90" height="80" rx="12" fill="#fff7ed" stroke="#fed7aa" strokeWidth="2"/>
      <rect x="48" y="50" width="64" height="8" rx="4" fill="#fdba74"/>
      <rect x="48" y="66" width="44" height="8" rx="4" fill="#fed7aa"/>
      <rect x="48" y="82" width="54" height="8" rx="4" fill="#fed7aa"/>
      <circle cx="120" cy="28" r="18" fill="#f97316"/>
      <text x="120" y="34" textAnchor="middle" fontSize="16" fill="white" fontWeight="bold">+</text>
    </svg>
  )
}

interface DeleteConfirmProps {
  count: number
  names: string[]
  onConfirm: () => void
  onCancel: () => void
}

function DeleteConfirm({ count, names, onConfirm, onCancel }: DeleteConfirmProps) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="card" style={{ padding: 28, maxWidth: 380, width: '100%', animation: 'fadeIn 0.2s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: '#111827' }}>Hapus {count} Menu?</h3>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}><X size={20} /></button>
        </div>
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 14px', marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: '#dc2626', marginBottom: 6 }}>Item berikut akan dihapus permanen:</p>
          <ul style={{ paddingLeft: 16, fontSize: 13, color: '#991b1b' }}>
            {names.slice(0, 5).map((n, i) => <li key={i}>{n}</li>)}
            {names.length > 5 && <li>...dan {names.length - 5} lainnya</li>}
          </ul>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onConfirm} className="btn btn-sm" style={{ flex: 1, background: '#dc2626', color: 'white', border: 'none' }}>
            <Trash2 size={14} /> Ya, Hapus
          </button>
          <button onClick={onCancel} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>Batal</button>
        </div>
      </div>
    </div>
  )
}

export default function MenuClientPage({ items: initialItems, categories, outletId }: Props) {
  const planLimit = usePlanLimit()
  const [wallOpen, setWallOpen] = useState(false)
  const [items, setItems] = useState(initialItems)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleteTarget, setDeleteTarget] = useState<string[] | null>(null)
  const [isPending, startTransition] = useTransition()
  const { toasts, toast, remove } = useToast()

  const filtered = useMemo(() => {
    return items.filter(item => {
      const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase())
      const matchCat = !catFilter || item.category_id === catFilter
      return matchSearch && matchCat
    })
  }, [items, search, catFilter])

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map(i => i.id)))
    }
  }

  async function handleToggleStatus(itemId: string, current: boolean) {
    const supabase = createClient()
    const { error } = await supabase
      .from('menu_items')
      .update({ is_available: !current, updated_at: new Date().toISOString() })
      .eq('id', itemId)

    if (error) {
      toast('Gagal mengubah status', 'error')
      return
    }
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, is_available: !current } : i))
    toast(!current ? 'Menu ditandai Tersedia' : 'Menu ditandai Habis', 'success')
  }

  async function doDelete(ids: string[]) {
    // 1. Clean up old storage files to prevent storage leak
    const itemsToDelete = items.filter(i => ids.includes(i.id))
    for (const item of itemsToDelete) {
      if (item.image_url) {
        await deleteMenuImageStorage(item.image_url)
      }
    }

    // 2. Delete database rows
    const supabase = createClient()
    const { error } = await supabase.from('menu_items').delete().in('id', ids)
    if (error) { toast('Gagal menghapus menu', 'error'); return }
    setItems(prev => prev.filter(i => !ids.includes(i.id)))
    setSelected(new Set())
    toast(`${ids.length} menu berhasil dihapus`, 'success')
  }

  async function handleBulkToggle(toStatus: boolean) {
    const ids = Array.from(selected)
    const supabase = createClient()
    const { error } = await supabase
      .from('menu_items')
      .update({ is_available: toStatus, updated_at: new Date().toISOString() })
      .in('id', ids)
    if (error) { toast('Gagal mengubah status', 'error'); return }
    setItems(prev => prev.map(i => ids.includes(i.id) ? { ...i, is_available: toStatus } : i))
    setSelected(new Set())
    toast(`${ids.length} menu diubah ke ${toStatus ? 'Tersedia' : 'Habis'}`, 'success')
  }

  const selectedItems = items.filter(i => selected.has(i.id))
  const allSelected = filtered.length > 0 && selected.size === filtered.length

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={remove} />

      {deleteTarget && (
        <DeleteConfirm
          count={deleteTarget.length}
          names={items.filter(i => deleteTarget.includes(i.id)).map(i => i.name)}
          onConfirm={() => { doDelete(deleteTarget); setDeleteTarget(null) }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="animate-fade-in">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Menu Saya</h1>
            <p style={{ color: '#6b7280', fontSize: 14 }}>
              {filtered.length} item
              {selected.size > 0 && <span style={{ color: '#f97316', fontWeight: 600 }}> · {selected.size} dipilih</span>}
            </p>
          </div>
          {planLimit.loading ? (
            <div className="animate-pulse" style={{ height: 40, width: 140, background: '#f3f4f6', borderRadius: 8 }} />
          ) : planLimit.canAddMenu ? (
            <Link href="/dashboard/menu/new" className="btn btn-primary">
              <Plus size={16} /> Tambah Menu
            </Link>
          ) : (
            <button onClick={() => setWallOpen(true)} className="btn btn-primary" style={{ cursor: 'pointer' }}>
              <Plus size={16} /> Tambah Menu
            </button>
          )}
        </div>

        {wallOpen && (
          <UpgradeWall
            feature="menu_item"
            isModal
            isOpen={wallOpen}
            onClose={() => setWallOpen(false)}
          />
        )}

        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 38, width: '100%' }}
              placeholder="Cari menu..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                <X size={14} />
              </button>
            )}
          </div>
          <select
            className="form-input"
            style={{ width: 'auto', minWidth: 150 }}
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Bulk Actions Bar */}
        {selected.size > 0 && (
          <div className="animate-slide-in" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#fff7ed', border: '1.5px solid #fdba74',
            borderRadius: 12, padding: '10px 16px', marginBottom: 16, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#9a3412', flex: 1 }}>
              {selected.size} item dipilih
            </span>
            <button onClick={() => handleBulkToggle(true)} className="btn btn-sm btn-secondary" style={{ fontSize: 12 }}>
              <ToggleRight size={14} color="#16a34a" /> Tersedia
            </button>
            <button onClick={() => handleBulkToggle(false)} className="btn btn-sm btn-secondary" style={{ fontSize: 12 }}>
              <ToggleLeft size={14} color="#dc2626" /> Habis
            </button>
            <button onClick={() => setDeleteTarget(Array.from(selected))} className="btn btn-sm" style={{ fontSize: 12, background: '#dc2626', color: 'white', border: 'none' }}>
              <Trash2 size={14} /> Hapus
            </button>
            <button onClick={() => setSelected(new Set())} className="btn btn-sm btn-secondary" style={{ fontSize: 12 }}>
              <X size={14} /> Batal
            </button>
          </div>
        )}

        {/* Table / Empty State */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <EmptyStateSVG />
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#374151', marginBottom: 8, marginTop: 16 }}>
              {search || catFilter ? 'Menu tidak ditemukan' : 'Belum ada menu'}
            </h2>
            <p style={{ color: '#9ca3af', marginBottom: 20, fontSize: 14 }}>
              {search || catFilter
                ? 'Coba kata kunci lain atau hapus filter.'
                : 'Tambahkan menu pertama Anda dan mulai menarik pelanggan!'}
            </p>
            {!search && !catFilter && (
              <Link href="/dashboard/menu/new" className="btn btn-primary"><Plus size={16} />Tambah Menu Pertama</Link>
            )}
          </div>
        ) : (
          <>
            <div className="table-wrapper hidden md:block">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 40 }}>
                    <button onClick={toggleSelectAll} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                      {allSelected ? <CheckSquare size={18} color="#f97316" /> : <Square size={18} color="#d1d5db" />}
                    </button>
                  </th>
                  <th>Item Menu</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item.id} style={{ background: selected.has(item.id) ? '#fff7ed' : undefined }}>
                    <td>
                      <button onClick={() => toggleSelect(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                        {selected.has(item.id) ? <CheckSquare size={18} color="#f97316" /> : <Square size={18} color="#d1d5db" />}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 10, background: item.image_url ? 'transparent' : '#f3f4f6', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {(() => {
                            const parsedImage = parseMenuImage(item.image_url)
                            return parsedImage ? (
                              <img src={parsedImage.thumbnail} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <span style={{ fontSize: 20 }}>🍽️</span>
                            )
                          })()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#111827' }}>{item.name}</div>
                          {item.description && (
                            <div style={{ fontSize: 12, color: '#9ca3af', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      {item.categories?.name
                        ? <span className="badge badge-gray">{item.categories.name}</span>
                        : <span style={{ color: '#9ca3af', fontSize: 13 }}>—</span>}
                    </td>
                    <td style={{ fontWeight: 600, color: '#f97316' }}>{formatRupiah(item.price)}</td>
                    <td>
                      <button
                        onClick={() => handleToggleStatus(item.id, item.is_available)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        title="Klik untuk toggle status"
                      >
                        <span className={`badge ${item.is_available ? 'badge-green' : 'badge-red'}`} style={{ cursor: 'pointer', userSelect: 'none' }}>
                          {item.is_available ? '✓ Tersedia' : '✕ Habis'}
                        </span>
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link href={`/dashboard/menu/${item.id}/edit`} className="btn btn-secondary btn-sm" style={{ padding: '6px 10px' }}>
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget([item.id])}
                          className="btn btn-sm"
                          style={{ padding: '6px 10px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card list for mobile/tablet */}
          <div className="md:hidden space-y-3">
            {/* Mobile Select All Helper */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 8, paddingLeft: 4 }}>
              <button
                onClick={toggleSelectAll}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5,
                  fontWeight: 600, color: '#6b7280'
                }}
              >
                {allSelected ? <CheckSquare size={16} color="#f97316" /> : <Square size={16} color="#d1d5db" />}
                Pilih Semua Menu
              </button>
            </div>

            {filtered.map(item => (
              <div
                key={item.id}
                className="card animate-fade-in animate-slide-in"
                style={{
                  padding: 14,
                  background: selected.has(item.id) ? '#fff7ed' : '#ffffff',
                  border: selected.has(item.id) ? '1.5px solid #fdba74' : '1px solid #e5e7eb',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <button
                    onClick={() => toggleSelect(item.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, marginTop: 2 }}
                  >
                    {selected.has(item.id) ? <CheckSquare size={16} color="#f97316" /> : <Square size={16} color="#d1d5db" />}
                  </button>

                  <div style={{ width: 52, height: 52, borderRadius: 8, background: item.image_url ? 'transparent' : '#f3f4f6', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {(() => {
                      const parsedImage = parseMenuImage(item.image_url)
                      return parsedImage ? (
                        <img src={parsedImage.thumbnail} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: 20 }}>🍽️</span>
                      )
                    })()}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: '#111827', fontSize: 14.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, color: '#f97316', fontSize: 13.5 }}>{formatRupiah(item.price)}</span>
                      {item.categories?.name && (
                        <span className="badge badge-gray" style={{ fontSize: 9.5, padding: '1px 6px' }}>{item.categories.name}</span>
                      )}
                    </div>
                  </div>
                </div>

                {item.description && (
                  <p style={{ fontSize: 12.5, color: '#6b7280', margin: '0 0 0 26px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                    {item.description}
                  </p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f3f4f6', paddingTop: 8, paddingLeft: 26 }}>
                  <button
                    onClick={() => handleToggleStatus(item.id, item.is_available)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <span className={`badge ${item.is_available ? 'badge-green' : 'badge-red'}`} style={{ fontSize: 10.5, padding: '2px 8px' }}>
                      {item.is_available ? '✓ Tersedia' : '✕ Habis'}
                    </span>
                  </button>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link href={`/dashboard/menu/${item.id}/edit`} className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: 12 }}>
                      <Edit2 size={12} /> Edit
                    </Link>
                    <button
                      onClick={() => setDeleteTarget([item.id])}
                      className="btn btn-sm"
                      style={{ padding: '4px 10px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontSize: 12 }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </>
        )}
      </div>
    </>
  )
}
