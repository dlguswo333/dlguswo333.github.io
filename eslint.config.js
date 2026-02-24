import {defineConfig, globalIgnores} from 'eslint/config';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import parser from 'svelte-eslint-parser';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import stylistic from '@stylistic/eslint-plugin';
import {dirname} from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig([
  globalIgnores(['build', '.svelte-kit']),
  {
    basePath: __dirname,
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
      'indent': ['error', 2],
      'svelte/indent': ['error', {
        indent: 2,
      }],
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
        'functions': 'never',
      }],
      'object-curly-spacing': 'error',
      'space-before-function-paren': ['error', 'always'],
      'space-before-blocks': ['error', 'always'],
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
