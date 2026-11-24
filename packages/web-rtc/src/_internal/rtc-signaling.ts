import type { MaybeRefOrGetter } from 'vue'
import type { RtcSignaling, RtcSignalMessage } from '../types'
import { isRef, toValue, watch } from 'vue'

const SIGNAL_TYPES = new Set<string>([
  'register',
  'offer',
  'answer',
  'answer-ok',
  'ice-candidate',
  'bye',
  'error',
])

const RECONNECT_BASE_DELAY = 1_000
const RECONNECT_MAX_DELAY = 30_000

export function createWebSocketSignaling(
  url: MaybeRefOrGetter<string | URL>,
  options: { protocols?: string[], manual?: boolean, reconnect?: boolean } = {},
): RtcSignaling {
  const listeners = new Set<(message: RtcSignalMessage) => void>()
  const reconnect = options.reconnect ?? true
  let socket: WebSocket | undefined
  let reconnectTimer: ReturnType<typeof setTimeout> | undefined
  let attempts = 0
  let closed = false

  function handleMessage(event: MessageEvent) {
    let message: RtcSignalMessage
    try {
      message = JSON.parse(String(event.data)) as RtcSignalMessage
    }
    catch {
      return
    }
    const type = (message as { type?: string }).type
    if (!type || !SIGNAL_TYPES.has(type)) {
      return
    }
    for (const listener of listeners) {
      listener(message)
    }
  }

  function scheduleReconnect() {
    if (closed || !reconnect) {
      return
    }
    const delay = Math.min(RECONNECT_BASE_DELAY * 2 ** attempts, RECONNECT_MAX_DELAY)
    attempts += 1
    reconnectTimer = setTimeout(open, delay)
  }

  function open() {
    if (closed || typeof WebSocket === 'undefined') {
      return
    }
    const target = toValue(url)
    const instance = new WebSocket(target instanceof URL ? target.toString() : target, options.protocols)
    socket = instance
    instance.onopen = () => {
      attempts = 0
    }
    instance.onmessage = handleMessage
    instance.onclose = () => {
      if (socket === instance) {
        socket = undefined
      }
      scheduleReconnect()
    }
  }

  function restart() {
    clearTimeout(reconnectTimer)
    attempts = 0
    const current = socket
    socket = undefined
    if (current) {
      current.onclose = null
      current.close()
    }
    open()
  }

  if (!options.manual) {
    if (isRef(url) || typeof url === 'function') {
      watch(() => toValue(url), restart)
    }
    open()
  }

  return {
    send(message) {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message))
      }
    },
    onMessage(handler) {
      listeners.add(handler)
      return () => listeners.delete(handler)
    },
    close() {
      closed = true
      clearTimeout(reconnectTimer)
      const current = socket
      socket = undefined
      if (current) {
        current.onclose = null
        current.close()
      }
    },
  }
}
