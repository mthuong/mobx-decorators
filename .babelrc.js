module.exports = {
  presets: [
    ['@babel/env', {shippedProposals: true}],
  ],
  plugins: [
    '@babel/proposal-decorators',
    ['@babel/proposal-class-properties', {loose: true}],
    '@babel/proposal-export-default-from',
    '@babel/transform-runtime',
  ],
};