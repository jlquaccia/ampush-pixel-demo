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
var fs = require('fs');
var glob = require('glob');
var realContentFolderPath = fs.realpathSync(__dirname + '/app/');
var pages = glob.sync(realContentFolderPath + '*.html');

var mainNav = fs.readFileSync('app/main-nav.html', { encoding: 'utf8' });
var footer = fs.readFileSync('app/footer.html', { encoding: 'utf8' });
var flyout= fs.readFileSync('app/flyout-form.html', { encoding: 'utf8' });
var promoBar= fs.readFileSync('app/promo-bar.html', { encoding: 'utf8' });
var google_analytics= fs.readFileSync('app/google-analytics.html', { encoding: 'utf8' });

var generatePage = template => {
  const pageContent = fs.readFileSync(template, { encoding: 'utf-8' });
  return pageContent.replace('{# MAIN_NAV #}', mainNav)
                    .replace('{# FOOTER #}', footer)
                    .replace('{# FLYOUT-FORM #}', flyout)
                    .replace('{# PROMO-BAR #}', promoBar)
                    .replace('{# GOOGLE_ANALYTICS_CODE #}', google_analytics);
}


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
      templateContent: generatePage('app/index.html'),
      filename: 'index.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/index-1.html'),
      filename: 'index-1.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/index-2.html'),
      filename: 'index-2.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/terms.html'),
      filename: 'terms.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/verify-phone.html'),
      filename: 'verify-phone.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/tipping-hints-maximize-your-lyft-revenue-hc-a.html'),
      filename: 'tipping-hints-maximize-your-lyft-revenue-hc-a.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/tipping-hints-maximize-your-lyft-revenue-hc-b.html'),
      filename: 'tipping-hints-maximize-your-lyft-revenue-hc-b.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/tipping-hints-maximize-your-lyft-revenue-hc-c.html'),
      filename: 'tipping-hints-maximize-your-lyft-revenue-hc-c.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/worth-it-to-drive-into-the-city.html'),
      filename: 'worth-it-to-drive-into-the-city.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/10-best-cities-to-drive-for-lyft-hc-a.html'),
      filename: '10-best-cities-to-drive-for-lyft-hc-a.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/10-best-cities-to-drive-for-lyft-hc-b.html'),
      filename: '10-best-cities-to-drive-for-lyft-hc-b.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/5-ways-to-maximize-your-hourly-driving-with-lyft-hc-a.html'),
      filename: '5-ways-to-maximize-your-hourly-driving-with-lyft-hc-a.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/5-ways-to-maximize-your-hourly-driving-with-lyft-hc-b.html'),
      filename: '5-ways-to-maximize-your-hourly-driving-with-lyft-hc-b.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/5-reasons-driving-for-lyft-is-better-than-getting-job-a.html'),
      filename: '5-reasons-driving-for-lyft-is-better-than-getting-job-a.html',
      inject: false,
      minify: htmlMinifyConfig
    }),

    new HtmlWebpackPlugin({
      templateContent: generatePage('app/4-ways-make-new-city-home-hc-a.html'),
      filename: '4-ways-make-new-city-home-hc-a.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/hitting-road-retirement-hc-a.html'),
      filename: 'hitting-road-retirement-hc-a.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/driving-lyft-holiday-season-hc-a.html'),
      filename: 'driving-lyft-holiday-season-hc-a.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/testimony.html'),
      filename: 'testimony.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/driver-promotion-a.html'),
      filename: 'driver-promotion-a.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/driver-promotion-b.html'),
      filename: 'driver-promotion-b.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/signup-form-r4.html'),
      filename: 'signup-form-r4.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/signup-form-mmm.html'),
      filename: 'signup-form-mmm.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      template: 'faq.html',
      templateContent: generatePage('app/faq.html'),
      filename: 'faq.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/how-to-skip-the-job-search-and-start-earning-fast.html'),
      filename: 'how-to-skip-the-job-search-and-start-earning-fast.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/how-to-not-be-broke-in-college.html'),
      filename: 'how-to-not-be-broke-in-college.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/blog.html'),
      filename: 'blog.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/driver-testimony-a.html'),
      filename: 'driver-testimony-a.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/derrick_austin_2000in5days.html'),
      filename: 'derrick_austin_2000in5days.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/driver-testimony-b.html'),
      filename: 'driver-testimony-b.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/reginald_cleveland_morefares.html'),
      filename: 'reginald_cleveland_morefares.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/driver-testimony-c.html'),
      filename: 'driver-testimony-c.html',
      inject: false,
       minify: htmlMinifyConfig
    }),
     new HtmlWebpackPlugin({
      templateContent: generatePage('app/efrain_newyork_flexible.html'),
      filename: 'efrain_newyork_flexible.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/driver-testimony-d.html'),
      filename: 'driver-testimony-d.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/emily_newyork_paybills.html'),
      filename: 'emily_newyork_paybills.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/driver-testimony-e.html'),
      filename: 'driver-testimony-e.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/kristin_sandiego_livework.html'),
      filename: 'kristin_sandiego_livework.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/driver-testimony-f.html'),
      filename: 'driver-testimony-f.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/amanda_phoenix_moneyfast.html'),
      filename: 'amanda_phoenix_moneyfast.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/driver-testimony-g.html'),
      filename: 'driver-testimony-g.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/mark_miami_ownbusiness.html'),
      filename: 'mark_miami_ownbusiness.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/why-more-people-freelance.html'),
      filename: 'why-more-people-freelance.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/how-it-works.html'),
      filename: 'how-it-works.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/privacy-policy.html'),
      filename: 'privacy-policy.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    new HtmlWebpackPlugin({
      templateContent: generatePage('app/accelerate.html'),
      filename: 'accelerate.html',
      inject: false,
      minify: htmlMinifyConfig
    }),
    ...(function() {
      return pages.map(page => {
        return new HtmlWebpackPlugin({
            template: page.replace(/^.*[\\\/]/, ''),
            filename: page.replace(/^.*[\\\/]/, ''),
            inject: false,
            minify: htmlMinifyConfig
          })
        }
      );
    })(),
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
