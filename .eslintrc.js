const stylistic = require('@stylistic/eslint-plugin');


const customized = stylistic.configs.customize({
  semi: true,
});

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  plugins: [
    '@typescript-eslint',
    '@stylistic',
  ],
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:@stylistic/disable-legacy',
  ],
  rules: {
    ...customized.rules,

    '@stylistic/arrow-parens': [2, 'as-needed'],
    '@stylistic/jsx-one-expression-per-line': 0,
    '@stylistic/jsx-quotes': [2, 'prefer-single'],
    '@stylistic/member-delimiter-style': [2, {
      multiline: { delimiter: 'comma', requireLast: true },
      singleline: { delimiter: 'comma', requireLast: false },
    }],
    '@stylistic/multiline-ternary': 0,
    '@stylistic/no-multiple-empty-lines': [2, { max: 2, maxBOF: 0, maxEOF: 0 }],
    '@stylistic/quotes': [2, 'single', { avoidEscape: true }],
    '@typescript-eslint/consistent-indexed-object-style': [2, 'index-signature'],
    '@typescript-eslint/consistent-type-definitions': [2, 'type'],
    '@typescript-eslint/no-confusing-void-expression': [2, { ignoreArrowShorthand: true }],
    '@typescript-eslint/no-misused-promises': [2, { checksVoidReturn: false }],
    '@typescript-eslint/prefer-nullish-coalescing': [2, { ignorePrimitives: true }],
    '@typescript-eslint/restrict-template-expressions': [2, { allowNumber: true }],
    '@typescript-eslint/use-unknown-in-catch-callback-variable': 0,
    'import/order': [2, {
      groups: [['builtin', 'external'], ['sibling', 'parent']],
      'newlines-between': 'always',
    }],
    'jsx-a11y/label-has-associated-control': [2, { assert: 'either' }],
    'no-bitwise': 0,
    'no-console': 0,
    radix: [2, 'as-needed'],
    'react/jsx-props-no-spreading': 0,
    'react/react-in-jsx-scope': 0,
    'react/require-default-props': 0,
  },
  overrides: [
    { files: '*.ts' },
  ],
};
