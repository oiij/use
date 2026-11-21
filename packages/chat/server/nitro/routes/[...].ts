import type { EventHandler } from 'h3'
import { toEventHandler } from 'h3'
import { chatApp } from '../app'

export default toEventHandler(chatApp) as EventHandler
