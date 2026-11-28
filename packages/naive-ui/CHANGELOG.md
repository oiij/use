# Changelog

本文件记录 `@oiij/naive-ui` 的重要变更。

## [Unreleased]

### 新增

- 新增共享工具 `mergeFields`、`createExpose`，以及 `ClassStyle`、`PresetValue` 共享类型。
- 新增 `useRemoteRequest` / `bindRemoteRequestEmits`，统一远程请求创建与 `before` / `success` / `error` / `finally` 事件桥接。
- 新增 `useRemotePagination`，统一分页事件处理与分页属性绑定。
- 新增 `usePresetSelect`、`usePresetPicker`、`usePresetFormOptions` 内部组合式函数，拆分组件逻辑。
- 新增 `PresetSelectPassThroughProps`、`PresetFormNativeProps`、`PresetFormItemProps`、`PresetFieldOption` 类型。

### 变更（可能影响现有用法）

- `DataTablePlus`、`PresetForm` 的 slot 参数改为组件内部解包后的纯值，不再需要 `.value`；通过组件 ref 访问 expose 时仍为 ref 形态。`PresetForm` 的 `render` 参数保持不变。
- `selectProps`、`dataTableProps`、`searchProps`、`options.props`、`formProps`、`itemProps` 不能再覆盖组件受控字段（类型层面已排除）：
  - `PresetSelect.selectProps` 不可覆盖 `value` / `options` / `multiple` / `loading` / `show` 等。
  - `PresetField.options.props` 不可覆盖 `value` / `onUpdate:value`。
  - `PresetForm.formProps` 不可覆盖 `model` / `rules`，`itemProps` 不可覆盖 `label` / `path` / `rule`。
- `PresetPicker` 多选确认时，`update:value` 的 `raw` 仅包含已加载到的行，数量可能少于 keys。
- `RemoteRequest` 内部改用 `useRemoteRequest`，对外行为保持一致。

### 修复

- 修复 `defaultParams` 中的 `page` / `pageSize` 被内置分页默认值覆盖的问题，用户显式传入的值现在优先。
- 修复切换 `pageSize` 后未回到第一页的问题。
- 修复请求 loading 期间搜索、翻页、切换每页数量被丢弃的问题。
- 修复 `PresetSelect` 跨页/搜索后已选项 label 与多选 `raw` 丢失的问题，新增已选项缓存。
- 修复 `PresetPicker` 外部修改 `value` 后选中态不同步的问题。
- 修复 `PresetPicker` 的 `columns` / `selectionOptions` / `multiple` 变更后表格列不更新的问题。
- 修复 `PresetField` 的透传属性可以覆盖 `value` / `onUpdate:value` 的问题。
- 修复 `DataTablePlus.reset()` 丢失 `defaultParams` 的问题；现在会清空筛选、排序、搜索并保留默认参数回到第一页。
- 修复 `PresetPicker` 确认时可能产生空行或错误行的问题，改为按 keys 映射并过滤未加载行。
- 修复 `useNaiveForm` 的 `clearRules` 字段级默认值在嵌套字段和 `resetForm()` 中不生效的问题；`clear()` 与 `resetForm()` 现在统一应用字段级默认值（按顶层字段名匹配，嵌套对象使用类型默认值）。

### 移除

- 移除未使用的公开类型 `ArrayAwareType`。
- 移除 `PresetSelectFields.rowKey`，`PresetSelect` 不再支持 `rowKey` 字段配置。
- 移除各组件空 `<style scoped>` 与无意义的 `void` 语句。

### 测试与文档

- 新增 `mergeFields`、`createExpose`、`mergeRule` 单元测试，共 7 条用例。
- 同步 `preset-select`、`data-table-plus`、`preset-picker`、`preset-field`、`preset-form` 文档，修正默认值、事件、Expose 与 slot 语义。
