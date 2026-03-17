const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  const style = {
    color: message.type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    borderColor: message.type === 'error' ? 'red' : 'green',
  }

  return (
    <div className="notification" style={style}>
      {message.text}
    </div>
  )
}

export default Notification
