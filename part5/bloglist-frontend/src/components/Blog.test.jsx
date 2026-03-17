import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'https://testing.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User',
      id: '12345',
    },
  }

  const mockUser = {
    username: 'testuser',
    name: 'Test User',
    id: '12345',
  }

  test('renders title and author but not url or likes by default', () => {
    const { container } = render(
      <Blog blog={blog} user={mockUser} updateBlog={() => {}} removeBlog={() => {}} />
    )

    const titleAuthor = container.querySelector('.blog-title-author')
    expect(titleAuthor).toHaveTextContent('Component testing is done with react-testing-library')
    expect(titleAuthor).toHaveTextContent('Test Author')

    const details = container.querySelector('.blog-details')
    expect(details).toBeNull()
  })

  test('url and likes are shown when view button is clicked', async () => {
    const { container } = render(
      <Blog blog={blog} user={mockUser} updateBlog={() => {}} removeBlog={() => {}} />
    )

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const details = container.querySelector('.blog-details')
    expect(details).not.toBeNull()

    expect(container.querySelector('.blog-url')).toHaveTextContent('https://testing.com')
    expect(container.querySelector('.blog-likes')).toHaveTextContent('likes 5')
  })

  test('clicking like button twice calls event handler twice', async () => {
    const mockHandler = vi.fn()

    render(
      <Blog blog={blog} user={mockUser} updateBlog={mockHandler} removeBlog={() => {}} />
    )

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
