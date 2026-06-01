export default function DashboardLoading() {
  return (
    <div className="animate-fade-in">
      {/* Greeting skeleton */}
      <div style={{ marginBottom: 28 }}>
        <div className="skeleton" style={{ height: 32, width: 260, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 18, width: 200 }} />
      </div>

      {/* Stats skeleton */}
      <div className="stats-grid" style={{ marginBottom: 28 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="stat-card">
            <div className="skeleton" style={{ width: 42, height: 42, borderRadius: 12 }} />
            <div className="skeleton" style={{ height: 36, width: 60, marginTop: 4 }} />
            <div className="skeleton" style={{ height: 16, width: 100 }} />
          </div>
        ))}
      </div>

      {/* Quick actions skeleton */}
      <div className="skeleton" style={{ height: 22, width: 100, marginBottom: 14 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: 16, width: '70%', marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 12, width: '90%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
