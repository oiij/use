<script setup lang='ts'>
import { TiptapEditor, TiptapMenu } from '@oiij/tiptap'
import { ref } from 'vue'
import '@oiij/tiptap/style'

const content = ref('<p>欢迎使用 Tiptap 富文本编辑器！</p><p>点击工具栏按钮开始编辑。</p>')
</script>

<template>
  <div class="demo">
    <TiptapEditor v-model:value="content">
      <TiptapMenu />
    </TiptapEditor>
    <details class="demo__output">
      <summary>查看 HTML 输出</summary>
      <pre>{{ content }}</pre>
    </details>
  </div>
</template>

<style scoped>
.demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo__output {
  border: 1px solid hsl(var(--border));
  border-radius: 8px;
  padding: 8px;
}

.demo__output summary {
  cursor: pointer;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
  padding: 4px;
}

.demo__output pre {
  margin: 8px 0 0;
  padding: 12px;
  background: hsl(var(--muted));
  border-radius: 6px;
  font-size: 12px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
