import type { RtcPeerStatus, RtcSignalMessage } from '../types'

export type PeerSessionOptions = {
  key: string
  polite: boolean
  config: RTCConfiguration
  getSelfKey: () => string | undefined
  sendSignal: (message: RtcSignalMessage) => void
  onStatus: (status: RtcPeerStatus) => void
  onChannel: (channel: RTCDataChannel) => void
  onTrack: (stream: MediaStream) => void
  onError: (error: unknown) => void
}

const STATUS_MAP: Record<RTCPeerConnectionState, RtcPeerStatus> = {
  new: 'new',
  connecting: 'connecting',
  connected: 'connected',
  disconnected: 'disconnected',
  failed: 'failed',
  closed: 'closed',
}

export function createPeerSession(options: PeerSessionOptions) {
  const { key, polite, config, getSelfKey, sendSignal, onStatus, onChannel, onTrack, onError } = options

  const peer = new RTCPeerConnection(config)
  const pendingCandidates: RTCIceCandidateInit[] = []
  let channel: RTCDataChannel | undefined
  let stream: MediaStream | undefined
  let closed = false

  function attachChannel(target: RTCDataChannel) {
    channel = target
    target.onopen = () => onStatus(STATUS_MAP[peer.connectionState])
    target.onclose = () => onStatus(STATUS_MAP[peer.connectionState])
    onChannel(target)
  }

  async function flushCandidates() {
    for (let candidate = pendingCandidates.shift(); candidate; candidate = pendingCandidates.shift()) {
      if (closed) {
        return
      }
      await peer.addIceCandidate(candidate)
    }
  }

  async function createOffer() {
    if (closed || peer.signalingState !== 'stable') {
      return
    }
    await peer.setLocalDescription(await peer.createOffer())
    const desc = peer.localDescription
    if (desc) {
      sendSignal({ type: 'offer', payload: { key, from: getSelfKey(), desc: desc.toJSON() } })
    }
  }

  async function acceptOffer(desc: RTCSessionDescriptionInit) {
    if (closed) {
      return
    }
    if (peer.signalingState !== 'stable') {
      if (!polite) {
        return
      }
      await peer.setLocalDescription({ type: 'rollback' })
    }
    await peer.setRemoteDescription(desc)
    await flushCandidates()
    await peer.setLocalDescription(await peer.createAnswer())
    const answer = peer.localDescription
    if (answer) {
      sendSignal({ type: 'answer', payload: { key, from: getSelfKey(), desc: answer.toJSON() } })
    }
  }

  async function acceptAnswer(desc: RTCSessionDescriptionInit) {
    if (closed || peer.signalingState !== 'have-local-offer') {
      return
    }
    await peer.setRemoteDescription(desc)
    await flushCandidates()
  }

  async function addCandidate(candidate: RTCIceCandidateInit) {
    if (closed) {
      return
    }
    if (!peer.remoteDescription) {
      pendingCandidates.push(candidate)
      return
    }
    await peer.addIceCandidate(candidate)
  }

  function createChannel(label: string) {
    const created = peer.createDataChannel(label)
    attachChannel(created)
    return created
  }

  function addStream(mediaStream: MediaStream) {
    for (const track of mediaStream.getTracks()) {
      peer.addTrack(track, mediaStream)
    }
  }

  function close() {
    if (closed) {
      return
    }
    closed = true
    channel?.close()
    for (const sender of peer.getSenders()) {
      if (sender.track) {
        peer.removeTrack(sender)
      }
    }
    peer.close()
    onStatus('closed')
  }

  peer.onconnectionstatechange = () => {
    onStatus(STATUS_MAP[peer.connectionState])
    if (peer.connectionState === 'failed') {
      onError(new Error(`peer ${key} connection failed`))
    }
  }

  peer.onicecandidate = (ev) => {
    if (!ev.candidate) {
      return
    }
    sendSignal({
      type: 'ice-candidate',
      payload: { key, from: getSelfKey(), candidate: ev.candidate.toJSON() },
    })
  }

  peer.ondatachannel = ev => attachChannel(ev.channel)

  peer.ontrack = (ev) => {
    stream = ev.streams[0] ?? new MediaStream([ev.track])
    onTrack(stream)
  }

  peer.onnegotiationneeded = () => {
    void createOffer().catch(error => onError(error))
  }

  return {
    peer,
    get channel() {
      return channel
    },
    get stream() {
      return stream
    },
    createChannel,
    addStream,
    acceptOffer,
    acceptAnswer,
    addCandidate,
    close,
  }
}
