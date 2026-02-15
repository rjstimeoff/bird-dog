import { useState } from 'react'

export default function BulletWorkshop({ weakBullets, overallAssessment, targetRole, rewriteBullet, rewriteLoading, rewriteError }) {
  const [inputText, setInputText] = useState('')
  const [rewrites, setRewrites] = useState([])

  const handleRewrite = async () => {
    if (inputText.trim().length < 10) return

    const result = await rewriteBullet({
      plain_text: inputText,
      context: overallAssessment || undefined,
      target_role: targetRole || undefined,
    })

    if (result) {
      setRewrites(prev => [{ input: inputText, ...result }, ...prev])
      setInputText('')
    }
  }

  const handleRewriteWeak = (originalText) => {
    setInputText(originalText)
    document.getElementById('bullet-workshop-input')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Flagged Weak Bullets */}
      {weakBullets && weakBullets.length > 0 && (
        <div>
          <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            Bullets to Rework
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.75rem' }}>
            These bullets were flagged as weak. Click "Rewrite This" to workshop them below.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {weakBullets.map((bullet, i) => (
              <div key={i} style={{ border: '1px solid #fde68a', borderRadius: '6px', padding: '0.75rem', background: '#fffbeb' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  {bullet.section}
                </div>
                <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem', fontStyle: 'italic' }}>
                  "{bullet.original}"
                </div>
                <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.5rem' }}>
                  {bullet.problem}
                </div>
                <button
                  type="button"
                  onClick={() => handleRewriteWeak(bullet.original)}
                  style={{
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    background: '#eff6ff',
                    color: '#1e40af',
                    border: '1px solid #bfdbfe',
                    borderRadius: '4px',
                  }}
                >
                  Rewrite This
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rewrite Input */}
      <div id="bullet-workshop-input">
        <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          Bullet Workshop
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.75rem' }}>
          Describe your work in plain language. Bird Dog will rewrite it into a polished resume bullet.
        </p>
        <textarea
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="e.g., I helped redesign our checkout flow and it reduced cart abandonment by about 15%..."
          rows={4}
          style={{ width: '100%', fontFamily: 'inherit', fontSize: '0.9rem', padding: '0.5rem', marginBottom: '0.5rem' }}
        />
        <button
          type="button"
          onClick={handleRewrite}
          disabled={inputText.trim().length < 10 || rewriteLoading}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: inputText.trim().length >= 10 && !rewriteLoading ? 'pointer' : 'not-allowed',
            backgroundColor: inputText.trim().length >= 10 && !rewriteLoading ? '#2563eb' : '#94a3b8',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
          }}
        >
          {rewriteLoading ? 'Rewriting...' : 'Rewrite'}
        </button>

        {rewriteError && (
          <div style={{
            marginTop: '0.5rem',
            padding: '0.5rem 0.75rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            color: '#991b1b',
            fontSize: '0.85rem',
          }}>
            {rewriteError}
          </div>
        )}
      </div>

      {/* Rewrite Results */}
      {rewrites.length > 0 && (
        <div>
          <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            Rewritten Bullets
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {rewrites.map((rw, i) => (
              <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>
                  <strong>Original:</strong> {rw.input}
                </div>
                <div style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  padding: '0.5rem 0.75rem',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '6px',
                  marginBottom: '0.5rem',
                }}>
                  {rw.rewritten}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.5rem' }}>
                  <strong>Rationale:</strong> {rw.rationale}
                </div>
                {rw.alternatives && rw.alternatives.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>Alternatives:</div>
                    {rw.alternatives.map((alt, j) => (
                      <div key={j} style={{
                        fontSize: '0.85rem',
                        padding: '0.4rem 0.6rem',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px',
                        marginBottom: '0.25rem',
                      }}>
                        {alt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
