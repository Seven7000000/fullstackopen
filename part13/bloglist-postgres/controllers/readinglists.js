const router = require('express').Router()
const { ReadingList } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res) => {
  const readingListEntry = await ReadingList.create(req.body)
  res.status(201).json(readingListEntry)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const entry = await ReadingList.findByPk(req.params.id)

  if (!entry) {
    return res.status(404).json({ error: 'reading list entry not found' })
  }

  if (entry.userId !== req.decodedToken.id) {
    return res.status(403).json({ error: 'can only update own reading list entries' })
  }

  entry.read = req.body.read
  await entry.save()

  res.json(entry)
})

module.exports = router
