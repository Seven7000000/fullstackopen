import { useField, useResource } from './hooks'

const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
    content.reset()
  }

  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value })
    name.reset()
    number.reset()
  }

  const spreadField = (field) => {
    const { reset, ...rest } = field
    return rest
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...spreadField(content)} />
        <button>create</button>
      </form>
      {notes.map((n) => (
        <p key={n.id}>{n.content}</p>
      ))}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...spreadField(name)} /> <br />
        number <input {...spreadField(number)} />
        <button>create</button>
      </form>
      {persons.map((p) => (
        <p key={p.id}>
          {p.name} {p.number}
        </p>
      ))}
    </div>
  )
}

export default App
