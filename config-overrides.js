const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    fallback: {
      ...config.resolve?.fallback,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      assert: require.resolve('assert'),
      buffer: require.resolve('buffer'),
      util: require.resolve('util'),
      process: require.resolve('process'),
      path: require.resolve('path-browserify'),
      fs: false,
      vm: require.resolve('vm-browserify'),
    },
  };

  config.plugins = [
    ...(config.plugins || []),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process',
    }),
  ];
    
  config.ignoreWarnings = [/Failed to parse source map/];
  return config;
};


// const webpack = require('webpack');

// module.exports = function override(config) {
//   // Exclude face-api.js from being processed by the source-map-loader
//   const sourceMapLoaderRule = config.module.rules.find(
//     (rule) => rule.use && rule.use.includes('source-map-loader')
//   );

//   if (sourceMapLoaderRule) {
//     sourceMapLoaderRule.exclude = [/node_modules\/face-api.js/];
//   }

//   // Fallback settings (your existing config)
//   config.resolve = {
//     ...config.resolve,
//     fallback: {
//       ...config.resolve?.fallback,
//       crypto: require.resolve('crypto-browserify'),
//       stream: require.resolve('stream-browserify'),
//       assert: require.resolve('assert'),
//       buffer: require.resolve('buffer'),
//       util: require.resolve('util'),
//       process: require.resolve('process'),
//       path: require.resolve('path-browserify'),
//       fs: false,
//       vm: require.resolve('vm-browserify'),
//     },
//   };

//   // Providing plugins
//   config.plugins = [
//     ...(config.plugins || []),
//     new webpack.ProvidePlugin({
//       Buffer: ['buffer', 'Buffer'],
//       process: 'process',
//     }),
//   ];

//   return config;
// };


// const webpack = require('webpack');

// module.exports = function override(config) {
//   // Disable source map loader for face-api.js
//   const sourceMapLoaderRule = config.module.rules.find(
//     (rule) => rule.use && rule.use.includes('source-map-loader')
//   );

//   if (sourceMapLoaderRule) {
//     sourceMapLoaderRule.exclude = [/node_modules\/face-api.js/];
//   }

//   // Disabling any source map generation for face-api.js files
//   config.devtool = config.devtool === 'source-map' 
//     ? false // Disable source maps completely if you have 'source-map' in devtool
//     : config.devtool;

//   // Fallback settings
//   config.resolve = {
//     ...config.resolve,
//     fallback: {
//       ...config.resolve?.fallback,
//       crypto: require.resolve('crypto-browserify'),
//       stream: require.resolve('stream-browserify'),
//       assert: require.resolve('assert'),
//       buffer: require.resolve('buffer'),
//       util: require.resolve('util'),
//       process: require.resolve('process'),
//       path: require.resolve('path-browserify'),
//       fs: false,
//       vm: require.resolve('vm-browserify'),
//     },
//   };

//   // Providing plugins
//   config.plugins = [
//     ...(config.plugins || []),
//     new webpack.ProvidePlugin({
//       Buffer: ['buffer', 'Buffer'],
//       process: 'process',
//     }),
//   ];
//   // config.ignoreWarnings = [/Failed to parse source map/];
//   return config;
// };
