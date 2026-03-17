const router = require('express').Router()
const { Op } = require('sequelize')
const { Blog, User } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { author: { [Op.iLike]: `%${req.query.search}%` } },
    ]
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
    order: [['likes', 'DESC']],
  })

  res.json(blogs)
})

router.get('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id, {
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
  })

  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  res.json(blog)
})

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)

  if (user.disabled) {
    return res.status(403).json({ error: 'account disabled' })
  }

  const blog = await Blog.create({
    ...req.body,
    userId: user.id,
  })

  res.status(201).json(blog)
})

router.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)

  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  if (req.body.likes !== undefined) {
    blog.likes = req.body.likes
  }

  await blog.save()
  res.json(blog)
})

router.delete('/:id', tokenExtractor, async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)

  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  if (blog.userId !== req.decodedToken.id) {
    return res.status(403).json({ error: 'only the creator can delete a blog' })
  }

  await blog.destroy()
  res.status(204).end()
})

module.exports = router
