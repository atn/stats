require('dotenv').config()
import express from 'express'
import cors from 'cors'

import Mesa, { Message } from '@cryb/mesa'

import redis, { getOptions } from './redis'
import { fetchCount, increment } from './utils'

import newRouter from './routes/new'

const app = express()

export const mesa = new Mesa({
  port: 3000,
  redis: getOptions()
})

app.use(cors())
app.use('/new', newRouter)

mesa.on('connection', client => {
  console.log('Client connected')

  setInterval(() => {
    mesa.send(new Message(0, {}, 'HEARTBEAT'))
  }, 30 * 1000)
  
  client.on('message', message => {
    const { data, type } = message
    console.log('Recieved', data, type)
  })

  client.on('disconnect', (code, reason) => {
    console.log('Client disconnected')
  })
})

app.get('/', async (req, res) => {
  increment('api_requests')

  let commands = await fetchCount('commands')
  const api_requests = await fetchCount('api_requests')

  res.json({ commands, api_requests })
})

app.use((req, res, next) => {
  res.send('404')
})

app.listen(process.env.PORT || 80, () => {
  console.log(`Stats API Up`)
})

export default app