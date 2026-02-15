export default function BulletUpgrade({ upgrades }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {upgrades.map((u, i) => (
        <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
            <div style={{ padding: '0.75rem', background: '#fef2f2', borderRight: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#991b1b', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                Original
              </div>
              <div style={{ fontSize: '0.85rem' }}>{u.original}</div>
            </div>
            <div style={{ padding: '0.75rem', background: '#f0fdf4' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#166534', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                Upgraded
              </div>
              <div style={{ fontSize: '0.85rem' }}>{u.upgraded}</div>
            </div>
          </div>
          <div style={{ padding: '0.5rem 0.75rem', background: '#f8fafc', fontSize: '0.8rem', color: '#475569' }}>
            {u.rationale}
          </div>
        </div>
      ))}
    </div>
  )
}
