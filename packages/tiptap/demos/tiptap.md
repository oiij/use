# UseTiptap

[官方文档](https://tiptap.dev/docs)

## 安装

```bash
pnpm add @oiij/tiptap
```

## 示例

<demo vue="./tiptap.vue" />

## Types

```ts
declare function useTipTap(templateRef: TemplateRef<HTMLElement>, defaultValue?: Ref<string> | string, options?: Partial<EditorOptions>): {
  value: Ref<string | undefined, string | undefined>
  templateRef: Readonly<vue0.ShallowRef<HTMLElement | null>>
  editor: vue0.ShallowRef<Editor | null, Editor | null>
  onRender: _vueuse_core0.EventHookOn<[Editor]>
}
type AiEditorReturns = ReturnType<typeof useAiEditor>
```
