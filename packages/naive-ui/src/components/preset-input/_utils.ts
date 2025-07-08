import type { FormItemProps } from 'naive-ui'
import type { CSSProperties, VNode } from 'vue'
import { NFormItem } from 'naive-ui'
import { h } from 'vue'

export function renderLabel(children: VNode, label?: string | boolean |(FormItemProps & {
  style?: CSSProperties
  class?: string
}), path?: string) {
  const labelProps = typeof label === 'string' ? { label } : typeof label === 'boolean' ? {} : label
  return label
    ? h(NFormItem, {
        labelPlacement: 'left',
        path,
        ...labelProps,
      }, {
        default: () => children,
      })
    : children
}
