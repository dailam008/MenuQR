export default function MenuLoading() {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div className="skeleton" style={{ height: 32, width: 140, marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 16, width: 100 }} />
        </div>
        <div className="skeleton" style={{ height: 40, width: 130, borderRadius: 10 }} />
      </div>

      {/* Search bar skeleton */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div className="skeleton" style={{ height: 42, flex: 1, borderRadius: 10 }} />
        <div className="skeleton" style={{ height: 42, width: 140, borderRadius: 10 }} />
        <div className="skeleton" style={{ height: 42, width: 80, borderRadius: 10 }} />
      </div>

      {/* Table skeleton */}
      <div className="table-wrapper">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['Item Menu', 'Kategori', 'Harga', 'Status', 'Aksi'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left' }}>
                  <div className="skeleton" style={{ height: 14, width: 70, borderRadius: 4 }} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map(i => (
              <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 10, flexShrink: 0 }} />
                    <div>
                      <div className="skeleton" style={{ height: 16, width: 140, marginBottom: 6 }} />
                      <div className="skeleton" style={{ height: 12, width: 100 }} />
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div className="skeleton" style={{ height: 22, width: 80, borderRadius: 999 }} />
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div className="skeleton" style={{ height: 16, width: 80 }} />
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div className="skeleton" style={{ height: 22, width: 70, borderRadius: 999 }} />
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <div className="skeleton" style={{ height: 32, width: 32, borderRadius: 8 }} />
                    <div className="skeleton" style={{ height: 32, width: 32, borderRadius: 8 }} />
                    <div className="skeleton" style={{ height: 32, width: 32, borderRadius: 8 }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
