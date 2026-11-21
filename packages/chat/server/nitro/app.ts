import process from 'node:process'
import { createChatServer, createWsHooks, JsonFileStorage } from '../index'

const dataDir = process.env.CHAT_DATA_DIR
const { app, bus } = createChatServer(dataDir ? { storage: new JsonFileStorage(dataDir) } : {})

export const chatApp = app
export const wsHooks = createWsHooks(bus)
