import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: {
    componentNameCasing: 'PascalCase',
  },
  rules: {
    'ts/consistent-type-definitions': ['error', 'type'],
    'e18e/ban-dependencies': ['off'],
    'e18e/prefer-static-regex': ['off'],
  },
  ignores: [
    '**/**.css',
  ],
})
