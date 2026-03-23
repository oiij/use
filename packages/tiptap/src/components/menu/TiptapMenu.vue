<script setup lang='ts'>
import type { Editor } from '@tiptap/core'
import type { ShallowRef } from 'vue'
import { computed, inject, onBeforeUnmount, ref, watchEffect } from 'vue'
import { __INJECTION_KEY__ } from '..'

type ActionItem = {
  name: string
  label: string
  icon: string
}

const actions: ActionItem[] = [
  { name: 'bold', label: '加粗', icon: 'bold' },
  { name: 'italic', label: '斜体', icon: 'italic' },
  { name: 'strike', label: '删除线', icon: 'strike' },
  { name: 'code', label: '代码', icon: 'code' },
  { name: 'image', label: '图片', icon: 'image' },
  { name: 'clear-marks', label: '清除格式', icon: 'clear-marks' },
  { name: 'clear-nodes', label: '清除节点', icon: 'clear-nodes' },
  { name: 'paragraph', label: '段落', icon: 'paragraph' },
  { name: 'h1', label: '标题1', icon: 'h1' },
  { name: 'h2', label: '标题2', icon: 'h2' },
  { name: 'h3', label: '标题3', icon: 'h3' },
  { name: 'h4', label: '标题4', icon: 'h4' },
  { name: 'h5', label: '标题5', icon: 'h5' },
  { name: 'h6', label: '标题6', icon: 'h6' },
  { name: 'bullet-list', label: '无序列表', icon: 'bullet-list' },
  { name: 'ordered-list', label: '有序列表', icon: 'ordered-list' },
  { name: 'code-block', label: '代码块', icon: 'code-block' },
  { name: 'block-quote', label: '块引用', icon: 'block-quote' },
  { name: 'horizontal-rule', label: '水平线', icon: 'horizontal-rule' },
  { name: 'hard-break', label: '硬换行', icon: 'hard-break' },
  { name: 'undo', label: '撤销', icon: 'undo' },
  { name: 'redo', label: '重做', icon: 'redo' },
]

const editorRef = inject<ShallowRef<Editor | null>>(__INJECTION_KEY__)

const fileInputRef = ref<HTMLInputElement | null>(null)
const trigger = ref(0)

function onTransaction() {
  trigger.value++
}

watchEffect(() => {
  editorRef?.value?.off('transaction', onTransaction)
  editorRef?.value?.on('transaction', onTransaction)
})

onBeforeUnmount(() => {
  editorRef?.value?.off('transaction', onTransaction)
})

const activeStates = computed(() => {
  const editor = editorRef?.value
  if (!editor)
    return {}
  void trigger.value
  return {
    'bold': editor.isActive('bold'),
    'italic': editor.isActive('italic'),
    'strike': editor.isActive('strike'),
    'code': editor.isActive('code'),
    'paragraph': editor.isActive('paragraph'),
    'h1': editor.isActive('heading', { level: 1 }),
    'h2': editor.isActive('heading', { level: 2 }),
    'h3': editor.isActive('heading', { level: 3 }),
    'h4': editor.isActive('heading', { level: 4 }),
    'h5': editor.isActive('heading', { level: 5 }),
    'h6': editor.isActive('heading', { level: 6 }),
    'bullet-list': editor.isActive('bulletList'),
    'ordered-list': editor.isActive('orderedList'),
    'code-block': editor.isActive('codeBlock'),
    'block-quote': editor.isActive('blockquote'),
  } as Record<string, boolean>
})

const disabledStates = computed(() => {
  const editor = editorRef?.value
  if (!editor)
    return {}
  void trigger.value
  return {
    bold: !editor.can().toggleBold(),
    italic: !editor.can().toggleItalic(),
    strike: !editor.can().toggleStrike(),
    code: !editor.can().toggleCode(),
    undo: !editor.can().undo(),
    redo: !editor.can().redo(),
  } as Record<string, boolean>
})

