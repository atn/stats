require('dotenv').config()

import express from 'express'
import monk from 'monk'
import cors from 'cors'
import Mesa, { Message } from '@cryb/mesa'

const db = monk(process.env.MONGO_URI as string)
const stats = db.get('stats')

import { authenticated } from './mw' 

const app = express()
const mesa = new Mesa({ port: 3000, heartbeat: { enabled: true } })

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

app.get('/', async (req, res) => {
  const data = await stats.findOne({ id: 1 })
  res.json({
    commands: data.commands
  })
})

app.post('/new/command', authenticated, async (req, res) => {
  try {
    const data = await stats.findOne({ id: 1 })
    const cmds = ++data.commands
    mesa.send(new Message(0, { commands: cmds }))
    stats.findOneAndUpdate({ id: 1 }, { $set: { commands: cmds }})
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