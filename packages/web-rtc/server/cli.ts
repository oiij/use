#!/usr/bin/env node
import process from 'node:process'
import { toNodeHandler } from 'h3/node'
import { listen } from 'listhen'
import { createRtcServer, createWsHooks } from './index'

const port = Number(process.env.RTC_PORT ?? process.env.PORT ?? 4100)
const hostname = process.env.RTC_HOST ?? '0.0.0.0'
const path = process.env.RTC_PATH ?? '/ws'

const { app, hub } = createRtcServer({ path })

const listener = await listen(toNodeHandler(app), {
  port,
  hostname,
  ws: { hooks: createWsHooks(hub) },
  showURL: false,
})

console.log(`[@oiij/web-rtc] signaling server listening on ${listener.url} (ws path: ${path})`)
