# PresetPicker 配置选择器

## Demo

<demo vue="./demos/preset-picker.vue" title="PresetPicker" />

## Types

```ts
export type PresetPickerValue = string | number | (string | number)[] | null
export interface PresetPickerExposeRefs<R extends RObject> {
  showModalFlag: Ref<boolean, boolean>
  checkedRowKeys: Ref<(string | number)[], (string | number)[]>
  checkedRows: Ref<R[], R[]>
  columns: DataTableColumns<any>
}
export interface PresetPickerExposeActions<R extends RObject> {
  showModal: () => void
  onUpdateCheckedRowKeys: (keys: (string | number)[], rows: (R | undefined)[], meta: {
    row: R | undefined
    action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll'
  }, currentData: R[]) => void
  onClickRow: (row: R) => void
  onNegativeClick: () => void
  onPositiveClick: () => void
  clearValue: () => void
}
export type PresetPickerProps<V extends PresetPickerValue, R extends RObject> = & {
  value?: V
  fallbackLabel?: string
  multiple?: boolean
  disabled?: boolean
  clearable?: boolean
  placeholder?: string
  type?: ButtonProps['type']
  columns?: DataTableColumns<R>
  selectionOptions?: TableSelectionColumn
  fields?: {
    rowKey?: string
  }
  buttonProps?: ButtonProps
  clearButtonProps?: ButtonProps
  badgeProps?: BadgeProps
  modalProps?: ModalProps
}
export type PresetPickerEmits<V extends PresetPickerValue, R extends RObject> = & {
  (e: 'update:value', val: V | null, raw: R | R[] | null): void
  (e: 'afterEnter'): void
  (e: 'afterLeave'): void
  (e: 'esc'): void
  (e: 'maskClick'): void
  (e: 'update:show', value: boolean): void
  (e: 'close'): void
  (e: 'negativeClick'): void
  (e: 'positiveClick'): void
}
```

## Props

| Name             | Type                 | Default | Description            |
| ---------------- | -------------------- | ------- | ---------------------- |
| value            | PresetPickerValue    | -       | 选择器的值             |
| fallbackLabel    | string               | -       | 选择器的值为空时的提示 |
| multiple         | boolean              | -       | 是否多选               |
| disabled         | boolean              | -       | 是否禁用               |
| clearable        | boolean              | -       | 是否可清空             |
| placeholder      | string               | -       | 输入框占位符           |
| type             | ButtonProps['type']  | -       | 按钮类型               |
| columns          | DataTableColumns     | -       | 数据列                 |
| selectionOptions | TableSelectionColumn | -       | 选择列配置             |
| fields           | '{rowKey?:string}'   | -       | 数据列配置             |
| buttonProps      | ButtonProps          | -       | 按钮配置               |
| clearButtonProps | ButtonProps          | -       | 清空按钮配置           |
| badgeProps       | BadgeProps           | -       | 徽章配置               |
| modalProps       | ModalProps           | -       | 弹窗配置               |

## Emits

| Name          | Type                             | Description        |
| ------------- | -------------------------------- | ------------------ |
| update:value  | (val: PresetPickerValue) => void | 值更新时           |
| afterEnter    | () => void                       | 弹窗进入动画结束时 |
| afterLeave    | () => void                       | 弹窗离开动画结束时 |
| esc           | () => void                       | 按下 esc 键时      |
| maskClick     | () => void                       | 点击遮罩层时       |
| update:show   | (val: boolean) => void           | 弹窗显示状态更新时 |
| close         | () => void                       | 弹窗关闭时         |
| negativeClick | () => void                       | 取消按钮点击时     |
| positiveClick | () => void                       | 确定按钮点击时     |
