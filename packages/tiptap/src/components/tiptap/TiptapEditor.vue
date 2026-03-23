<script setup lang='ts'>
import type { EditorOptions } from '../../composables/use-tiptap'
import { provide, useTemplateRef } from 'vue'
import { __INJECTION_KEY__ } from '..'
import { useTipTap } from '../../composables/use-tiptap'

const { value, options } = defineProps<{
  value?: string
  options?: Partial<EditorOptions>
}>()
const emit = defineEmits<{
  (e: 'update:value', value: string): void
}>()
const { editorInst, onUpdateValue } = useTipTap(useTemplateRef('tiptap-ref'), {
  value,
  tiptapOptions: options,
})

onUpdateValue((value) => {
  emit('update:value', value)
})

provide(__INJECTION_KEY__, editorInst)
</script>

<template>
  <div class="tiptap-editor">
    <slot />
    <div ref="tiptap-ref" class="tiptap-editor__content" />
  </div>
</template>

<style scoped>
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --border: 240 5.9% 90%;
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
  --border: 240 3.7% 15.9%;
}
.tiptap-editor {
  border: 1px solid hsl(var(--border));
  border-radius: 8px;
  overflow: hidden;
  background-color: hsl(var(--background));
  outline: none;
}

.tiptap-editor:focus-within {
  border-color: hsl(var(--border));
  box-shadow: none;
}

.tiptap-editor__content {
  min-height: 200px;
  padding: 12px 16px;
  .ProseMirror {
    outline: none !important;
  }
  .ProseMirror-selectednode {
    outline: 3px solid hsl(var(--border));
  }
  code {
    background-color: hsl(var(--muted));
    border: 1px solid hsl(var(--border));
    border-radius: 4px;
    padding: 0.15em 0.35em;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
    font-size: 0.875em;
  }
  pre {
    background-color: hsl(var(--muted));
    border: 1px solid hsl(var(--border));
    border-radius: 8px;
    padding: 16px 20px;
    margin: 1em 0;
    overflow-x: auto;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
    font-family: 'SF Mono', 'Fira Code', 'JetBrains Mono', Menlo, Consolas, monospace;
    font-size: 0.875em;
    line-height: 1.6;
    line-height: 1.7;
    code {
      background: none;
      border: none;
      padding: 0;
      color: hsl(var(--foreground));
      font-size: inherit;
      color: inherit;
    }
  }
}
</style>
