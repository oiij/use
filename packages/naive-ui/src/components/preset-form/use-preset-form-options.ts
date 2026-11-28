import type { MaybeRefOrGetter } from 'vue'
import type { DataObject } from '../../composables/use-data-request'
import type { PresetFormOptionItem, PresetFormOptions } from './index'
import { computed, toValue } from 'vue'

/**
 * 预设表单选项分区
 * 一次遍历区分普通区与折叠区，并生成渲染所需的属性
 * @template V 表单值类型
 * @param options 表单选项，支持响应式
 * @returns normalRenderProps 普通区渲染属性，collapsedRenderProps 折叠区渲染属性
 * @example
 * ```ts
 * const { normalRenderProps, collapsedRenderProps } = usePresetFormOptions(() => props.options)
 * ```
 */
export function usePresetFormOptions<V extends DataObject = DataObject>(options: MaybeRefOrGetter<PresetFormOptions<V> | undefined>) {
  const partitions = computed(() => {
    const normal: PresetFormOptionItem<V>[] = []
    const collapsed: PresetFormOptionItem<V>[] = []

    for (const option of toValue(options) ?? []) {
      if (toValue(option.hidden))
        continue
      if (toValue(option.collapsed))
        collapsed.push(option)
      else
        normal.push(option)
    }

    return { normal, collapsed }
  })

  function createOptionRenderProps(option: PresetFormOptionItem<V>) {
    const { key, label, required, span, rule, itemProps, render, type, emptyValue, ...inputOption } = option
    const { offset, suffix, ...extraItemProps } = itemProps ?? {}

    const normalizedKey = typeof key === 'string' || typeof key === 'number' ? String(key) : undefined

    return {
      key: normalizedKey,
      type,
      emptyValue,
      label: toValue(label),
      span: toValue(span) ?? itemProps?.span,
      rule,
      offset,
      suffix,
      itemProps: extraItemProps,
      render,
      inputOption,
      rawKey: key,
      required: toValue(required),
    }
  }

  const normalRenderProps = computed(() => partitions.value.normal.map(createOptionRenderProps))
  const collapsedRenderProps = computed(() => partitions.value.collapsed.map(createOptionRenderProps))

  return { normalRenderProps, collapsedRenderProps }
}
