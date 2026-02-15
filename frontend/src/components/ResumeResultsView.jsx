export default function ResumeResultsView({ result }) {
  const { overall_assessment, read_back, distinctiveness, narrative_gaps, tradeoff_analysis, uncertainty_notes } = result

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Overall Assessment Banner */}
      <div style={{
        padding: '1rem 1.5rem',
        background: '#1e40af',
        color: '#fff',
        borderRadius: '8px',
      }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Strategic Assessment</div>
        <div style={{ fontSize: '0.9rem', opacity: 0.95, lineHeight: 1.6 }}>{overall_assessment}</div>
      </div>

      {/* Resume Read-Back */}
      <Section title="Resume Read-Back">
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.75rem' }}>
          What your resume actually signals to a reader.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <ReadBackRow label="Professional Identity" value={read_back.professional_identity} />
          <ReadBackRow label="Seniority Signal" value={read_back.seniority_signal} />
          <ReadBackRow label="Domain Signal" value={read_back.domain_signal} />
          <ReadBackRow label="Functional Signal" value={read_back.functional_signal} />
          <ReadBackRow label="Trajectory Story" value={read_back.trajectory_story} />
          <ReadBackRow label="Overall Impression" value={read_back.overall_impression} />
        </div>
      </Section>

      {/* Distinctiveness Check */}
      <Section title="Distinctiveness Check">
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.75rem' }}>
          {distinctiveness.summary}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <h4 style={{ margin: '0 0 0.5rem', color: '#16a34a' }}>Stand Out</h4>
            {distinctiveness.stand_out.map((item, i) => (
              <DistinctivenessCard key={i} item={item} borderColor="#bbf7d0" />
            ))}
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.5rem', color: '#dc2626' }}>Blend In</h4>
            {distinctiveness.blend_in.map((item, i) => (
              <DistinctivenessCard key={i} item={item} borderColor="#fecaca" />
            ))}
          </div>
        </div>
      </Section>

      {/* Narrative Gaps */}
      <Section title="Narrative Gaps">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {narrative_gaps.map((gap, i) => (
            <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.75rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{gap.gap}</div>
              <div style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>{gap.impact}</div>
              <div style={{ fontSize: '0.8rem', color: '#2563eb' }}>{gap.suggestion}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Tradeoff Analysis */}
      <Section title="Tradeoff Analysis">
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.75rem' }}>
          {tradeoff_analysis.overall_balance}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tradeoff_analysis.tradeoffs.map((item, i) => {
            const treatmentColor = {
              'Emphasized': '#16a34a',
              'Buried': '#dc2626',
              'Underweight': '#ca8a04',
            }[item.current_treatment] || '#64748b'

            return (
              <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: treatmentColor,
                    textTransform: 'uppercase',
                  }}>
                    {item.current_treatment}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.element}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#475569' }}>{item.assessment}</div>
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

function ReadBackRow({ label, value }) {
  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.75rem' }}>
      <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#64748b', marginBottom: '0.2rem' }}>{label}</div>
      <div style={{ fontSize: '0.9rem' }}>{value}</div>
    </div>
  )
}

function DistinctivenessCard({ item, borderColor }) {
  return (
    <div style={{ border: `1px solid ${borderColor}`, borderRadius: '6px', padding: '0.75rem', marginBottom: '0.5rem' }}>
      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{item.area}</div>
      <div style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>{item.assessment}</div>
      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.explanation}</div>
    </div>
  )
}
