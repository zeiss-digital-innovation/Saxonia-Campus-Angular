"use strict";
const path = require('path');
const { resolve } = path;
const { existsSync } = require('fs');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');
const merge = require('webpack-merge');

const { NoEmitOnErrorsPlugin, LoaderOptionsPlugin } = require('webpack');
const { GlobCopyWebpackPlugin, BaseHrefWebpackPlugin } = require('@angular/cli/plugins/webpack');
const { CommonsChunkPlugin } = require('webpack').optimize;
const { AotPlugin } = require('@ngtools/webpack');

const nodeModules = path.join(process.cwd(), 'node_modules');
const entryPoints = ["inline", "polyfills", "sw-register", "scripts", "styles", "vendor", "main"];
const baseHref = undefined;
const deployUrl = undefined;

const webpack = require('webpack');
const {NormalModuleReplacementPlugin} = webpack;


module.exports = function config(env) {
  env = env || {};
  const config = {
    "devtool": "source-map",
    "resolve": {
      "extensions": [
        ".ts",
        ".js"
      ],
      "modules": [
        "./node_modules"
      ]
    },
    "resolveLoader": {
      "modules": [
        "./node_modules"
      ]
    },
    "entry": {
      "main": [
        "./src/main.ts"
      ],
      "polyfills": [
        "./src/polyfills.ts"
      ],
      "scripts": [
        "script-loader!./node_modules/jquery/dist/jquery.js",
        "script-loader!./node_modules/tether/dist/js/tether.js",
        "script-loader!./node_modules/bootstrap/dist/js/bootstrap.js"
      ],
      "styles": [
        "./src/styles.css"
      ]
    },
    "output": {
      "path": path.join(process.cwd(), "dist"),
      "filename": "[name].bundle.js",
      "chunkFilename": "[id].chunk.js"
    },
    "module": {
      "rules": [
        {
          "enforce": "pre",
          "test": /\.js$/,
          "loader": "source-map-loader",
          "exclude": [
            /\/node_modules\//
          ]
        },
        {
          "test": /\.json$/,
          "loader": "json-loader"
        },
        {
          "test": /\.html$/,
          "loader": "raw-loader"
        },
        {
          "test": /\.(eot|svg)$/,
          "loader": "file-loader?name=[name].[hash:20].[ext]"
        },
        {
          "test": /\.(jpg|png|gif|otf|ttf|woff|woff2|cur|ani)$/,
          "loader": "url-loader?name=[name].[hash:20].[ext]&limit=10000"
        },
        {
          "exclude": [
            path.join(process.cwd(), "src/styles.css")
          ],
          "test": /\.css$/,
          "loaders": [
            "exports-loader?module.exports.toString()",
            "css-loader?{\"sourceMap\":false,\"importLoaders\":1}",
            "postcss-loader"
          ]
        },
        {
          "exclude": [
            path.join(process.cwd(), "src/styles.css")
          ],
          "test": /\.scss$|\.sass$/,
          "loaders": [
            "exports-loader?module.exports.toString()",
            "css-loader?{\"sourceMap\":false,\"importLoaders\":1}",
            "postcss-loader",
            "sass-loader"
          ]
        },
        {
          "exclude": [
            path.join(process.cwd(), "src/styles.css")
          ],
          "test": /\.less$/,
          "loaders": [
            "exports-loader?module.exports.toString()",
            "css-loader?{\"sourceMap\":false,\"importLoaders\":1}",
            "postcss-loader",
            "less-loader"
          ]
        },
        {
          "exclude": [
            path.join(process.cwd(), "src/styles.css")
          ],
          "test": /\.styl$/,
          "loaders": [
            "exports-loader?module.exports.toString()",
            "css-loader?{\"sourceMap\":false,\"importLoaders\":1}",
            "postcss-loader",
            "stylus-loader?{\"sourceMap\":false,\"paths\":[]}"
          ]
        },
        {
          "include": [
            path.join(process.cwd(), "src/styles.css")
          ],
          "test": /\.css$/,
          "loaders": ExtractTextPlugin.extract({
            "use": [
              "css-loader?{\"sourceMap\":false,\"importLoaders\":1}",
              "postcss-loader"
            ],
            "fallback": "style-loader",
            "publicPath": ""
          })
        },
        {
          "include": [
            path.join(process.cwd(), "src/styles.css")
          ],
          "test": /\.scss$|\.sass$/,
          "loaders": ExtractTextPlugin.extract({
            "use": [
              "css-loader?{\"sourceMap\":false,\"importLoaders\":1}",
              "postcss-loader",
              "sass-loader"
            ],
            "fallback": "style-loader",
            "publicPath": ""
          })
        },
        {
          "include": [
            path.join(process.cwd(), "src/styles.css")
          ],
          "test": /\.less$/,
          "loaders": ExtractTextPlugin.extract({
            "use": [
              "css-loader?{\"sourceMap\":false,\"importLoaders\":1}",
              "postcss-loader",
              "less-loader"
            ],
            "fallback": "style-loader",
            "publicPath": ""
          })
        },
        {
          "include": [
            path.join(process.cwd(), "src/styles.css")
          ],
          "test": /\.styl$/,
          "loaders": ExtractTextPlugin.extract({
            "use": [
              "css-loader?{\"sourceMap\":false,\"importLoaders\":1}",
              "postcss-loader",
              "stylus-loader?{\"sourceMap\":false,\"paths\":[]}"
            ],
            "fallback": "style-loader",
            "publicPath": ""
          })
        },
        {
          "test": /\.ts$/,
          "loader": "@ngtools/webpack"
        }
      ]
    },
    "plugins": [
      new NoEmitOnErrorsPlugin(),
      new GlobCopyWebpackPlugin({
        "patterns": [
          "assets",
          "favicon.ico"
        ],
        "globOptions": {
          "cwd": path.resolve(__dirname, 'src'),
          "dot": true,
          "ignore": "**/.gitkeep"
        }
      }),
      new ProgressPlugin(),
      new HtmlWebpackPlugin({
        "template": "./src/index.html",
        "filename": "./index.html",
        "hash": false,
        "inject": true,
        "compile": true,
        "favicon": false,
        "minify": false,
        "cache": true,
        "showErrors": true,
        "chunks": "all",
        "excludeChunks": [],
        "title": "Webpack App",
        "xhtml": true,
        "chunksSortMode": function sort(left, right) {
          let leftIndex = entryPoints.indexOf(left.names[0]);
          let rightindex = entryPoints.indexOf(right.names[0]);
          if (leftIndex > rightindex) {
            return 1;
          }
          else if (leftIndex < rightindex) {
            return -1;
          }
          else {
            return 0;
          }
        }
      }),
      new BaseHrefWebpackPlugin({}),
      new CommonsChunkPlugin({
        "name": "inline",
        "minChunks": null
      }),
      new CommonsChunkPlugin({
        "name": "vendor",
        "minChunks": (module) => module.resource && module.resource.startsWith(nodeModules),
        "chunks": [
          "main"
        ]
      }),
      new ExtractTextPlugin({
        "filename": "[name].bundle.css",
        "disable": true
      }),
      new LoaderOptionsPlugin({
        "sourceMap": false,
        "options": {
          "postcss": [
            autoprefixer(),
            postcssUrl({
              "url": (URL) => {
                // Only convert absolute URLs, which CSS-Loader won't process into require().
                if (!URL.startsWith('/')) {
                  return URL;
                }
                // Join together base-href, deploy-url and the original URL.
                // Also dedupe multiple slashes into single ones.
                return `/${baseHref || ''}/${deployUrl || ''}/${URL}`.replace(/\/\/+/g, '/');
              }
            })
          ],
          "sassLoader": {
            "sourceMap": false,
            "includePaths": []
          },
          "lessLoader": {
            "sourceMap": false
          },
          "context": ""
        }
      }),
      new AotPlugin({
        "mainPath": "main.ts",
        "exclude": [],
        "tsConfigPath": "src/tsconfig.app.json",
        "skipCodeGeneration": env.aot
      }),
      new NormalModuleReplacementPlugin(
        /environments\/environment/,
        env.env && env.env != 'dev' ? resolve('src', `environments/environment.${env.env}.ts`) : resolve('src', "environments/environment.ts")
      )
    ],
    "node": {
      "fs": "empty",
      "global": true,
      "crypto": "empty",
      "tls": "empty",
      "net": "empty",
      "process": true,
      "module": false,
      "clearImmediate": false,
      "setImmediate": false
    }

  };

  const partialPath = resolve(process.cwd(), 'webpack', `webpack.${env.env}.partial.js`);
  if (existsSync(partialPath)) {
    const partial = require(partialPath);

    return (partial instanceof Function) ? merge(config, partial(env)) : merge(config, partial);
  } else {
    return config;
  }
};
