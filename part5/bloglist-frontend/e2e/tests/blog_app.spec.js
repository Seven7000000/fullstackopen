const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('A blog created by playwright')
      await page.getByTestId('author').fill('Playwright Author')
      await page.getByTestId('url').fill('https://playwright.dev')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(
        page.getByText('A blog created by playwright Playwright Author')
      ).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByTestId('title').fill('Another blog by playwright')
        await page.getByTestId('author').fill('Playwright Author')
        await page.getByTestId('url').fill('https://playwright.dev')
        await page.getByRole('button', { name: 'create' }).click()
        await expect(
          page.getByText('Another blog by playwright Playwright Author')
        ).toBeVisible()
      })

      test('a blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('the user who created a blog can delete it', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()

        page.on('dialog', (dialog) => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()

        await expect(
          page.getByText('Another blog by playwright Playwright Author')
        ).not.toBeVisible()
      })

      test('only the creator can see the remove button', async ({
        page,
        request,
      }) => {
        // Create another user
        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'Other User',
            username: 'otheruser',
            password: 'salainen',
          },
        })

        // Logout
        await page.getByRole('button', { name: 'logout' }).click()

        // Login as other user
        await page.getByTestId('username').fill('otheruser')
        await page.getByTestId('password').fill('salainen')
        await page.getByRole('button', { name: 'login' }).click()
        await expect(page.getByText('Other User logged in')).toBeVisible()

        await page.getByRole('button', { name: 'view' }).click()
        await expect(
          page.getByRole('button', { name: 'remove' })
        ).not.toBeVisible()
      })
    })

    describe('and multiple blogs exist', () => {
      beforeEach(async ({ page }) => {
        // Create three blogs
        const blogs = [
          { title: 'Blog with least likes', author: 'Author A', url: 'https://a.com' },
          { title: 'Blog with most likes', author: 'Author B', url: 'https://b.com' },
          { title: 'Blog with second most likes', author: 'Author C', url: 'https://c.com' },
        ]

        for (const blog of blogs) {
          await page.getByRole('button', { name: 'new blog' }).click()
          await page.getByTestId('title').fill(blog.title)
          await page.getByTestId('author').fill(blog.author)
          await page.getByTestId('url').fill(blog.url)
          await page.getByRole('button', { name: 'create' }).click()
          await expect(page.getByText(`${blog.title} ${blog.author}`)).toBeVisible()
        }

        // Like blogs different amounts
        const blogElements = await page.locator('.blog').all()

        // Like 'Blog with most likes' 3 times
        await blogElements[1].getByRole('button', { name: 'view' }).click()
        for (let i = 0; i < 3; i++) {
          await blogElements[1].getByRole('button', { name: 'like' }).click()
          await page.waitForTimeout(300)
        }
        await blogElements[1].getByRole('button', { name: 'hide' }).click()

        // Like 'Blog with second most likes' 2 times
        await blogElements[2].getByRole('button', { name: 'view' }).click()
        for (let i = 0; i < 2; i++) {
          await blogElements[2].getByRole('button', { name: 'like' }).click()
          await page.waitForTimeout(300)
        }
        await blogElements[2].getByRole('button', { name: 'hide' }).click()
      })

      test('blogs are ordered by likes in descending order', async ({ page }) => {
        const blogElements = await page.locator('.blog').all()

        await blogElements[0].getByRole('button', { name: 'view' }).click()
        const firstLikes = await blogElements[0].locator('.blog-likes').textContent()

        await blogElements[1].getByRole('button', { name: 'view' }).click()
        const secondLikes = await blogElements[1].locator('.blog-likes').textContent()

        await blogElements[2].getByRole('button', { name: 'view' }).click()
        const thirdLikes = await blogElements[2].locator('.blog-likes').textContent()

        const extractLikes = (text) => parseInt(text.match(/likes (\d+)/)[1])

        expect(extractLikes(firstLikes)).toBeGreaterThanOrEqual(
          extractLikes(secondLikes)
        )
        expect(extractLikes(secondLikes)).toBeGreaterThanOrEqual(
          extractLikes(thirdLikes)
        )
      })
    })
  })
})
