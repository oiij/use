import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import { createServer } from 'node:http'
import process from 'node:process'

const PORT = Number(process.env.PORT) || 3000
const WS_MAGIC = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
const OPCODE_TEXT = 0x01
const OPCODE_CLOSE = 0x08
const OPCODE_PING = 0x09
const OPCODE_PONG = 0x0A

function computeAcceptKey(key: string): string {
  return createHash('sha1').update(key + WS_MAGIC).digest('base64')
}

/**
 * 解析一个 WebSocket 帧（客户端发往服务端，必带 mask）
 * 返回 { opcode, payload } 或 null（需要更多数据 / 连接关闭）
 */
function parseFrame(buffer: Buffer): { opcode: number, payload: Buffer, consumed: number, closed?: boolean } | null {
  if (buffer.length < 2)
    return null

  const byte0 = buffer[0]
  const byte1 = buffer[1]
  const opcode = byte0 & 0x0F
  const masked = (byte1 & 0x80) !== 0
  let payloadLen = byte1 & 0x7F
  let offset = 2

  if (payloadLen === 126) {
    if (buffer.length < offset + 2)
      return null
    payloadLen = buffer.readUInt16BE(offset)
    offset += 2
  }
  else if (payloadLen === 127) {
    if (buffer.length < offset + 8)
      return null
    payloadLen = Number(buffer.readBigUInt64BE(offset))
    offset += 8
  }

  if (masked) {
    if (buffer.length < offset + 4)
      return null
    const mask = buffer.subarray(offset, offset + 4)
    offset += 4
    if (buffer.length < offset + payloadLen)
      return null
    const payload = Buffer.allocUnsafe(payloadLen)
    for (let i = 0; i < payloadLen; i++)
      payload[i] = buffer[offset + i] ^ mask[i & 3]
    return { opcode, payload, consumed: offset + payloadLen }
  }

  if (buffer.length < offset + payloadLen)
    return null
  return { opcode, payload: buffer.subarray(offset, offset + payloadLen), consumed: offset + payloadLen }
}

/**
 * 服务端向客户端发送文本帧（服务端帧不加 mask）
 */
function encodeTextFrame(text: string): Buffer {
  const payload = Buffer.from(text, 'utf8')
  const len = payload.length
  let header: Buffer
  if (len < 126) {
    header = Buffer.alloc(2)
    header[0] = 0x80 | OPCODE_TEXT // FIN + TEXT
    header[1] = len
  }
  else if (len < 65536) {
    header = Buffer.alloc(4)
    header[0] = 0x80 | OPCODE_TEXT
    header[1] = 126
    header.writeUInt16BE(len, 2)
  }
  else {
    header = Buffer.alloc(10)
    header[0] = 0x80 | OPCODE_TEXT
    header[1] = 127
    header.writeBigUInt64BE(BigInt(len), 2)
  }
  return Buffer.concat([header, payload])
}

/**
 * 发送 close 帧
 */
