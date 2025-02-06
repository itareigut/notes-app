//import logo from './logo.svg'
import './App.css'

import React, {useEffect, useState} from 'react'

function App() {

 // State to hold notes and the new note input
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("")

  useEffect(() => {
    fetch("http://localhost:5000/notes")
    .then((response) => response.json())
    .then((data) => setNotes(data))
  }, [])

  // Handle input change
  const handleChange = (e) => {
    setNewNote(e.target.value)
  }

  const handleAddNote = () => {
    if (newNote.trim()){
      addNoteToBackend(newNote)
    }
  }

  const fetchNotes = () => {
    fetch("http://localhost:5000/notes")
      .then((response) => response.json())
      .then((data) => setNotes(data))
  }

  const addNoteToBackend = (noteText) => {
    fetch("http://localhost:5000/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify({ text: noteText }),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        fetchNotes()
        setNewNote("")
      }
    })
  }

  const handleDeleteNote = (index) => {
    deleteNoteFromBackend(index)
  }

  const deleteNoteFromBackend = (index) => {
    fetch(`http://localhost:5000/notes/${index}`, {
      method: "DELETE",
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        setNotes((prevNotes) =>
          prevNotes.filter((note, i) => i !== index)
        )
      }
    })
  }

  return (
    <div className="App">
      <h1>Notes App</h1>

      {/* Input field for new note */}
      <input type="text" value={newNote} onChange={handleChange} placeholder="Enter a new note"/>
      <button onClick={handleAddNote}>Add Note</button>

      {/* Display notes list */}
      <ul>
        {notes.map((note, index) => (
          <li key={index}>
            {note}
            <button onClick={() => handleDeleteNote(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )

}

export default App
