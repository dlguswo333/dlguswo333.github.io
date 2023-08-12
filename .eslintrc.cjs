/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:svelte/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  ignorePatterns: ['*.js', '*.cjs'],
  rules: {
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'space-infix-ops': 'error',
    'keyword-spacing': 'error',
    'eol-last': 'error',
    'comma-dangle': ['error', {
      'arrays': 'never',
      'objects': 'always-multiline',
      'imports': 'never',
      'exports': 'never',
      'functions': 'never'
    }],
    'object-curly-spacing': 'error',
    'space-before-function-paren': ['error', 'always'],
    'space-before-blocks': ['error', 'always'],
    'arrow-spacing': 'error',
    '@typescript-eslint/type-annotation-spacing': ['error', {
      before: false,
      after: true,
      overrides: {
        arrow: {before: true, after: true}
      }
    }],
  },
  overrides: [
    {
      files: ["*.svelte"],
      parser: "svelte-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
    },
  ],
};
