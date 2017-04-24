const webpack = require('webpack');
const { resolve } = require('path');

const argv = require('yargs')
  .usage('Usage: $0 [options]')
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
  .option('watch', {
    alias: 'w',
    describe: 'Start build in watch mode',
    type: 'boolean'
  })
  .option('aot', {
    alias: 'a',
    describe: 'Build with Angular AOT Compilation',
    type: 'boolean'
  })
  .option('verbose', {
    describe: 'Verbose output',
    type: 'boolean'
  })
  .help('help')
  .argv;

const env = argv.env || (argv.dev ? 'dev' : undefined) || (argv.prod ? 'prod' : undefined);

const webpackConfig = require(resolve(process.cwd(), "./webpack.config.js"))({
  env,
  aot: Boolean(argv.aot)
});

const compiler = webpack(webpackConfig);

if (argv.watch) {
  const watcher = compiler.watch({
      aggregateTimeout: 300, // wait so long for more changes
      poll: false // don't use polling instead of native watchers
    },
    buildCallback);

  process.on('SIGINT', () => {
    watcher.close(() => {
      process.exit(0);
    });
  });
} else {
  compiler.run(buildCallback);
}

function buildCallback(err, stats) {
  const outputOptions = {
    colors: true,
    hash: true,
    timings: true,
    version: true,
    assets: true,
    chunks: Boolean(argv.verbose),
    modules: Boolean(argv.verbose),
    cached: Boolean(argv.verbose),
    errorDetails: Boolean(argv.verbose)
  };

  if (err) {
    console.error(err);
    process.exit(1);
  } else if (stats.toJson().errors.length > 0) {
    stats.toJson().errors.forEach((err) => console.error(err));
  } else if (stats.toJson().warnings.length > 0) {
    stats.toJson().warnings.forEach((err) => console.warn(err));
  } else {
    console.log("Build successful");
  }

  console.log(stats.toString(outputOptions));
}