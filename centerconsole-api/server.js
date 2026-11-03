import express from 'express'

const app = express()

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' })
})

app.listen(3001, () => {
    console.log('API running on http://localhost:3001')
})