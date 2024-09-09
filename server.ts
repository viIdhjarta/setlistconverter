import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import axios from 'axios'

const app = new Hono()

app.get('/api/setlist/:id', async (c) => {
    const id = c.req.param('id')
    const url = `https://api.setlist.fm/rest/1.0/setlist/${id}`
    const headers = {
        "x-api-key": "rvH9s-nOQE4FOGgLByWj1VfmjzqIaEt5Q8wB",
        "Accept": "application/json"
    }

    try {
        const response = await axios.get(url, { headers })
        return c.json(response.data)
    } catch (error) {
        console.error('Error fetching setlist:', error)
        return c.json({ error: 'Failed to fetch setlist' }, 500)
    }
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
    fetch: app.fetch,
    port
})