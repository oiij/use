import { defineWebSocketHandler } from 'h3'
import { wsHooks } from '../app'

export default defineWebSocketHandler(wsHooks)
