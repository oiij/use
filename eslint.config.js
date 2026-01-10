import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  rules: {
    'ts/consistent-type-definitions': ['error', 'type'],
  },
  ignores: [
    '**/**.css',
  ],
})
