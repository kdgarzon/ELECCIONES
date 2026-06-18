module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'commonjs',
  },
  rules: {
    'no-console': 'warn',
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    eqeqeq: 'error',
    curly: 'error',
    'no-var': 'error',
    'prefer-const': 'error',
  },
};