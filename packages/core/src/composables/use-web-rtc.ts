import { createEventHook } from '@vueuse/core'
import { onUnmounted, ref } from 'vue'
import { useWebSocket } from './use-web-socket'

export type WebRTCOptions = RTCConfiguration & {
  protocols?: string[]
}
export type Status = 'pending' | 'ready' | 'connected' | 'closed'

export interface HandleEvent {
  'register': {
    key: string
  }
  'offer': {
    key: string
    desc: RTCSessionDescriptionInit
  }
  'answer': {
    key: string
    desc: RTCSessionDescriptionInit
  }
  'answer-ok': {
    key: string
  }
  'ice-candidate': {
    candidate: RTCIceCandidate
  }
}
export function useWebRTC(url: string | URL, options?: WebRTCOptions) {
  const { protocols = [], ...rtcConfig } = options ?? {}
  const onReadyEvent = createEventHook<void>()
  const onConnectionEvent = createEventHook<RTCDataChannelEvent>()
  const onConnectionStreamEvent = createEventHook<RTCTrackEvent>()
  const controller = new AbortController()
  const id = ref<string>()
  const connected = ref<string[]>([])
  const status = ref<Status>('pending')
  const peer = new RTCPeerConnection(rtcConfig)

  const iceConnectionState = ref<RTCIceConnectionState>(peer.iceConnectionState)
  const signalingState = ref<RTCSignalingState>(peer.signalingState)
  const connectionState = ref<RTCPeerConnectionState>(peer.connectionState)

  const { registerHandler, send } = useWebSocket<HandleEvent>(url, { protocols, parseMessage: true })

  function onReady() {
    onReadyEvent.trigger()
  }
  function onConnection(ev: RTCDataChannelEvent) {
    onConnectionEvent.trigger(ev)
  }
  function onConnectionStream(ev: RTCTrackEvent) {
    onConnectionStreamEvent.trigger(ev)
  }
  function onIcecandidate(ev: RTCPeerConnectionIceEvent) {
    if (ev.candidate) {
      send({
        type: 'ice-candidate',
        payload: {
          candidate: ev.candidate,
        },
      })
    }
  }
  registerHandler('register', ({ payload }) => {
    const { key } = payload
    id.value = key
    status.value = 'ready'
    onReady()
  })
  registerHandler('offer', async ({ payload }) => {
    const { key, desc } = payload
    await peer.setRemoteDescription(desc)
    const answer = await peer.createAnswer()
    await peer.setLocalDescription(answer)
    send({
      type: 'answer',
      payload: {
        key, // 1#
        desc: answer,
      },
    })
  })
  registerHandler('answer', async ({ payload }) => {
    const { key, desc } = payload
    await peer.setRemoteDescription(desc)
    if (!connected.value.includes(key)) {
      connected.value.push(key)
    }
    send({
      type: 'answer-ok',
      payload: {
        key, // 1#
      },
    })
  })
  registerHandler('answer-ok', ({ payload }) => {
    const { key } = payload
    status.value = 'connected'
    if (!connected.value.includes(key)) {
      connected.value.push(key)
    }
  })
  registerHandler('ice-candidate', async ({ payload }) => {
    const { candidate } = payload
    try {
      await peer.addIceCandidate(candidate)
    }
    catch (error) {
      console.error(error)
    }
  })
  async function connect(id: string, label = 'label') {
    const dataChannel = peer.createDataChannel(label)
    const offer = await peer.createOffer()
    await peer.setLocalDescription(offer)
    send({
      type: 'offer',
      payload: {
        key: id,
        desc: offer,
      },
    })

    return dataChannel
  }
  async function connectStream(id: string, stream: MediaStream) {
    stream.getTracks().forEach((track) => {
      peer.addTrack(track, stream)
    })
    const offer = await peer.createOffer()
    await peer.setLocalDescription(offer)
    send({
      type: 'offer',
      payload: {
        key: id,
        desc: offer,
      },
    })
    return peer
  }

  peer.addEventListener('icecandidate', onIcecandidate, { signal: controller.signal })
  peer.addEventListener('iceconnectionstatechange', () => {
    iceConnectionState.value = peer.iceConnectionState
  }, { signal: controller.signal })
  peer.addEventListener('signalingstatechange', () => {
    signalingState.value = peer.signalingState
  }, { signal: controller.signal })
  peer.addEventListener('connectionstatechange', () => {
    connectionState.value = peer.connectionState
  }, { signal: controller.signal })
  peer.addEventListener('datachannel', onConnection, { signal: controller.signal })
  peer.addEventListener('track', onConnectionStream, { signal: controller.signal })

  function destroy() {
    controller.abort()
    peer.close()
  }

  onUnmounted(() => {
    destroy()
  })

  return {
    id,
    connected,
    status,
    peer,
    signalingState,
    connectionState,
    connect,
    connectStream,
    onReady: onReadyEvent.on,
    onConnection: onConnectionEvent.on,
    onConnectionStream: onConnectionStreamEvent.on,
  }
}
