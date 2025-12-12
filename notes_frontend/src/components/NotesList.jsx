import React from 'react'

export default function NotesList({ notes, selectedId, onSelect, onDelete }) {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {notes.map(n => (
        <li key={n.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
          <button
            onClick={() => onSelect(n.id)}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '10px 12px',
              border: 'none',
              background: selectedId === n.id ? '#eff6ff' : '#fff',
              color: '#111827',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{n.title || 'Untitled'}</div>
                <div style={{ color: '#64748b', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {(n.content || '').split('\n')[0]}
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(n.id) }}
                style={{ background: '#fff', color: '#EF4444', border: '1px solid #fecaca', padding: '4px 8px', borderRadius: 6, cursor: 'pointer' }}
                aria-label={`Delete ${n.title || 'untitled'}`}
              >
                Delete
              </button>
            </div>
          </button>
        </li>
      ))}
      {notes.length === 0 && (
        <li style={{ padding: 12, color: '#64748b' }}>No notes yet.</li>
      )}
    </ul>
  )
}
