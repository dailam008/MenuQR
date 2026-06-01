export default function QRLoading() {
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 24 }}>
        <div className="skeleton" style={{ height: 32, width: 180, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 16, width: 260 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 24, maxWidth: 800 }}>
        <div className="card" style={{ padding: 28, width: 360 }}>
          <div className="skeleton" style={{ height: 52, borderRadius: 14, marginBottom: 20 }} />
          <div className="skeleton" style={{ width: 280, height: 280, borderRadius: 12 }} />
          <div className="skeleton" style={{ height: 14, width: 180, margin: '12px auto 20px' }} />
          <div className="skeleton" style={{ height: 42, borderRadius: 10, marginBottom: 10 }} />
          <div className="skeleton" style={{ height: 42, borderRadius: 10 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 20 }}>
            <div className="skeleton" style={{ height: 16, width: 120, marginBottom: 10 }} />
            <div className="skeleton" style={{ height: 42, borderRadius: 10 }} />
          </div>
          <div className="card" style={{ padding: 20 }}>
            <div className="skeleton" style={{ height: 16, width: 140, marginBottom: 12 }} />
            {[1,2,3,4].map(i => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                <div className="skeleton" style={{ width: 22, height: 22, borderRadius: 8, flexShrink: 0 }} />
                <div className="skeleton" style={{ height: 18, flex: 1 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