function handleAction(name: string) {
  const editor = editorRef?.value
  if (!editor)
    return

  if (name === 'image') {
    fileInputRef.value?.click()
    return
  }

  const chain = editor.chain().focus()

  switch (name) {
    case 'bold':
      chain.toggleBold().run()
      break
    case 'italic':
      chain.toggleItalic().run()
      break
    case 'strike':
      chain.toggleStrike().run()
      break
    case 'code':
      chain.toggleCode().run()
      break
    case 'clear-marks':
      chain.unsetAllMarks().run()
      break
    case 'clear-nodes':
      chain.clearNodes().run()
      break
    case 'paragraph':
      chain.setParagraph().run()
      break
    case 'h1':
      chain.toggleHeading({ level: 1 }).run()
      break
    case 'h2':
      chain.toggleHeading({ level: 2 }).run()
      break
    case 'h3':
      chain.toggleHeading({ level: 3 }).run()
      break
    case 'h4':
      chain.toggleHeading({ level: 4 }).run()
      break
    case 'h5':
      chain.toggleHeading({ level: 5 }).run()
      break
    case 'h6':
      chain.toggleHeading({ level: 6 }).run()
      break
    case 'bullet-list':
      chain.toggleBulletList().run()
      break
    case 'ordered-list':
      chain.toggleOrderedList().run()
      break
    case 'code-block':
      chain.toggleCodeBlock().run()
      break
    case 'block-quote':
      chain.toggleBlockquote().run()
      break
    case 'horizontal-rule':
      chain.setHorizontalRule().run()
      break
    case 'hard-break':
      chain.setHardBreak().run()
      break
    case 'undo':
      chain.undo().run()
      break
    case 'redo':
      chain.redo().run()
      break
  }
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file)
    return

  const editor = editorRef?.value
  if (!editor)
    return

  const reader = new FileReader()
  reader.onload = (e) => {
    const src = e.target?.result as string
    if (src) {
      editor.chain().focus().setImage({ src, alt: file.name }).run()
    }
  }
  reader.readAsDataURL(file)
  input.value = ''
}
</script>

<template>
  <div class="tiptap-menu">
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      class="tiptap-menu__file-input"
      @change="onFileChange"
    >
    <button
      v-for="item in actions"
      :key="item.name"
      class="tiptap-menu__button"
      :class="{ 'tiptap-menu__button--active': activeStates[item.name], 'tiptap-menu__button--disabled': disabledStates[item.name] }"
      :title="item.label"
      :disabled="disabledStates[item.name]"
      @click="handleAction(item.name)"
    >
      <svg v-if="item.icon === 'bold'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /></svg>
      <svg v-else-if="item.icon === 'italic'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></svg>
      <svg v-else-if="item.icon === 'strike'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4H9a3 3 0 0 0-2.83 4" /><path d="M14 12a4 4 0 0 1 0 8H6" /><line x1="4" y1="12" x2="20" y2="12" /></svg>
      <svg v-else-if="item.icon === 'code'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
      <svg v-else-if="item.icon === 'image'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
      <svg v-else-if="item.icon === 'clear-marks'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3" /><path d="M9 20h6" /><path d="M12 4v16" /></svg>
      <svg v-else-if="item.icon === 'clear-nodes'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
      <svg v-else-if="item.icon === 'paragraph'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4v16" /><path d="M17 4v16" /><path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13" /></svg>
      <span v-else-if="item.icon.startsWith('h') && item.icon.length <= 2" class="tiptap-menu__text">{{ item.icon.toUpperCase() }}</span>
      <svg v-else-if="item.icon === 'bullet-list'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><circle cx="3" cy="6" r="1" fill="currentColor" /><circle cx="3" cy="12" r="1" fill="currentColor" /><circle cx="3" cy="18" r="1" fill="currentColor" /></svg>
      <svg v-else-if="item.icon === 'ordered-list'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></svg>
      <svg v-else-if="item.icon === 'code-block'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="m10 10-2 2 2 2" /><path d="m14 14 2-2-2-2" /></svg>
      <svg v-else-if="item.icon === 'block-quote'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3" /></svg>
      <svg v-else-if="item.icon === 'horizontal-rule'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="2" y1="12" x2="22" y2="12" /></svg>
      <svg v-else-if="item.icon === 'hard-break'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 8 3 12 7 16" /><line x1="21" y1="12" x2="11" y2="12" /><polyline points="7 8 3 12 7 16" transform="translate(14,0)" /></svg>
      <svg v-else-if="item.icon === 'undo'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></svg>
      <svg v-else-if="item.icon === 'redo'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" /></svg>
    </button>
  </div>
</template>

<style scoped>
.tiptap-menu {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1px;
  padding: 4px 8px;
  border-bottom: 1px solid hsl(var(--border));
  background-color: hsl(var(--muted) / 0.5);
}

.tiptap-menu__file-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

.tiptap-menu__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: hsl(var(--muted-foreground));
  cursor: pointer;
  transition: all 0.15s ease;
}

.tiptap-menu__button:hover {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

.tiptap-menu__button--active {
  background-color: hsl(var(--foreground) / 0.1);
  color: hsl(var(--foreground));
}

.tiptap-menu__button--disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.tiptap-menu__button--disabled:hover {
  background: transparent;
  color: hsl(var(--muted-foreground));
}

.tiptap-menu__text {
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
}
</style>
