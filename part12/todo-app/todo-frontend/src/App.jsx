import { useState, useEffect } from 'react'

const BACKEND_URL = '/api'

const App = () => {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')

  useEffect(() => {
    fetch(`${BACKEND_URL}/todos`)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error('Failed to fetch todos:', err))
  }, [])

  const addTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    const response = await fetch(`${BACKEND_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newTodo }),
    })
    const savedTodo = await response.json()
    setTodos(todos.concat(savedTodo))
    setNewTodo('')
  }

  const toggleDone = async (todo) => {
    const response = await fetch(`${BACKEND_URL}/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...todo, done: !todo.done }),
    })
    const updatedTodo = await response.json()
    setTodos(todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)))
  }

  const deleteTodo = async (id) => {
    await fetch(`${BACKEND_URL}/todos/${id}`, { method: 'DELETE' })
    setTodos(todos.filter((t) => t.id !== id))
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Todos</h1>
      <form onSubmit={addTodo}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          style={{ padding: '0.5rem', width: '70%' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem', marginLeft: '0.5rem' }}>
          Add
        </button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem 0',
              borderBottom: '1px solid #eee',
            }}
          >
            <span
              onClick={() => toggleDone(todo)}
              style={{
                textDecoration: todo.done ? 'line-through' : 'none',
                cursor: 'pointer',
                color: todo.done ? '#999' : '#333',
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)} style={{ color: 'red', border: 'none', cursor: 'pointer' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
