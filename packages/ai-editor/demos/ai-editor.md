# UseAiEditor

## 功能描述

**UseAiEditor** 是一个用于集成 AI 编辑器的 Vue 组合式函数，支持默认值设置、暗黑模式切换、语言设置和自定义配置选项，可用于创建具有 AI 辅助编辑功能的富文本编辑器。

## 安装

```bash
# 使用 npm
npm install @oiij/ai-editor

# 使用 yarn
yarn add @oiij/ai-editor

# 使用 pnpm
pnpm add @oiij/ai-editor
```

## 基本使用

<demo vue="./ai-editor.vue" title="UseAiEditor" />

## API

### 函数签名

```ts
declare function useAiEditor(templateRef: TemplateRef<HTMLElement>, defaultValue?: Ref<string> | string, darkMode?: ComputedRef<boolean> | Ref<boolean>, language?: ComputedRef<'zh' | 'en'> | Ref<'zh' | 'en'>, options?: Omit<AiEditorOptions, 'element'>): UseAiEditorReturns
```

## 类型定义

```ts
export type UseAiEditorReturns = {
  value: Ref<string | undefined>
  templateRef: Readonly<ShallowRef<HTMLElement | null>>
  aiEditor: ShallowRef<AiEditor | null>
  readonly: Ref<boolean>
  onRender: EventHookOn<[AiEditor]>
}

declare function useAiEditor(templateRef: TemplateRef<HTMLElement>, defaultValue?: Ref<string> | string, darkMode?: ComputedRef<boolean> | Ref<boolean>, language?: ComputedRef<'zh' | 'en'> | Ref<'zh' | 'en'>, options?: Omit<AiEditorOptions, 'element'>): UseAiEditorReturns
```
