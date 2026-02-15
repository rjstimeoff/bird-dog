import { useState } from 'react'
import FileUpload from './FileUpload'

export default function ResumeInputForm({ onSubmit, disabled }) {
  const [resumeText, setResumeText] = useState('')
  const [showOptional, setShowOptional] = useState(false)
  const [targetRole, setTargetRole] = useState('')
  const [careerStage, setCareerStage] = useState('')
  const [additionalContext, setAdditionalContext] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = { resume_text: resumeText }
    if (targetRole.trim()) data.target_role = targetRole
    if (careerStage.trim()) data.career_stage = careerStage
    if (additionalContext.trim()) data.additional_context = additionalContext
    onSubmit(data)
  }

  const canSubmit = resumeText.trim().length >= 50

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
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Target Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              placeholder="e.g., Senior Product Manager, Staff Engineer..."
              style={{ width: '100%', fontFamily: 'inherit', fontSize: '0.9rem', padding: '0.5rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Career Stage</label>
            <input
              type="text"
              value={careerStage}
              onChange={e => setCareerStage(e.target.value)}
              placeholder="e.g., early career, mid-level, senior, career changer..."
              style={{ width: '100%', fontFamily: 'inherit', fontSize: '0.9rem', padding: '0.5rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Additional Context</label>
            <textarea
              value={additionalContext}
              onChange={e => setAdditionalContext(e.target.value)}
              placeholder="Anything else about your goals or priorities..."
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
        Review Resume
      </button>
    </form>
  )
}
