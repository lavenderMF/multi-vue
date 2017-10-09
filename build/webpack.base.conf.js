var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

var glob = require('glob');
var entries =  utils.getMultiEntry('./src/'+config.moduleName+'/**/**/*.js'); // 获得入口js文件
var chunks = Object.keys(entries);
console.log(chunks);
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var vueCssChunks = new ExtractTextPlugin('css/[name].css');

const extractCommonCss = new ExtractTextPlugin('css/vendor.[hash:3].css');

var projectRoot = path.resolve(__dirname, '../')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

var webpackConfig = {
  entry: entries,
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
    // vue文件单独处理出样式
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders:{
            css:vueCssChunks.extract({
              use:[
              'css-loader'
              ],
              fallback:'vue-style-loader'
            }),
            less:vueCssChunks.extract({
              use:[
              { loader:'css-loader'},
              {
                loader:'less-loader',
                // options:{
                //   globalVars:utils.getLessVariables()
                // }
              }
              ],
              fallback:'vue-style-loader'
            }),
          }
        }
      },
      // 入口的公共样式提取，只会提取一次一个入口的公共样式
      {
        test: /\.css$/,
        include: [resolve('src/assets/css/'),resolve('node_modules/')],
        exclude: function (path) {

        },
        loaders: extractCommonCss.extract({
          use: ['css-loader'],
        })

      },

      {
        test: /\.less$/,
        include: [resolve('src/assets/css/')],
        exclude: function (path) {

        },
        loaders: extractCommonCss.extract({
          use:[
          { loader:'css-loader'},
          {
            loader:'less-loader',
            // options:{
            //   globalVars:utils.getLessVariables()
            // }
          }
          ],
        })

      },
      // {
      //   test: /\.vue$/,
      //   loader: 'vue-loader',
      //   options: vueLoaderConfig
      // },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
      extractCommonCss,
      vueCssChunks
  ]
}

module.exports = webpackConfig;