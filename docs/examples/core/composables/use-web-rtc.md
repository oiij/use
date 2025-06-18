# UseWebRTC

[官方文档](https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API)

## Demo

<demo vue="./demos/use-web-rtc.vue" />

## Types

```ts
type WebRTCOptions = RTCConfiguration & {
  protocols?: string[]
}
type Status = 'pending' | 'ready' | 'connected' | 'closed'
interface HandleEvent {
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
declare function useWebRTC(url: string | URL, options?: WebRTCOptions): {
  id: vue62.Ref<string | undefined, string | undefined>
  connected: vue62.Ref<string[], string[]>
  status: vue62.Ref<Status, Status>
  peer: RTCPeerConnection
  signalingState: vue62.Ref<RTCSignalingState, RTCSignalingState>
  connectionState: vue62.Ref<RTCPeerConnectionState, RTCPeerConnectionState>
  connect: (id: string, label?: string) => Promise<RTCDataChannel>
  connectStream: (id: string, stream: MediaStream) => Promise<RTCPeerConnection>
  onReady: _vueuse_core67.EventHookOn<void>
  onConnection: _vueuse_core67.EventHookOn<RTCDataChannelEvent>
  onConnectionStream: _vueuse_core67.EventHookOn<RTCTrackEvent>
}
```
