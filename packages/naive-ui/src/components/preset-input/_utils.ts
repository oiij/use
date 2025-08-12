import type { FormItemProps } from 'naive-ui'
import type { VNode } from 'vue'
import type { ClassStyle } from '../data-table-plus'
import { NFormItem } from 'naive-ui'
import { h } from 'vue'

export function renderLabel(children: VNode | null, label?: string | boolean |(FormItemProps & ClassStyle), defaultProps?: FormItemProps) {
  const labelProps = typeof label === 'string' ? { label } : typeof label === 'boolean' ? {} : label
  return label
    ? h(NFormItem, {
        ...defaultProps,
        ...labelProps,
      }, {
        default: () => children,
      })
    : children
}
