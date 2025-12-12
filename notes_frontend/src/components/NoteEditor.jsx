import React, { useEffect, useState } from 'react'

export default function NoteEditor({ note, onChangeTitle, onChangeContent }) {
  const [title, setTitle] = useState(note.title || '')
  const [content, setContent] = useState(note.content || '')
  const [error, setError] = useState(null)

  useEffect(() => {
    setTitle(note.title || '')
    setContent(note.content || '')
    setError(null)
  }, [note.id])

  function handleTitleChange(e) {
    const t = e.target.value
    setTitle(t)
    if (t.trim() === '') {
      setError('Title is required')
      return
    }
    setError(null)
    onChangeTitle(t)
  }

  function handleContentChange(e) {
    const c = e.target.value
    setContent(c)
    onChangeContent(c)
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Title"
        style={{
          fontSize: 18,
          padding: '10px 12px',
          borderRadius: 8,
          border: '1px solid #e5e7eb',
          outline: error ? '2px solid #fecaca' : 'none',
          background: '#fff'
        }}
      />
      {error && <div style={{ color: '#EF4444', fontSize: 12 }}>{error}</div>}
      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder="Write your note..."
        rows={16}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: 8,
          border: '1px solid #e5e7eb',
          fontSize: 14,
          lineHeight: 1.5,
          background: '#fff',
          resize: 'vertical'
        }}
      />
      <div style={{ color: '#64748b', fontSize: 12 }}>
        Created: {new Date(note.created_at).toLocaleString()} | Updated: {new Date(note.updated_at).toLocaleString()}
      </div>
    </div>
  )
}
