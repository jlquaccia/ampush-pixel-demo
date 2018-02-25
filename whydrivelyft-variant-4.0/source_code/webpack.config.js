var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var webpack = require('webpack');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');
var ES6Promise = require("es6-promise");
ES6Promise.polyfill();

var htmlMinifyConfig = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true
};

new webpack.ProvidePlugin({
  Promise: 'es6-promise-promise'
});

module.exports = {
  context: path.resolve('./app'),
  entry: {
    main: './js/main.js',
    blog: './js/blog.js',
    testimony: './js/testimony.js',
    experimenter: './js/experimenter.js',
    simpleform: './js/simpleform.js',
    faq: './js/faq.js'
  },
  output: {
    path: path.resolve('./dist/'),
    filename: 'js/[name].min.js',
    //chunkFilename: "[id].js", // Enable this if common chunk need to generate
    publicPath: ''
  },
  module: {
    // devtool: 'source-map',
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: [ 'es2015', 'stage-0' ]
      }
    },{
      test: /\.(scss|css)$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader', { publicPath: '../' })
    },{
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]'
    },{
      test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file?name=fonts/[name].[ext]'
    },{
      test: /\.(jpe?g|png|gif|svg)$/,
      loader: 'file?name=img/[name].[ext]'
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: 'index.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      template: 'signup-form-r4.html',
      filename: 'signup-form-r4.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new CleanWebpackPlugin(['dist']),
    // Enable below block of code if common chunk need to generate
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: "commons",
    //   filename: "./js/commons.js"
    // }),
    new ExtractTextPlugin('./css/[name].min.css'/*, { allChunks: true }*/),
    new BrowserSyncPlugin({
      server: {
        baseDir: ['dist']
      },
      port: 3000,
      host: 'localhost',
      open: false
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css|html)$/,
      threshold: 10240,
      minRatio: 0
    }),
    new CopyWebpackPlugin([{
      from: './img/**/*',
      to: './'
    },{
      from: './video/**/*',
      to: './'
    }])
  ]
}
