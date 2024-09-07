module.exports = {
    env: {
      browser: true,
      es2021: true,
      //node: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:promise/recommended',
    ],
    parser: '@babel/eslint-parser',
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      requireConfigFile: false, // Required for using @babel/eslint-parser
    },
    plugins: [
      'import',
      'node',
      'promise',
    ],
    rules: {
      'import/order': ['error', { 'newlines-between': 'always' }],
      'node/no-unpublished-require': ['error', { allowModules: ['rollup'] }],
      'promise/always-return': 'error',
      'promise/catch-or-return': 'error',
      'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
      // Add or customize rules as needed
    },
  };