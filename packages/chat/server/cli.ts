#!/usr/bin/env node
import process from 'node:process'
import { toNodeListener } from 'h3'
import { listen } from 'listhen'
import { JsonFileStorage } from './core/storage/json-file'
import { createChatServer } from './http/app'
import { createWsHooks } from './http/ws'

const port = Number(process.env.CHAT_PORT ?? process.env.PORT ?? 3000)
const hostname = process.env.CHAT_HOST ?? '0.0.0.0'
const dataDir = process.env.CHAT_DATA_DIR

const { app, bus } = createChatServer({
  storage: dataDir ? new JsonFileStorage(dataDir) : undefined,
})

const listener = await listen(toNodeListener(app), { port, hostname, ws: { hooks: createWsHooks(bus) }, showURL: false })

const info = `[@oiij/chat] server listening on ${listener.url}`
console.log(dataDir ? `${info} (data dir: ${dataDir})` : info)
