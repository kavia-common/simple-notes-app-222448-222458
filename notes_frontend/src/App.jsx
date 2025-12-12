import React, { useEffect, useMemo, useState } from 'react'
import NotesList from './components/NotesList.jsx'
import NoteEditor from './components/NoteEditor.jsx'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

async function apiGet(path) {
  const res = await fetch(`${BACKEND_URL}${path}`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
async function apiSend(path, method, body) {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed: ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export default function App() {
  const [notes, setNotes] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  const selected = useMemo(() => notes.find(n => n.id === selectedId) || null, [notes, selectedId])

  async function loadNotes() {
    setLoading(true)
    setStatus(null)
    try {
      const data = await apiGet('/notes')
      setNotes(data)
      if (data.length && !selectedId) setSelectedId(data[0].id)
    } catch (e) {
      setStatus({ type: 'error', message: `Failed to load notes: ${e.message}` })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotes()
  }, [])

  async function handleCreate() {
    setStatus(null)
    try {
      const created = await apiSend('/notes', 'POST', { title: 'Untitled', content: '' })
      setNotes(prev => [...prev, created])
      setSelectedId(created.id)
      setStatus({ type: 'success', message: 'Note created' })
    } catch (e) {
      setStatus({ type: 'error', message: `Create failed: ${e.message}` })
    }
  }

  async function handleUpdate(update) {
    if (!selected) return
    setStatus(null)
    try {
      const updated = await apiSend(`/notes/${selected.id}`, 'PUT', update)
      setNotes(prev => prev.map(n => (n.id === updated.id ? updated : n)))
      setStatus({ type: 'success', message: 'Saved' })
    } catch (e) {
      setStatus({ type: 'error', message: `Save failed: ${e.message}` })
    }
  }

  async function handleDelete(id) {
    setStatus(null)
    try {
      await apiSend(`/notes/${id}`, 'DELETE')
      setNotes(prev => prev.filter(n => n.id !== id))
      if (selectedId === id) {
        setSelectedId(notes.length ? notes[0]?.id ?? null : null)
      }
      setStatus({ type: 'success', message: 'Deleted' })
    } catch (e) {
      setStatus({ type: 'error', message: `Delete failed: ${e.message}` })
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', height: '100vh' }}>
      <aside style={{ background: '#ffffff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ margin: 0, fontSize: 18, color: '#111827' }}>Notes</h1>
          <button onClick={handleCreate} style={{ background: '#3b82f6', color: '#fff', border: 0, borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}>
            + New
          </button>
        </div>
        <div style={{ overflow: 'auto', flex: 1 }}>
          {loading ? (
            <div style={{ padding: 16, color: '#64748b' }}>Loading...</div>
          ) : (
            <NotesList
              notes={notes}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onDelete={handleDelete}
            />
          )}
        </div>
      </aside>
      <main style={{ padding: 16 }}>
        {status && (
          <div
            role="status"
            style={{
              marginBottom: 12,
              padding: '8px 12px',
              borderRadius: 6,
              color: status.type === 'error' ? '#EF4444' : '#065f46',
              background: status.type === 'error' ? '#fee2e2' : '#d1fae5',
              border: `1px solid ${status.type === 'error' ? '#fecaca' : '#a7f3d0'}`
            }}
          >
            {status.message}
          </div>
        )}
        {selected ? (
          <NoteEditor
            note={selected}
            onChangeTitle={(t) => handleUpdate({ title: t })}
            onChangeContent={(c) => handleUpdate({ content: c })}
          />
        ) : (
          <div style={{ color: '#64748b' }}>Select a note or create a new one.</div>
        )}
      </main>
    </div>
  )
}
