module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    'prettier/prettier': 'error',
    'class-methods-use-this': 'off', // Não usa this nos métodos das classes
    'no-param-reassign': 'off', // Permite que receba parâmetro e faça alterações
    camelcase: 'off', // Formato de variável
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }] // Não reclamar da variável não utilizada
  }
};
