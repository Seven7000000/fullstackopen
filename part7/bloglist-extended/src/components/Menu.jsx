import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { logoutUser } from '../reducers/loginReducer'

const Menu = () => {
  const user = useSelector((state) => state.login)
  const dispatch = useDispatch()

  const padding = { paddingRight: 5 }
  const navStyle = {
    background: '#eee',
    padding: 10,
    marginBottom: 10,
  }

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <div style={navStyle}>
      <Link to="/" style={padding}>blogs</Link>
      <Link to="/users" style={padding}>users</Link>
      {user && (
        <span>
          {user.name} logged in{' '}
          <button onClick={handleLogout}>logout</button>
        </span>
      )}
    </div>
  )
}

export default Menu