function encodeCloseFrame(code = 1000, reason?: string): Buffer {
  const reasonBuf = reason ? Buffer.from(reason, 'utf8') : Buffer.alloc(0)
  const payload = Buffer.alloc(2 + reasonBuf.length)
  payload.writeUInt16BE(code, 0)
  reasonBuf.copy(payload, 2)
  let header: Buffer
  if (payload.length < 126) {
    header = Buffer.alloc(2)
    header[0] = 0x80 | OPCODE_CLOSE
    header[1] = payload.length
  }
  else if (payload.length < 65536) {
    header = Buffer.alloc(4)
    header[0] = 0x80 | OPCODE_CLOSE
    header[1] = 126
    header.writeUInt16BE(payload.length, 2)
  }
  else {
    header = Buffer.alloc(10)
    header[0] = 0x80 | OPCODE_CLOSE
    header[1] = 127
    header.writeBigUInt64BE(BigInt(payload.length), 2)
  }
  return Buffer.concat([header, payload])
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const server = createServer((req, res) => {
  // OPTIONS 预检直接 204
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS)
    res.end()
    return
  }

  if (!req.url) {
    res.writeHead(400, CORS_HEADERS)
    res.end()
    return
  }

  const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`)

  if (url.pathname === '/sse') {
    res.writeHead(200, {
      ...CORS_HEADERS,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    })
    res.write('\n')
    res.write(`data: ${JSON.stringify({ type: 'connect', data: 'hello from local sse server' })}\n\n`)

    let counter = 0
    const timer = setInterval(() => {
      counter++
      res.write(`data: ${JSON.stringify({ type: 'message', data: `tick ${counter}` })}\n\n`)
    }, 1000)

    req.on('close', () => {
      clearInterval(timer)
      console.log(`[SSE] client disconnected (path: ${url.pathname})`)
    })
    console.log(`[SSE] client connected (path: ${url.pathname})`)
    return
  }

  res.writeHead(200, { ...CORS_HEADERS, 'Content-Type': 'text/plain; charset=utf-8' })
  res.end([
    'Local realtime test server is running.',
    '',
    'Endpoints:',
    `  ws://localhost:${PORT}/ws    - WebSocket echo`,
    `  ws://localhost:${PORT}/wss   - WebSocket echo (alias)`,
    `  http://localhost:${PORT}/sse - Server-Sent Events`,
  ].join('\n'))
})

server.on('upgrade', (req, socket) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`)
  const pathname = url.pathname

  if (pathname !== '/ws' && pathname !== '/wss') {
    socket.destroy()
    return
  }

  const key = req.headers['sec-websocket-key']
  const version = req.headers['sec-websocket-version']

  if (!key || version !== '13') {
    socket.write('HTTP/1.1 400 Bad Request\r\n\r\n')
    socket.destroy()
    return
  }

  const accept = computeAcceptKey(key)
  socket.write([
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    `Sec-WebSocket-Accept: ${accept}`,
    '\r\n',
  ].join('\r\n'))

  console.log(`[WS] client connected (path: ${pathname})`)
  socket.write(encodeTextFrame(JSON.stringify({ type: 'connect', data: 'hello from local websocket server' })))

  let buffer = Buffer.alloc(0)

  const onData = (chunk: Buffer) => {
    buffer = Buffer.concat([buffer, chunk])
    while (true) {
      const frame = parseFrame(buffer)
      if (!frame)
        break
      buffer = buffer.subarray(frame.consumed)

      if (frame.opcode === OPCODE_CLOSE) {
        console.log('[WS] received close frame')
        socket.write(encodeCloseFrame())
        socket.end()
        return
      }
      if (frame.opcode === OPCODE_PING) {
        socket.write(Buffer.concat([Buffer.from([0x80 | OPCODE_PONG, frame.payload.length]), frame.payload]))
        continue
      }
      if (frame.opcode === OPCODE_TEXT) {
        const text = frame.payload.toString('utf8')
        console.log(`[WS] recv: ${text}`)
        socket.write(encodeTextFrame(JSON.stringify({ type: 'message', data: text })))
      }
    }
  }

  const onClose = () => {
    console.log(`[WS] client disconnected (path: ${pathname})`)
    cleanup()
  }

  const onError = (err: Error) => {
    console.error('[WS] socket error:', err.message)
    cleanup()
  }

  function cleanup() {
    socket.removeListener('data', onData)
    socket.removeListener('close', onClose)
    socket.removeListener('error', onError)
  }

  socket.on('data', onData)
  socket.on('close', onClose)
  socket.on('error', onError)
})

server.listen(PORT, () => {
  console.log(`\n🚀 Local test server running at http://localhost:${PORT}`)
  console.log(`   WebSocket (echo): ws://localhost:${PORT}/ws`)
  console.log(`   WebSocket (alias): ws://localhost:${PORT}/wss`)
  console.log(`   SSE (push):      http://localhost:${PORT}/sse\n`)
})
