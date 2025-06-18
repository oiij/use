export { default as NTypeWriter } from './TypeWriter.vue'
export interface TypeWriterProps {
  value?: string
  typing?: boolean
  markdown?: boolean
  step?: number
  interval?: number
  suffix?: string
}
