import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { likeBlog, removeBlog, addComment } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const Blog = () => {
  const [comment, setComment] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const id = useParams().id
  const blog = useSelector((state) => state.blogs.find((b) => b.id === id))
  const user = useSelector((state) => state.login)

  if (!blog) {
    return <div>Blog not found</div>
  }

  const handleLike = () => {
    dispatch(likeBlog(blog))
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(removeBlog(blog.id))
      dispatch(
        setNotification(
          { message: `Removed ${blog.title}`, type: 'success' },
          5
        )
      )
      navigate('/')
    }
  }

  const handleComment = (event) => {
    event.preventDefault()
    dispatch(addComment(blog.id, comment))
    setComment('')
  }

  const showRemove =
    user && blog.user && (blog.user.username === user.username || blog.user === user.id)

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        {blog.likes} likes <button onClick={handleLike}>like</button>
      </div>
      <div>added by {blog.user?.name || blog.user?.username || 'unknown'}</div>
      {showRemove && <button onClick={handleRemove}>remove</button>}

      <h3>comments</h3>
      <form onSubmit={handleComment}>
        <input
          type="text"
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments &&
          blog.comments.map((c, index) => <li key={index}>{c}</li>)}
      </ul>
    </div>
  )
}

export default Blog
