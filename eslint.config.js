module.exports = [
  {
    files: ['popup.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        crypto: 'readonly',
        fetch: 'readonly',
        indexedDB: 'readonly',
        navigator: 'readonly',
        requestAnimationFrame: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        document: 'readonly',
        alert: 'readonly',
        console: 'readonly',
        Uint8Array: 'readonly',
        Uint32Array: 'readonly',
        TextEncoder: 'readonly',
        TextDecoder: 'readonly',
        URL: 'readonly',
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'no-redeclare': 'error',
      'eqeqeq': 'error',
      'no-constant-condition': 'warn',
    }
  }
];
