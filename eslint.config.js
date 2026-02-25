import {defineConfig, globalIgnores} from 'eslint/config';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import parser from 'svelte-eslint-parser';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
  globalIgnores(['build', '.svelte-kit']),
  {
    extends: [
      'js/recommended',
      '@typescript-eslint/recommended',
      'svelte/recommended'
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tsParser,
    },
    plugins: {
      js,
      '@typescript-eslint': typescriptEslint,
      '@stylistic': stylistic,
      'svelte': svelte,
    },
    rules: {
      '@stylistic/indent': ['error', 2],
      'svelte/indent': ['error', {
        indent: 2,
      }],
      // This is too aggresive and svelte throws an error during the build if the internal link is not valid anyway.
      // https://github.com/sveltejs/eslint-plugin-svelte/issues/1314
      'svelte/no-navigation-without-resolve': 'off',
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/keyword-spacing': 'error',
      '@stylistic/eol-last': 'error',
      '@stylistic/comma-dangle': ['error', {
        'arrays': 'never',
        'objects': 'always-multiline',
        'imports': 'never',
        'exports': 'never',
        'functions': 'never',
      }],
      '@stylistic/object-curly-spacing': 'error',
      '@stylistic/space-before-function-paren': ['error', 'always'],
      '@stylistic/space-before-blocks': ['error', 'always'],
      '@stylistic/arrow-spacing': ['error', {
        before: true,
        after: true,
      }],
      '@stylistic/type-annotation-spacing': ['error', {
        before: false,
        after: true,
        overrides: {
          arrow: 'ignore',
        },
      }],
      '@typescript-eslint/no-unused-vars': ['error', {
        'varsIgnorePattern': '^_',
        'argsIgnorePattern': '^_',
      }],
    },
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: parser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  }
]);
