const router = require('express').Router()
const { User, Blog, ReadingList } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  })

  res.json(users)
})

router.get('/:id', async (req, res) => {
  const where = {}

  if (req.query.read !== undefined) {
    where.read = req.query.read === 'true'
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: [''] },
    include: [
      {
        model: Blog,
        attributes: { exclude: ['userId'] },
      },
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId'] },
        through: {
          attributes: ['id', 'read'],
          where,
        },
      },
    ],
  })

  if (!user) {
    return res.status(404).json({ error: 'user not found' })
  }

  res.json(user)
})

router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  res.status(201).json(user)
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } })

  if (!user) {
    return res.status(404).json({ error: 'user not found' })
  }

  if (req.body.username) {
    user.username = req.body.username
  }

  await user.save()
  res.json(user)
})

module.exports = router
