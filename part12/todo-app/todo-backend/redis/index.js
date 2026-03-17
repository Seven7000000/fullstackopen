const { createClient } = require('redis')
const { REDIS_URL } = require('../util/config')

let client

const getClient = async () => {
  if (!client) {
    client = createClient({ url: REDIS_URL })
    client.on('error', (err) => console.log('Redis Client Error', err))
    await client.connect()
  }
  return client
}

const getAsync = async (key) => {
  const c = await getClient()
  return c.get(key)
}

const setAsync = async (key, value) => {
  const c = await getClient()
  return c.set(key, value)
}

module.exports = {
  getAsync,
  setAsync,
}
