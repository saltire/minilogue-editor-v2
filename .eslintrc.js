module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'airbnb',
    'airbnb-typescript',
  ],
  rules: {
    '@typescript-eslint/brace-style': [2, 'stroustrup'],
    '@typescript-eslint/lines-between-class-members': [2, { exceptAfterSingleLine: true }],
    'arrow-parens': [2, 'as-needed'],
    'function-call-argument-newline': 0,
    'function-paren-newline': 0,
    'jsx-quotes': [2, 'prefer-single'],
    'no-cond-assign': [2, 'except-parens'],
    'no-console': 0,
    'no-multi-assign': 0,
    'no-multiple-empty-lines': [2, { max: 2, maxBOF: 0, maxEOF: 0 }],
    'no-nested-ternary': 0,
    'object-curly-newline': [2, { multiline: true, consistent: true }],
    radix: [2, 'as-needed'],
    'react/function-component-definition': [2, { namedComponents: 'function-declaration' }],
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-props-no-spreading': 0,
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 0,
    'react/require-default-props': 0,
  },
  overrides: [
    { files: '*.ts' },
  ],
};
