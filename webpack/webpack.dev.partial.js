const { DefinePlugin, HotModuleReplacementPlugin} = require('webpack');
const { hostname } = require('os');

module.exports = function devConfig(env) {
  return {
    entry: {
      main: [
        "webpack/hot/dev-server",
        `webpack-dev-server/client?http://${env.devServerOptions.host || 'localhost'}:${env.devServerOptions.port || '8080'}/`
      ]
    },
    plugins: [
      new DefinePlugin({
        'HOSTNAME': JSON.stringify(hostname().toLowerCase()),
        'BACKEND_PORT': JSON.stringify(process.env.BACKEND_PORT)
      }),
      new HotModuleReplacementPlugin()
    ]
  };
};
