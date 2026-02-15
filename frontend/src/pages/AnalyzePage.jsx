import InputForm from '../components/InputForm'
import ResultsView from '../components/ResultsView'
import { useAnalysis } from '../hooks/useAnalysis'

function AnalyzePage() {
  const { status, streamingText, result, error, analyze, cancel } = useAnalysis()

  return (
    <>
      {(status === 'idle' || status === 'error') && (
        <>
          <InputForm onSubmit={analyze} disabled={false} />
          {status === 'error' && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem 1rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              color: '#991b1b',
              fontSize: '0.9rem',
            }}>
              {error}
            </div>
          )}
        </>
      )}

      {status === 'streaming' && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#2563eb',
                animation: 'pulse 1.5s ease-in-out infinite',
              }} />
              <span style={{ fontSize: '0.9rem', color: '#475569' }}>Analyzing...</span>
            </div>
            <button
              onClick={cancel}
              style={{
                padding: '0.4rem 0.8rem',
                fontSize: '0.85rem',
                cursor: 'pointer',
                background: '#fee2e2',
                color: '#991b1b',
                border: '1px solid #fecaca',
                borderRadius: '4px',
              }}
            >
              Cancel
            </button>
          </div>
          <pre style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '1rem',
            fontSize: '0.8rem',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: '400px',
            overflow: 'auto',
          }}>
            {streamingText || 'Waiting for response...'}
          </pre>
        </div>
      )}

      {status === 'complete' && result && (
        <div style={{ marginTop: '1rem' }}>
          <ResultsView result={result} />
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '2rem',
              padding: '0.6rem 1.2rem',
              fontSize: '0.9rem',
              cursor: 'pointer',
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
            }}
          >
            Start New Analysis
          </button>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </>
  )
}

export default AnalyzePage
