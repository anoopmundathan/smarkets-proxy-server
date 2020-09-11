const express = require('express')
const fetch = require('node-fetch')

const app = express()

const API_URL = 'https://api.smarkets.com/v3'
const PORT = process.env.PORT || 8000

const removeQuote = (text) => text.split("'").join('')

app.get('/', (req, res) => {
  res.json('')
})

app.get('/api/event-types', (req, res) => {
  fetch(`${API_URL}/events/?state=upcoming&type=event_type`)
    .then((res) => res.json())
    .then((data) => {
      res
        .status(200)
        .json(
          data.data
            .split(',')
            .map((item, index) =>
              index === 0
                ? removeQuote(item.substr(30).trim())
                : removeQuote(item.trim())
            )
        )
    })
    .catch(() => res.status(500).send('Something went wrong'))
})

app.get('/api/events', (req, res) => {
  fetch(`${API_URL}/events`)
    .then((res) => res.json())
    .then((data) => res.json(data))
    .catch(() => res.status(500).send('Something went wrong'))
})

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`)
})
