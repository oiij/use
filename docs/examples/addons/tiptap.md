# UseTiptap

[官方文档](https://tiptap.dev/docs)

## 安装

```bash
pnpm add @oiij/tiptap
```

## 示例

<demo vue="./demos/tiptap.vue" />

## Types

```ts
declare function useAiEditor(defaultValue?: Ref<string> | string, darkMode?: ComputedRef<boolean>, language?: ComputedRef<'zh' | 'en'>, options?: Omit<AiEditorOptions, 'element'>): {
  value: Ref<string | undefined, string | undefined>
  domRef: Ref<HTMLElement | undefined, HTMLElement | undefined>
  aiEditor: vue0.ShallowRef<AiEditor | null, AiEditor | null>
  readonly: Ref<boolean, boolean>
}
type AiEditorReturns = ReturnType<typeof useAiEditor>
```
