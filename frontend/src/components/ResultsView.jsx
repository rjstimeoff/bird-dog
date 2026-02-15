import ScoreGauge from './ScoreGauge'
import BulletUpgrade from './BulletUpgrade'

export default function ResultsView({ result }) {
  const { role_summary, alignment, core_alignment, positioning_strategies, resume_upgrades, risks_and_tradeoffs, recommendation, recommendation_rationale, uncertainty_notes } = result

  const recColors = {
    'Apply aggressively': '#16a34a',
    'Apply with repositioning': '#2563eb',
    'Strategic stretch role': '#ca8a04',
    'Low ROI role': '#dc2626',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Recommendation Banner */}
      <div style={{
        padding: '1rem 1.5rem',
        background: recColors[recommendation] || '#333',
        color: '#fff',
        borderRadius: '8px',
      }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{recommendation}</div>
        <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.95 }}>{recommendation_rationale}</div>
      </div>

      {/* Score */}
      <Section title="Strategic Fit Index">
        <ScoreGauge alignment={alignment} />
      </Section>

      {/* Role Summary */}
      <Section title="Role Summary">
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>{role_summary.title}</strong> — {role_summary.seniority}
        </div>
        <p style={{ margin: '0.25rem 0', color: '#475569' }}>{role_summary.core_function}</p>
        <div style={{ marginTop: '0.75rem' }}>
          <strong style={{ fontSize: '0.85rem' }}>Key Responsibilities</strong>
          <ul style={{ margin: '0.25rem 0', paddingLeft: '1.25rem' }}>
            {role_summary.key_responsibilities.map((r, i) => <li key={i} style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>{r}</li>)}
          </ul>
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <strong style={{ fontSize: '0.85rem' }}>Success Signals</strong>
          <ul style={{ margin: '0.25rem 0', paddingLeft: '1.25rem' }}>
            {role_summary.success_signals.map((s, i) => <li key={i} style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>{s}</li>)}
          </ul>
        </div>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>{role_summary.organizational_context}</p>
      </Section>

      {/* Core Alignment */}
      <Section title="Strengths & Gaps">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <h4 style={{ margin: '0 0 0.5rem', color: '#16a34a' }}>Strengths</h4>
            {core_alignment.strengths.map((s, i) => (
              <Card key={i} item={s} borderColor="#bbf7d0" />
            ))}
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.5rem', color: '#dc2626' }}>Gaps</h4>
            {core_alignment.gaps.map((g, i) => (
              <Card key={i} item={g} borderColor="#fecaca" />
            ))}
          </div>
        </div>
      </Section>

      {/* Positioning Strategies */}
      <Section title="Positioning Strategies">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {positioning_strategies.map((ps, i) => (
            <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: ps.label === 'Conservative' ? '#2563eb' : '#7c3aed' }}>
                {ps.label}
              </div>
              <p style={{ fontSize: '0.9rem', margin: '0 0 0.5rem' }}>{ps.narrative}</p>
              <ul style={{ margin: '0 0 0.5rem', paddingLeft: '1.25rem' }}>
                {ps.key_points.map((kp, j) => <li key={j} style={{ fontSize: '0.85rem', marginBottom: '0.2rem' }}>{kp}</li>)}
              </ul>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                <strong>Risk:</strong> {ps.risks}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Resume Upgrades */}
      <Section title="Resume Bullet Upgrades">
        <BulletUpgrade upgrades={resume_upgrades} />
      </Section>

      {/* Risks & Tradeoffs */}
      <Section title="Risks & Tradeoffs">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {risks_and_tradeoffs.map((rt, i) => {
            const sevColor = { Low: '#16a34a', Medium: '#ca8a04', High: '#dc2626' }[rt.severity] || '#64748b'
            return (
              <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: sevColor, textTransform: 'uppercase' }}>{rt.severity}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{rt.risk}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#475569' }}>{rt.mitigation}</div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* Uncertainty Notes */}
      {uncertainty_notes && (
        <Section title="Uncertainty Notes">
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>{uncertainty_notes}</p>
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function Card({ item, borderColor }) {
  return (
    <div style={{ border: `1px solid ${borderColor}`, borderRadius: '6px', padding: '0.75rem', marginBottom: '0.5rem' }}>
      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{item.area}</div>
      <div style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>{item.assessment}</div>
      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.evidence}</div>
    </div>
  )
}
