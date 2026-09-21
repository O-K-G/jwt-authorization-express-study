// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import { defineConfig } from 'eslint/config'; // Import the modern core utility

export default defineConfig([
  // 1. Globally ignore built assets and dependencies
  {
    ignores: ['dist/**', 'node_modules/**', 'eslint.config.mjs'],
  },

  // 2. Base Configuration for all JavaScript and TypeScript files
  {
    files: ['**/*.{js,ts}'],
    extends: [
      eslint.configs.recommended,          // Core ESLint rules
      ...tseslint.configs.recommended,     // Strongly typed TypeScript rules
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser,             // Processes TS files into modern nodes
      parserOptions: {
        projectService: true,              // Automatically locates and updates your tsconfig.json configurations
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,                   // Essential backend variables (process, etc.)
      },
    },
    rules: {
      // Custom Project Rule Adjustments
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',                 // Critical for readable server logging
      'object-shorthand': ['error', 'always']
    },
  },
]);
