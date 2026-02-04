# UseShiki

[官方文档](https://shiki.tmrs.site/)

## 安装

```bash
pnpm add @oiij/shiki
```

## 示例

<demo vue="./shiki.vue" />

## Types

```ts
declare function useShiki(templateRef: TemplateRef<HTMLElement>, defaultValue?: string | Ref<string>, darkMode?: ComputedRef<boolean>, options?: CodeToHastOptions<BundledLanguage, BundledTheme>): {
  value: Ref<string | undefined, string | undefined>
  html: Ref<string, string>
  templateRef: Readonly<vue0.ShallowRef<HTMLElement | null>>
  format: (value: string, options?: CodeToHastOptions<BundledLanguage, BundledTheme>) => {
    promise: () => Promise<string>
    cancel: () => void
  }
}
type UseShikiReturns = ReturnType<typeof useShiki>
```
