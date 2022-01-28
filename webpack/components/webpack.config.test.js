const webpack = require('webpack')
const webpackConfigBase = require('./webpack.config.base.js')

const config = Object.assign(webpackConfigBase.config, {
  // sourcemap 模式
  mode: 'development',
  devtool: '#inline-source-map',
  resolve: Object.assign(webpackConfigBase.config.resolve, {
    alias: Object.assign(webpackConfigBase.config.resolve.alias, {
      // https://github.com/vuejs-templates/webpack/issues/215#issuecomment-238095102
      vue: 'vue/dist/vue.js'
    })
  }),
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
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            // Use cache carefully 😤It will cache although you have changed .browserslistrc sometimes.
            options: { cacheDirectory: true }
          },
          { loader: 'eslint-loader', options: { cache: true } }
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
    // 定义全局常量
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"test"'
      }
    }),
    webpackConfigBase.VueLoaderPluginInstance
  ]
})
// 编译css
config.module.rules.push({
  test: /\.(css|scss)$/,
  use: [
    'vue-style-loader',
    'css-loader',
    'postcss-loader',
    'sass-loader'
  ]
})

// no need for app entry during tests
delete config.entry

module.exports = config