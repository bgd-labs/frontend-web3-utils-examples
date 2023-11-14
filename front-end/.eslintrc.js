module.exports = {
  extends: ['react-app', 'prettier', 'plugin:@next/next/recommended'],
  plugins: ['prettier', 'simple-import-sort'],
  rules: {
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prettier/prettier': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'warn',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/no-named-as-default': 'error',
    'import/no-unresolved': 'off',
    'react/self-closing-comp': 'warn',
  },
};
