const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const { Session } = require('../models')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7)
    try {
      const decoded = jwt.verify(token, SECRET)

      const session = await Session.findOne({ where: { token, userId: decoded.id } })
      if (!session) {
        return res.status(401).json({ error: 'session expired, please login again' })
      }

      req.decodedToken = decoded
      req.token = token
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }

  next()
}

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: error.errors.map((e) => e.message),
    })
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: error.errors.map((e) => e.message),
    })
  }

  if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).json({ error: error.message })
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  }

  next(error)
}

module.exports = { tokenExtractor, errorHandler }
