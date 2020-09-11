const express = require('express')
const fetch = require('node-fetch')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const app = express()

const API_URL = 'https://api.smarkets.com/v3'
const PORT = process.env.PORT || 8000

const removeQuote = (text) => text.split("'").join('')

app.use(cors())
app.use(morgan('combined'))
app.use(bodyParser.json())

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

app.get('/api/events/:eventType', (req, res) => {
  const { eventType } = req.params

  if (!eventType) {
    res.status(400).send('Event type is required')
  }

  fetch(`${API_URL}/events/?state=upcoming&type=${eventType}`)
    .then((res) => res.json())
    .then((data) => res.json(data))
    .catch(() => res.status(500).send('Something went wrong'))
})

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`)
})
