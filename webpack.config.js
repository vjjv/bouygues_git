const path = require('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
  entry: './src/main.js',

  output: {
    filename: 'packed.js',
    path: path.resolve(__dirname, 'docs'),
  },
  optimization: {
    minimize: false
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'docs'),
    },
    client: {
      overlay: false
    },
    compress: true,
    port: 9000,
  },
  resolve: {
    fallback: {
      "fs": false
    },
  },
  plugins: [
    new NodePolyfillPlugin()
  ]
};