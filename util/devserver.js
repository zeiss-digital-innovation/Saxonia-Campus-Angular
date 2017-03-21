const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { resolve } = require('path');
const { readFileSync } = require('fs');

const argv = require('yargs')
  .usage('Usage: $0 [options]')
  .option('proxy-conf', {
    nargs: 1,
    describe: 'Set a proxy config via a file',
    type: 'string'
  })
  .option('env', {
    alias: 'e',
    nargs: 1,
    describe: 'Set the build environment',
    type: 'string'
  })
  .option('dev', {
    describe: 'Set the build environment to dev (same as "--env dev")',
    type: 'boolean'
  })
  .option('prod', {
    describe: 'Set the build environment to prod (same as "--env prod")',
    type: 'boolean'
  })
  .option('host', {
    alias: 'h',
    nargs: 1,
    describe: 'Set the target host',
    type: 'string'
  })
  .option('port', {
    alias: 'p',
    nargs: 1,
    describe: 'Set the target port',
    type: 'number'
  })
  .option('ssl', {
    alias: 's',
    describe: 'Enable ssl',
    type: 'boolean'
  })
  .option('ssl-key', {
    alias: 'k',
    nargs: 1,
    describe: 'Set the SSL key file',
    type: 'string'
  })
  .option('ssl-cert', {
    alias: 'c',
    nargs: 1,
    describe: 'Set the SSL certificate file',
    type: 'string'
  })
  .option('ssl-cacert', {
    nargs: 1,
    describe: 'Set the SSL cacert file',
    type: 'string'
  })
  .help('help')
  .argv;

const env = argv.env || (argv.dev ? 'dev' : undefined) || (argv.prod ? 'prod' : undefined);
const port = argv.port || 8080;
const host = argv.host || 'localhost';

const webpackConfig = require(resolve(process.cwd(), "./webpack.config.js"))({
  env,
  devServerOptions: {
    port,
    host
  }
});

const proxy = argv['proxy-conf'] ? require(resolve(process.cwd(), argv['proxy-conf'])) : {};

var compiler = webpack(webpackConfig);
var server = new WebpackDevServer(compiler, {
  hot: true,
  historyApiFallback: true,
  proxy,
  https: argv.ssl ? {
      cert: argv['ssl-cert'] ? readFileSync(resolve(process.cwd(), argv.sslCert)) : undefined,
      key: argv['ssl-key'] ? readFileSync(resolve(process.cwd(), argv.sslKey)) : undefined,
      cacert: argv['ssl-cacert'] ? readFileSync(resolve(process.cwd(), argv.sslCacert)) : undefined
    } : undefined
});


server.listen(port, host, () => console.log(`\nDevServer listening on ${host}:${port}\n`));
