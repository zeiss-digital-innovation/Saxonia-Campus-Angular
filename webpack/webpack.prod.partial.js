const { WebpackWarPlugin } = require('webpack-war-plugin');
const { EnvironmentPlugin, HashedModuleIdsPlugin } = require('webpack');
const { SuppressExtractedTextChunksWebpackPlugin } = require('@angular/cli/plugins/webpack');
const { UglifyJsPlugin } = require('webpack').optimize;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
  devtool: false,
  output: {
    "path": path.join(process.cwd(), "dist"),
    "filename": "[name].[chunkhash:20].bundle.js",
    "chunkFilename": "[id].[chunkhash:20].chunk.js"
  },
  plugins: [
    new WebpackWarPlugin({
      webInf: 'WEB-INF'
    }),
    new ExtractTextPlugin({
      "filename": "[name].[contenthash:20].bundle.css"
    }),
    new SuppressExtractedTextChunksWebpackPlugin(),
    new EnvironmentPlugin({
      "NODE_ENV": "production"
    }),
    new HashedModuleIdsPlugin({
      "hashFunction": "md5",
      "hashDigest": "base64",
      "hashDigestLength": 4
    }),
    new UglifyJsPlugin({
      "mangle": {
        "screw_ie8": true
      },
      "compress": {
        "screw_ie8": true,
        "warnings": false
      },
      "sourceMap": false
    }),
  ]
};
