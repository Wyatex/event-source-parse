import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
  },
  rules: {
    'ts/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
})
