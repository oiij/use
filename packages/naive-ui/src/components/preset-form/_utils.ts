import type { NaiveFormRules, PresetFormOptions } from '.'

export function options2Rules<D extends Record<string, any>>(options?: PresetFormOptions<D>): NaiveFormRules<D> | undefined {
  if (!options) {
    return undefined
  }
  const rules: NaiveFormRules<D> = {}

  options.forEach((f) => {
    if (f.key && f.rules) {
      rules[f.key] = f.rules
    }
  })
  return rules
}
