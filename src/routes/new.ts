import express from 'express'

import { Message } from '@cryb/mesa'
import { authenticated } from '../mw' 
import { mesa } from '../index'
import { increment } from '../utils'

const router = express.Router()


router.post('/command', authenticated, async (req, res) => {
  try {
    const commands = await increment('commands')
    mesa.send(new Message(0, { commands }, 'STATS_UPDATE'))

    res.sendStatus(200)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.post('/build', authenticated, async (req, res) => {
  try {
    const builds = await increment('builds')
    mesa.send(new Message(0, { builds }, 'BUILDS_UPDATE'))

    res.sendStatus(200)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.post('/global', authenticated, async (req, res) => {
  try {
    const { content } = req.body
    mesa.send(new Message(0, { content }, 'GLOBAL_MSG'))
  } catch (err) {
    res.status(400).send(err)
  }
})

export default router