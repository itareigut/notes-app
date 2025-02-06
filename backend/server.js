require("dotenv").config()

const express = require("express")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors())

const notes = []

app.get("/notes", (req, res) => {
    res.json(notes)
})

app.post("/notes", (req, res) => {
    const { text } = req.body

    if (text) {
        notes.push(text)
        res.status(201).json({ message: "Note added!" })
    } else {
        res.status(400).json({ error:"Note text is required" })
    }
})

app.delete("/notes/:index", (req, res) => {

    const index = parseInt(req.params.index)

    if(index >= 0 && index < notes.length) {
        notes.splice(index, 1)
        res.json({ message: "Note deleted"})
    } else {
        res.status(400).json({ error: "Invalid index" })
    }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))