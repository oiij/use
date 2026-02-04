# UseAiEditor

[官方文档](https://aieditor.dev/)

## 安装

```bash
pnpm add @oiij/ai-editor
```

## 示例

<demo vue="./ai-editor.vue" />

## Types

```ts
declare function useAiEditor(templateRef: TemplateRef<HTMLElement>, defaultValue?: Ref<string> | string, darkMode?: ComputedRef<boolean> | Ref<boolean>, language?: ComputedRef<'zh' | 'en'> | Ref<'zh' | 'en'>, options?: Omit<AiEditorOptions, 'element'>): {
  value: Ref<string | undefined, string | undefined>
  templateRef: Readonly<vue0.ShallowRef<HTMLElement | null>>
  aiEditor: vue0.ShallowRef<AiEditor | null, AiEditor | null>
  readonly: Ref<boolean, boolean>
  onRender: _vueuse_core0.EventHookOn<[AiEditor]>
}
type AiEditorReturns = ReturnType<typeof useAiEditor>
```
