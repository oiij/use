#!/usr/bin/env node
import process from 'node:process'
import { toNodeHandler } from 'h3/node'
import { listen } from 'listhen'
import { JsonFileStorage } from './core/storage/json-file'
import { createChatServer } from './http/app'
import { createWsHooks } from './http/ws'

const port = Number(process.env.CHAT_PORT ?? process.env.PORT ?? 3000)
const hostname = process.env.CHAT_HOST ?? '0.0.0.0'
const dataDir = process.env.CHAT_DATA_DIR

const { app, bus } = createChatServer({
  storage: dataDir ? new JsonFileStorage(dataDir) : undefined,
  getUserProfile: (id) => {
    return {
      id,
      avatar: `https://picsum.photos/200/200?random=${id}`,
    }
  },
})

const listener = await listen(toNodeHandler(app), { port, hostname, ws: { hooks: createWsHooks(bus) }, showURL: false })

const info = `[@oiij/chat] server listening on ${listener.url}`
console.log(dataDir ? `${info} (data dir: ${dataDir})` : info)
