import { useState, useRef } from 'react'

export default function FileUpload({ onTextExtracted }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [filename, setFilename] = useState(null)
  const inputRef = useRef(null)

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || 'Upload failed')
      }
      const data = await res.json()
      setFilename(data.filename)
      onTextExtracted(data.text)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        style={{
          padding: '0.4rem 0.8rem',
          cursor: uploading ? 'wait' : 'pointer',
          fontSize: '0.85rem',
        }}
      >
        {uploading ? 'Uploading...' : 'Upload PDF'}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        onChange={handleUpload}
        style={{ display: 'none' }}
      />
      {filename && <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem', color: '#666' }}>{filename}</span>}
      {error && <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem', color: '#c00' }}>{error}</span>}
    </div>
  )
}
