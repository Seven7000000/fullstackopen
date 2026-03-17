const express = require('express')
const router = express.Router()
const Todo = require('../models/Todo')
const { getAsync, setAsync } = require('../redis')

router.get('/', async (req, res) => {
  const todos = await Todo.find({})
  res.json(todos)
})

router.post('/', async (req, res) => {
  const { text } = req.body
  if (!text) {
    return res.status(400).json({ error: 'text is required' })
  }

  const todo = new Todo({ text, done: false })
  const savedTodo = await todo.save()

  // Increment the added_todos counter in Redis
  const currentCount = await getAsync('added_todos')
  const newCount = currentCount ? parseInt(currentCount) + 1 : 1
  await setAsync('added_todos', newCount.toString())

  res.status(201).json(savedTodo)
})

router.get('/statistics', async (req, res) => {
  const count = await getAsync('added_todos')
  res.json({ added_todos: parseInt(count) || 0 })
})

router.get('/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id)
  if (!todo) {
    return res.status(404).json({ error: 'todo not found' })
  }
  res.json(todo)
})

router.put('/:id', async (req, res) => {
  const { text, done } = req.body
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    { text, done },
    { new: true, runValidators: true }
  )
  if (!todo) {
    return res.status(404).json({ error: 'todo not found' })
  }
  res.json(todo)
})

router.delete('/:id', async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id)
  if (!todo) {
    return res.status(404).json({ error: 'todo not found' })
  }
  res.status(204).end()
})

module.exports = router
