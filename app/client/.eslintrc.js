module.exports = {
  env: {
    browser: true,
    amd: false,
    node: false,
    commonjs: true,
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
  },
};
