export { default as NTypeWriter } from './TypeWriter.vue'

export type TypeWriterProps = & {
  value?: string
  typing?: boolean
  markdown?: boolean
  step?: number
  interval?: number
  suffix?: string
}
