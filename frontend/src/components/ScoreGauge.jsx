export default function ScoreGauge({ alignment }) {
  const { skill_alignment, trajectory_fit, differentiation_potential, strategic_fit_index } = alignment

  const getColor = (score) => {
    if (score >= 7) return '#16a34a'
    if (score >= 4) return '#ca8a04'
    return '#dc2626'
  }

  const color = getColor(strategic_fit_index)

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
      padding: '1.5rem',
      background: '#f8fafc',
      borderRadius: '8px',
      border: `2px solid ${color}`,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', fontWeight: 700, color, lineHeight: 1 }}>
          {strategic_fit_index}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>/ 10</div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.25rem' }}>Strategic Fit</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <ScoreBar label="Skill Alignment" score={skill_alignment} max={4} rationale={alignment.skill_rationale} />
        <ScoreBar label="Trajectory Fit" score={trajectory_fit} max={3} rationale={alignment.trajectory_rationale} />
        <ScoreBar label="Differentiation" score={differentiation_potential} max={3} rationale={alignment.differentiation_rationale} />
      </div>
    </div>
  )
}

function ScoreBar({ label, score, max, rationale }) {
  const pct = (score / max) * 100

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
        <span>{label}</span>
        <span style={{ fontWeight: 600 }}>{score}/{max}</span>
      </div>
      <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: pct >= 70 ? '#16a34a' : pct >= 40 ? '#ca8a04' : '#dc2626',
          borderRadius: '4px',
          transition: 'width 0.3s ease',
        }} />
      </div>
      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>{rationale}</div>
    </div>
  )
}
