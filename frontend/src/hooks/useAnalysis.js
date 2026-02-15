import { useState, useCallback, useRef } from 'react'

export function useAnalysis() {
  const [status, setStatus] = useState('idle') // idle | streaming | complete | error
  const [streamingText, setStreamingText] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const analyze = useCallback(async (formData) => {
    setStatus('streaming')
    setStreamingText('')
    setResult(null)
    setError(null)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: controller.signal,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `Server error: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)

          if (data === '[DONE]') {
            if (!result) setStatus('complete')
            continue
          }

          try {
            const parsed = JSON.parse(data)
            if (parsed.type === 'delta') {
              setStreamingText(prev => prev + parsed.text)
            } else if (parsed.type === 'complete') {
              setResult(parsed.result)
              setStatus('complete')
            } else if (parsed.type === 'error') {
              setError(parsed.message)
              setStatus('error')
            }
          } catch {
            // skip malformed SSE lines
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setStatus('idle')
      } else {
        setError(err.message)
        setStatus('error')
      }
    }
  }, [])

  const cancel = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
    }
  }, [])

  return { status, streamingText, result, error, analyze, cancel }
}
