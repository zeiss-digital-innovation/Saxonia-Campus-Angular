const { WebpackWarPlugin } = require('webpack-war-plugin');

module.exports = {
  plugins: [
    new WebpackWarPlugin({
      webInf: 'WEB-INF'
    })
  ]
};