import express from 'express'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })

const app = express()
app.use(express.json())

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' })
})

app.get('/api/cars', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cars ORDER BY id')
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Database error' })
    }
})

app.post('/api/cars', async (req, res) => {
    try {
        const { name, make, model, year, plate, color, distance_unit, volume_unit, currency, start_odometer_mi } = req.body
        const result = await pool.query(
            `INSERT INTO cars (name, make, model, year, plate, color, distance_unit, volume_unit, currency, start_odometer_mi)
             VALUES ($1, $2, $3, $4, $5, COALESCE($6, '#2563eb'), COALESCE($7, 'mi'),
                     COALESCE($8, 'gal'), COALESCE($9, 'USD'), COALESCE($10, 0))
             RETURNING *`,
            [name, make, model, year, plate, color, distance_unit, volume_unit, currency, start_odometer_mi]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Database error' })
    }
})

app.put('/api/cars/:id', async (req, res) => {
    try {
        const { name, make, model, year, plate, color, distance_unit, volume_unit, currency, start_odometer_mi } = req.body
        const result = await pool.query(
            `UPDATE cars
             SET name = $1, make = $2, model = $3, year = $4, plate = $5,
                 color = COALESCE($6, '#2563eb'),
                 distance_unit = COALESCE($7, 'mi'),
                 volume_unit = COALESCE($8, 'gal'),
                 currency = COALESCE($9, 'USD'),
                 start_odometer_mi = COALESCE($10, 0)
             WHERE id = $11
             RETURNING *`,
            [name, make, model, year, plate, color, distance_unit, volume_unit, currency, start_odometer_mi, req.params.id]
        )
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Car not found' })
        }
        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Database error' })
    }
})

app.get('/api/cars/:id/logs', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM logs WHERE car_id = $1 ORDER BY logged_on DESC, id DESC',
            [req.params.id]
        )
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Database error' })
    }
})

app.post('/api/cars/:id/logs', async (req, res) => {
    try {
        const { type, logged_on, odometer_mi, volume_gal, oil_added_gal, cost_usd, notes } = req.body
        const result = await pool.query(
            `INSERT INTO logs (car_id, type, logged_on, odometer_mi, volume_gal, oil_added_gal, cost_usd, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [req.params.id, type, logged_on, odometer_mi, volume_gal, oil_added_gal, cost_usd, notes]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Database error' })
    }
})

app.delete('/api/logs/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM logs WHERE id = $1',
            [req.params.id]
        )
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Log not found' })
        }
        res.status(204).end()
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Database error' })
    }
})

app.put('/api/logs/:id', async (req, res) => {
    try {
        const { type, logged_on, odometer_mi, volume_gal, oil_added_gal, cost_usd, notes } = req.body
        const result = await pool.query(
            `UPDATE logs
             SET type = $1, logged_on = $2, odometer_mi = $3, volume_gal = $4,
                 oil_added_gal = $5, cost_usd = $6, notes = $7
             WHERE id = $8
             RETURNING *`,
            [type, logged_on, odometer_mi, volume_gal, oil_added_gal, cost_usd, notes, req.params.id]
        )
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Log not found' })
        }
        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Database error' })
    }
})

app.delete('/api/cars/:id', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM cars WHERE id = $1', [req.params.id])
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Car not found' })
        }
        res.status(204).end()
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Database error' })
    }
})

app.listen(3001, () => {
    console.log('API running on http://localhost:3001')
})