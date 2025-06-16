module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // Permitir any em alguns casos específicos
    '@typescript-eslint/no-explicit-any': 'warn',
    // Permitir variáveis não utilizadas em alguns casos
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      ignoreRestSiblings: true 
    }],
    // Permitir Function type em alguns casos
    '@typescript-eslint/no-unsafe-function-type': 'warn',
    // Reduzir severidade de alguns problemas
    'no-case-declarations': 'warn',
    'prefer-const': 'warn',
    'no-var': 'error',
    'no-useless-escape': 'warn',
    'prefer-rest-params': 'warn',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
  },
}; 