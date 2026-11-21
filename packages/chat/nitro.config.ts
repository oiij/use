import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
  srcDir: 'server/nitro',
  experimental: {
    websocket: true,
  },
  preset: 'node-server',
})
