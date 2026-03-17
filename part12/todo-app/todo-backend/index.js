const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const { MONGO_URL, PORT } = require('./util/config')
const todoRouter = require('./routes')

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message)
  })

app.get('/', (req, res) => {
  res.send('Todo App Backend')
})

app.get('/health', (req, res) => {
  res.send('ok')
})

app.use('/todos', todoRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
