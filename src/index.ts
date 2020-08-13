require('dotenv').config()
import express from 'express'
import cors from 'cors'

import Mesa, { Message } from '@cryb/mesa'
import { authenticated } from './mw' 

import redis, { getOptions } from './redis'

const app = express()
const mesa = new Mesa({
  port: 3000,
  redis: getOptions()
})

app.use(cors())

mesa.on('connection', client => {
  console.log('Client connected')

  client.on('message', message => {
    const { data, type } = message
    console.log('Recieved', data, type)
  })

  client.on('disconnect', (code, reason) => {
    console.log('Client disconnected')
  })
})

async function fetchCount(key: string) {
  let data = await redis.hget('counts', key) as any
  if(data)
    data = parseInt(data)

  if(!data)
    data = 0

  return data
}

async function incrCount(key: string) {
  let data = redis.hincrby('counts', key, 1)

  return data
}

app.get('/', async (req, res) => {
  const commands = await fetchCount('commands')

  res.json({ commands })
})

app.post('/new/command', authenticated, async (req, res) => {
  try {
    const commands = await redis.hincrby('counts', 'commands', 1)
    mesa.send(new Message(0, { commands }, 'STATS_UPDATE'))

    res.sendStatus(200)
  } catch (err) {
    res.send(err).status(400)
  }
})

app.use((req, res, next) => {
  res.send('i think you\'re lost buddy, go somewhere else.')
})

app.listen(process.env.PORT || 80, () => {
  console.log(`Austin Stats API Up`)
})

export default app