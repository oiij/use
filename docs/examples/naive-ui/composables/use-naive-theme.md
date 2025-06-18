# UseNaiveTheme

## Demo

<demo vue="./demos/use-naive-theme.vue" title="UseNaiveTheme" />

## Types

```ts
export interface NaiveThemeReturns {
  theme: ComputedRef<typeof darkTheme | undefined>
  themeOverrides: ComputedRef<GlobalThemeOverrides>
  locale: ComputedRef<typeof zhCN | typeof enUS>
  dateLocale: ComputedRef<NDateLocale>
  color: Ref<Color>
  setColor: (v: Color) => void
}
```
