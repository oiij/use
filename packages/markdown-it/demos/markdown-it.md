# UseMarkdownIt

[官方文档](https://github.com/markdown-it/markdown-it)

## 安装

```bash
pnpm add @oiij/markdown-it
```

## 示例

<demo vue="./markdown-it.vue" />

## Types

```ts
type MarkDownItOptions = Options & {
  manual?: boolean
  domPurify?: boolean
}
declare function useMarkdownIt(templateRef?: TemplateRef<HTMLElement>, defaultValue?: Ref<string> | string, options?: MarkDownItOptions): {
  value: Ref<string | undefined, string | undefined>
  html: Ref<string, string>
  templateRef: Readonly<vue0.ShallowRef<HTMLElement | null>> | undefined
  md: markdownIt
  render: (value: string) => string
}
type MarkdownItReturns = ReturnType<typeof useMarkdownIt>
```
