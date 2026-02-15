import { useState, useEffect, useCallback } from 'react'

const API = '/api/tracker'

export function useTracker() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('created_at')
  const [sortDir, setSortDir] = useState('desc')
  const [filterStage, setFilterStage] = useState(null)
  const [filterContacted, setFilterContacted] = useState(null)

  const fetchApplications = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ sort_by: sortBy, sort_dir: sortDir })
      if (filterStage) params.set('stage', filterStage)
      if (filterContacted) params.set('contacted', filterContacted)

      const res = await fetch(`${API}/applications?${params}`)
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
      const data = await res.json()
      setApplications(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [sortBy, sortDir, filterStage, filterContacted])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const createApplication = useCallback(async (app) => {
    const res = await fetch(`${API}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(app),
    })
    if (!res.ok) throw new Error(`Failed to create: ${res.status}`)
    const created = await res.json()
    setApplications(prev => [created, ...prev])
    return created
  }, [])

  const updateApplication = useCallback(async (id, updates) => {
    const res = await fetch(`${API}/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (!res.ok) throw new Error(`Failed to update: ${res.status}`)
    const updated = await res.json()
    setApplications(prev => prev.map(a => a.id === id ? updated : a))
    return updated
  }, [])

  const deleteApplication = useCallback(async (id) => {
    const res = await fetch(`${API}/applications/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`Failed to delete: ${res.status}`)
    setApplications(prev => prev.filter(a => a.id !== id))
  }, [])

  const importCsv = useCallback(async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch(`${API}/import-csv`, {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) throw new Error(`Failed to import: ${res.status}`)
    const imported = await res.json()
    await fetchApplications()
    return imported
  }, [fetchApplications])

  const toggleSort = useCallback((column) => {
    setSortBy(prev => {
      if (prev === column) {
        setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        return column
      }
      setSortDir('asc')
      return column
    })
  }, [])

  return {
    applications,
    loading,
    error,
    sortBy,
    sortDir,
    filterStage,
    filterContacted,
    setFilterStage,
    setFilterContacted,
    toggleSort,
    createApplication,
    updateApplication,
    deleteApplication,
    importCsv,
    refresh: fetchApplications,
  }
}
