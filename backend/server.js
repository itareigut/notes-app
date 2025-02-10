require("dotenv").config()

const express = require("express")
const cors = require("cors")
const { Pool } = require('pg')

const app = express()

app.use(express.json())
app.use(cors())

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

// Create table if it doesn't exist
pool.query(`
    CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL
    )
`)

app.get("/notes", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM notes")
        res.json(result.rows)
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
})

app.post("/notes", async (req, res) => {
    
    const { text } = req.body
    if (!text) {
        return res.status(400).json({ error: "Note text is required" })
    }

    try {
        await pool.query("INSERT INTO notes (text) VALUES ($1)", [text])
        res.status(201).json({ message: "Note added" })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.delete("/notes/:id", async (req, res) => {

    const id = parseInt(req.params.id)

    try {
        const result = await pool.query("DELETE FROM notes WHERE id = $1", [id])
        if (result.rowCount > 0) {
            res.json({ message: "Note deleted" })
        } else {
            res.status(404).json({ error: "Note not found"})
        }
    } catch (err) {
        res.status(500).json({ error: err.message })
    }

})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))