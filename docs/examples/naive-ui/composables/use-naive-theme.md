# UseNaiveTheme

## Demo

<demo vue="./demos/use-naive-theme.vue" title="UseNaiveTheme" />

## Types

```ts
// #region src/composables/use-naive-theme.d.ts
type Locales<T extends string = string> = Record<T, {
  name: string
  dateLocale: NDateLocale
  locale: typeof zhCN
}>
type NaiveThemeOptions<T extends string> = {
  language?: T | Ref<T>
  darkMode?: boolean | Ref<boolean>
  colors?: Colors
  globalThemeOverrides?: GlobalThemeOverrides
  locales?: Partial<Locales<T>>
}
declare function useNaiveTheme<T extends string>(options?: NaiveThemeOptions<T>): {
  language: Ref<T, T>
  darkMode: Ref<boolean | undefined, boolean | undefined>
  theme: ComputedRef<naive_ui_es_themes_interface21.BuiltInGlobalTheme | undefined>
  colors: Ref<{
    primary?: string | undefined
    info?: string | undefined
    success?: string | undefined
    warning?: string | undefined
    error?: string | undefined
  }, Colors | {
    primary?: string | undefined
    info?: string | undefined
    success?: string | undefined
    warning?: string | undefined
    error?: string | undefined
  }>
  themeColors: ComputedRef<{
    primary?: string | undefined
    info?: string | undefined
    success?: string | undefined
    warning?: string | undefined
    error?: string | undefined
  } | {
    [k: string]: string | undefined
  }>
  themeOverrides: ComputedRef<GlobalThemeOverrides>
  locales: Locales<T>
  locale: ComputedRef<Locales<T>[T]>
  setColor: (v: Partial<Colors>) => void
}
type NaiveThemeReturns = ReturnType<typeof useNaiveTheme>
// #endregion
export { NaiveThemeOptions, NaiveThemeReturns, useNaiveTheme }
```
