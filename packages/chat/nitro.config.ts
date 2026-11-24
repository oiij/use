import { defineNitroConfig } from 'nitro/config'

export default defineNitroConfig({
  serverDir: 'server/nitro',
  experimental: {
    websocket: true,
  },
  preset: 'node-server',
})
