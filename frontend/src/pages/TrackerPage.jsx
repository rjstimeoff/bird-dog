import { useState, useRef } from 'react'
import { useTracker } from '../hooks/useTracker'

const STAGES = ['', 'Applied', 'Interviewing', 'Not Continuing']
const CONTACTED_OPTIONS = ['', 'Yes', 'Not yet', 'Sent invitation']

const STAGE_ROW_COLORS = {
  'Applied': '#f0fdf4',
  'Not Continuing': '#fef2f2',
  'Interviewing': '#f5f3ff',
}

const CONTACTED_BADGE = {
  'Yes': { bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },
  'Not yet': { bg: '#fee2e2', color: '#991b1b', border: '#fecaca' },
  'Sent invitation': { bg: '#fef9c3', color: '#854d0e', border: '#fde68a' },
}

const COLUMNS = [
  { key: 'company', label: 'Company', width: '15%' },
  { key: 'role', label: 'Role', width: '20%' },
  { key: 'stage', label: 'Stage', width: '13%' },
  { key: 'contacted', label: 'Contacted Employees?', width: '14%' },
  { key: 'date_applied', label: 'Date Applied', width: '12%' },
  { key: 'notes', label: 'Notes', width: '20%' },
]

function TrackerPage() {
  const {
    applications, loading, error,
    sortBy, sortDir, filterStage, filterContacted,
    setFilterStage, setFilterContacted, toggleSort,
    createApplication, updateApplication, deleteApplication, importCsv,
  } = useTracker()

  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [addingNew, setAddingNew] = useState(false)
  const [newRow, setNewRow] = useState({ company: '', role: '', stage: '', contacted: '', date_applied: '', notes: '' })
  const [importError, setImportError] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const fileInputRef = useRef(null)

  const startEdit = (app) => {
    setEditingId(app.id)
    setEditData({ company: app.company, role: app.role, stage: app.stage, contacted: app.contacted, date_applied: app.date_applied, notes: app.notes })
  }

  const saveEdit = async () => {
    if (editingId === null) return
    try {
      const original = applications.find(a => a.id === editingId)
      const changes = {}
      for (const key of Object.keys(editData)) {
        if (editData[key] !== original[key]) changes[key] = editData[key]
      }
      if (Object.keys(changes).length > 0) {
        await updateApplication(editingId, changes)
      }
      setEditingId(null)
      setEditData({})
    } catch { /* error handled by hook */ }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditData({})
  }

  const saveNew = async () => {
    try {
      await createApplication(newRow)
      setAddingNew(false)
      setNewRow({ company: '', role: '', stage: '', contacted: '', date_applied: '', notes: '' })
    } catch { /* error handled by hook */ }
  }

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImportError(null)
    try {
      const result = await importCsv(file)
      setImportError(null)
      alert(`Imported ${result.length} applications`)
    } catch (err) {
      setImportError(err.message)
    }
    e.target.value = ''
  }

  const handleDelete = async (id) => {
    try {
      await deleteApplication(id)
      setDeleteConfirm(null)
    } catch { /* error handled by hook */ }
  }

  const renderCell = (key, value, onChange, isEditing) => {
    if (!isEditing) {
      if (key === 'contacted' && value && CONTACTED_BADGE[value]) {
        const badge = CONTACTED_BADGE[value]
        return (
          <span style={{
            display: 'inline-block',
            padding: '0.15rem 0.5rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 500,
            background: badge.bg,
            color: badge.color,
            border: `1px solid ${badge.border}`,
          }}>
            {value}
          </span>
        )
      }
      return <span style={{ fontSize: '0.85rem' }}>{value}</span>
    }

    if (key === 'stage') {
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={selectStyle}
        >
          {STAGES.map(s => <option key={s} value={s}>{s || '—'}</option>)}
        </select>
      )
    }

    if (key === 'contacted') {
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={selectStyle}
        >
          {CONTACTED_OPTIONS.map(s => <option key={s} value={s}>{s || '—'}</option>)}
        </select>
      )
    }

    if (key === 'date_applied') {
      return (
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
      )
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    )
  }

  const sortArrow = (col) => {
    if (sortBy !== col) return ''
    return sortDir === 'asc' ? ' \u25B2' : ' \u25BC'
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select
            value={filterStage || ''}
            onChange={(e) => setFilterStage(e.target.value || null)}
            style={filterSelectStyle}
          >
            <option value="">All Stages</option>
            {STAGES.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={filterContacted || ''}
            onChange={(e) => setFilterContacted(e.target.value || null)}
            style={filterSelectStyle}
          >
            <option value="">All Contacted</option>
            {CONTACTED_OPTIONS.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
            {applications.length} application{applications.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => { setAddingNew(true); setEditingId(null) }} style={btnStyle}>
            + Add
          </button>
          <button onClick={() => fileInputRef.current?.click()} style={btnStyle}>
            Import CSV
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {importError && (
        <div style={{ marginBottom: '0.75rem', padding: '0.5rem 0.75rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#991b1b', fontSize: '0.85rem' }}>
          Import error: {importError}
        </div>
      )}

      {error && (
        <div style={{ marginBottom: '0.75rem', padding: '0.5rem 0.75rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#991b1b', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  style={{
                    padding: '0.6rem 0.75rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    color: '#475569',
                    cursor: 'pointer',
                    userSelect: 'none',
                    width: col.width,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.label}{sortArrow(col.key)}
                </th>
              ))}
              <th style={{ padding: '0.6rem 0.75rem', width: '6%', textAlign: 'center', fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {/* New row */}
            {addingNew && (
              <tr style={{ background: '#fffbeb', borderBottom: '1px solid #e2e8f0' }}>
                {COLUMNS.map(col => (
                  <td key={col.key} style={{ padding: '0.4rem 0.75rem' }}>
                    {renderCell(col.key, newRow[col.key], (val) => setNewRow(prev => ({ ...prev, [col.key]: val })), true)}
                  </td>
                ))}
                <td style={{ padding: '0.4rem 0.75rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  <button onClick={saveNew} style={actionBtnStyle} title="Save">Save</button>
                  <button onClick={() => { setAddingNew(false); setNewRow({ company: '', role: '', stage: '', contacted: '', date_applied: '', notes: '' }) }} style={{ ...actionBtnStyle, color: '#991b1b' }} title="Cancel">Cancel</button>
                </td>
              </tr>
            )}

            {loading && (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  Loading...
                </td>
              </tr>
            )}

            {!loading && applications.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                  No applications yet. Click "+ Add" or "Import CSV" to get started.
                </td>
              </tr>
            )}

            {!loading && applications.map(app => {
              const isEditing = editingId === app.id
              const rowBg = STAGE_ROW_COLORS[app.stage] || 'transparent'

              return (
                <tr
                  key={app.id}
                  style={{
                    background: isEditing ? '#fffbeb' : rowBg,
                    borderBottom: '1px solid #e2e8f0',
                    transition: 'background 0.15s',
                  }}
                  onDoubleClick={() => !isEditing && startEdit(app)}
                >
                  {COLUMNS.map(col => (
                    <td key={col.key} style={{ padding: '0.5rem 0.75rem' }}>
                      {isEditing
                        ? renderCell(col.key, editData[col.key], (val) => setEditData(prev => ({ ...prev, [col.key]: val })), true)
                        : renderCell(col.key, app[col.key], null, false)
                      }
                    </td>
                  ))}
                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {isEditing ? (
                      <>
                        <button onClick={saveEdit} style={actionBtnStyle} title="Save">Save</button>
                        <button onClick={cancelEdit} style={{ ...actionBtnStyle, color: '#991b1b' }} title="Cancel">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(app)} style={actionBtnStyle} title="Edit">Edit</button>
                        {deleteConfirm === app.id ? (
                          <>
                            <button onClick={() => handleDelete(app.id)} style={{ ...actionBtnStyle, color: '#991b1b', fontWeight: 600 }}>Yes</button>
                            <button onClick={() => setDeleteConfirm(null)} style={actionBtnStyle}>No</button>
                          </>
                        ) : (
                          <button onClick={() => setDeleteConfirm(app.id)} style={{ ...actionBtnStyle, color: '#991b1b' }} title="Delete">Del</button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '0.3rem 0.4rem',
  fontSize: '0.85rem',
  border: '1px solid #cbd5e1',
  borderRadius: '4px',
  background: '#fff',
  boxSizing: 'border-box',
}

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
}

const filterSelectStyle = {
  padding: '0.35rem 0.5rem',
  fontSize: '0.85rem',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  background: '#fff',
  cursor: 'pointer',
}

const btnStyle = {
  padding: '0.4rem 0.8rem',
  fontSize: '0.85rem',
  cursor: 'pointer',
  background: '#f1f5f9',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontWeight: 500,
}

const actionBtnStyle = {
  padding: '0.2rem 0.4rem',
  fontSize: '0.75rem',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  color: '#2563eb',
  fontWeight: 500,
}

export default TrackerPage
