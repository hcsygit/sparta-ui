const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpackConfigBase = require('./webpack.config.base.js')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const extractCSS =
  new MiniCssExtractPlugin(
    {
      filename: 'index.css'
    }
  )

// webpack配置
const config = Object.assign(webpackConfigBase.config, {
  mode: 'production',
  entry: {
    index: webpackConfigBase.resolve('index.js')
  },
  output: {
    path: webpackConfigBase.resolve('../lib'),
    filename: 'index.js',
    library: 'sparta',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this'
  },
  externals: {
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue'
    }
  },
  optimization: {
    // 压缩js
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true
      }),
      new OptimizeCSSAssetsPlugin()
    ]
  },
  // loaders处理
  module: {
    noParse: /^vue$/,
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'img/[name].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        loader: 'file-loader',
        options: {
          name: 'font/[name].[ext]'
        }
      },
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: [
          'babel-loader',
          'eslint-loader'
        ]
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    // make sure to include the plugin for the magic
    webpackConfigBase.VueLoaderPluginInstance,
    // Scope hosting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // 删除build文件夹
    new CleanWebpackPlugin(
      'lib',
      {
        root: webpackConfigBase.resolve('../')
      }
    ),
    // 抽离出css
    extractCSS,
    // 定义全局常量
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ]
})

module.exports = config