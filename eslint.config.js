import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    languageOptions: { globals: globals.browser },
    rules: {
      'no-use-before-define': ['error', {
        functions: false,
      }],
    },
  },
  pluginJs.configs.recommended,
];
