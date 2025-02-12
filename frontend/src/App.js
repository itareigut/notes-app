//import logo from './logo.svg'

import './App.css'
import React, {useEffect, useState} from 'react'

const apiUrl = process.env.REACT_APP_API_URL || "https://notes-app-ds1r.onrender.com"

function App() {

 // State to hold notes and the new note input
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("")

  useEffect(() => {
    fetch(`${apiUrl}/notes`)
    .then((response) => response.json())
    .then((data) => setNotes(data))
  }, [])

  const handleAddNote = () => {
    if (newNote.trim()) {
      fetch(`${apiUrl}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newNote }),
      })
      .then(() => {
        fetchNotes()
        setNewNote("")
      })
    }
  }

  const fetchNotes = () => {
    fetch(`${apiUrl}/notes`)
      .then((response) => response.json())
      .then((data) => setNotes(data))
  }

  const handleDeleteNote = (id) => {
    fetch(`${process.env.REACT_APP_API_URL}/notes/${id}`, {
      method: "DELETE",
    })
    .then(() => {
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id))
    })
  }

  return (
    <div className="App">
      <h1>Notes App</h1>
      <input type="text" value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Enter a new note"/>
      <button onClick={handleAddNote}>Add Note</button>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            {note.text}
            <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )

}

export default App