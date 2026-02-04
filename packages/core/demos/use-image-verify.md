# UseImageVerify

## Demo

<demo vue="./use-image-verify.vue" title="UseImageVerify" />

## Types

```ts
type ImageVerifyType = 'operation' | 'character'
type OperationConfig = {
  figure?: number
  arith?: '+' | '-' | '*'
}
type CharacterConfig = {
  length?: number
}
type ImageVerifyOptions = {
  width?: number
  height?: number
  refreshOnClick?: boolean
  type?: ImageVerifyType
  config?: OperationConfig & CharacterConfig
  disturbLine?: number
  disturbPoint?: number
}
declare function useImageVerify(options?: ImageVerifyOptions): {
  domRef: vue42.Ref<HTMLCanvasElement | undefined, HTMLCanvasElement | undefined>
  value: vue42.Ref<string, string>
  code: vue42.Ref<string, string>
  passed: vue42.ComputedRef<boolean>
  validate: () => Promise<unknown>
  reset: () => void
  refresh: () => void
}
```
