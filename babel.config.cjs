module.exports = {
  presets: ['@babel/preset-typescript'],
  sourceMaps: true,
  // Comment the below out to use typescript decorators
  plugins: [['@babel/plugin-proposal-decorators', { version: '2021-12', decoratorsBeforeExport: true }]],
};
