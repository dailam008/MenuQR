'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Pencil, Trash2, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

type MenuItemUpdate = Database['public']['Tables']['menu_items']['Update']

interface Props {
  itemId: string
  isAvailable: boolean
}

export default function MenuItemActions({ itemId, isAvailable }: Props) {
  const router = useRouter()
  const [avail, setAvail] = useState(isAvailable)
  const [deleting, setDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  async function toggleAvailability() {
    const supabase = createClient()
    const newVal = !avail
    setAvail(newVal)
    const updatePayload: MenuItemUpdate = { is_available: newVal }
    await supabase.from('menu_items').update(updatePayload).eq('id', itemId)
    router.refresh()
  }

  async function deleteItem() {
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('menu_items').delete().eq('id', itemId)
    router.refresh()
    setShowConfirm(false)
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button
          id={`toggle-avail-${itemId}`}
          onClick={toggleAvailability}
          className="btn-icon"
          title={avail ? 'Tandai habis' : 'Tandai tersedia'}
          style={{ color: avail ? '#16a34a' : '#9ca3af' }}
        >
          {avail ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
        </button>
        <Link
          href={`/dashboard/menu/${itemId}/edit`}
          className="btn-icon"
          title="Edit"
        >
          <Pencil size={16} />
        </Link>
        <button
          id={`delete-${itemId}`}
          onClick={() => setShowConfirm(true)}
          className="btn-icon"
          style={{ color: '#dc2626', background: '#fee2e2', border: '1px solid #fecaca' }}
          title="Hapus"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Delete Confirm Modal */}
      {showConfirm && (
        <div className="modal-backdrop" onClick={() => setShowConfirm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertCircle size={18} color="#dc2626" />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Hapus Item Menu?</h3>
              </div>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 14, color: '#6b7280' }}>
                Tindakan ini tidak bisa dibatalkan. Item menu akan dihapus permanen.
              </p>
            </div>
            <div className="modal-footer">
              <button id="cancel-delete" className="btn btn-secondary" onClick={() => setShowConfirm(false)}>
                Batal
              </button>
              <button id="confirm-delete" className="btn btn-danger" onClick={deleteItem} disabled={deleting}>
                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
