const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { User, Session } = require('../models')
const { SECRET } = require('../util/config')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ where: { username } })

  if (!user) {
    return res.status(401).json({ error: 'invalid username or password' })
  }

  if (user.disabled) {
    return res.status(403).json({ error: 'account disabled' })
  }

  // In a real app, password would be hashed and compared with bcrypt.
  // For FSO exercises, simple password check is used.
  if (password !== 'secret') {
    return res.status(401).json({ error: 'invalid username or password' })
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    SECRET
  )

  await Session.create({ userId: user.id, token })

  res.json({ token, username: user.username, name: user.name })
})

router.delete('/', tokenExtractor, async (req, res) => {
  await Session.destroy({ where: { token: req.token } })
  res.status(204).end()
})

module.exports = router
