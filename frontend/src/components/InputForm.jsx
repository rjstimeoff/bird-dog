import { useState } from 'react'
import FileUpload from './FileUpload'

export default function InputForm({ onSubmit, disabled }) {
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [showOptional, setShowOptional] = useState(false)
  const [idealRole, setIdealRole] = useState('')
  const [careerGoals, setCareerGoals] = useState('')
  const [portfolioSummary, setPortfolioSummary] = useState('')
  const [additionalContext, setAdditionalContext] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      resume_text: resumeText,
      job_description: jobDescription,
    }
    if (idealRole.trim()) data.ideal_role = idealRole
    if (careerGoals.trim()) data.career_goals = careerGoals
    if (portfolioSummary.trim()) data.portfolio_summary = portfolioSummary
    if (additionalContext.trim()) data.additional_context = additionalContext
    onSubmit(data)
  }

  const canSubmit = resumeText.trim().length >= 50 && jobDescription.trim().length >= 50

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Resume</label>
        <FileUpload onTextExtracted={setResumeText} />
        <textarea
          value={resumeText}
          onChange={e => setResumeText(e.target.value)}
          placeholder="Paste your resume text here, or upload a PDF above..."
          rows={10}
          style={{ width: '100%', fontFamily: 'inherit', fontSize: '0.9rem', padding: '0.5rem' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Job Description</label>
        <textarea
          value={jobDescription}
          onChange={e => setJobDescription(e.target.value)}
          placeholder="Paste the full job description here..."
          rows={10}
          style={{ width: '100%', fontFamily: 'inherit', fontSize: '0.9rem', padding: '0.5rem' }}
        />
      </div>

      <button
        type="button"
        onClick={() => setShowOptional(!showOptional)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          padding: 0,
          fontSize: '0.9rem',
          color: '#555',
        }}
      >
        {showOptional ? '- Hide' : '+ Show'} optional fields
      </button>

      {showOptional && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Ideal Role</label>
            <textarea
              value={idealRole}
              onChange={e => setIdealRole(e.target.value)}
              placeholder="Describe your ideal role..."
              rows={3}
              style={{ width: '100%', fontFamily: 'inherit', fontSize: '0.9rem', padding: '0.5rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Career Goals</label>
            <textarea
              value={careerGoals}
              onChange={e => setCareerGoals(e.target.value)}
              placeholder="What are your career goals?"
              rows={3}
              style={{ width: '100%', fontFamily: 'inherit', fontSize: '0.9rem', padding: '0.5rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Portfolio / LinkedIn Summary</label>
            <textarea
              value={portfolioSummary}
              onChange={e => setPortfolioSummary(e.target.value)}
              placeholder="Summary of your portfolio or LinkedIn..."
              rows={3}
              style={{ width: '100%', fontFamily: 'inherit', fontSize: '0.9rem', padding: '0.5rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Additional Context</label>
            <textarea
              value={additionalContext}
              onChange={e => setAdditionalContext(e.target.value)}
              placeholder="Anything else you'd like to share..."
              rows={3}
              style={{ width: '100%', fontFamily: 'inherit', fontSize: '0.9rem', padding: '0.5rem' }}
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit || disabled}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: canSubmit && !disabled ? 'pointer' : 'not-allowed',
          backgroundColor: canSubmit && !disabled ? '#2563eb' : '#94a3b8',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
        }}
      >
        Analyze Fit
      </button>
    </form>
  )
}
