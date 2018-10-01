const webpack = require("webpack");
const path = require("path");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssets = require("optimize-css-assets-webpack-plugin");
const DashboardPlugin = require("webpack-dashboard/plugin");

let config = {
    entry: "./src/main.js",
    output: {
      path: path.resolve(__dirname, "./public"),
      filename: "./bundle.js"
    },
    module: {
        rules: [{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader"
        },{
		  test: /\.scss$/,
		  loader: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader']
		},
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
          }
          // other vue-loader options go here
        }
      }]
      },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
      plugins: [
		  //new ExtractTextWebpackPlugin("styles.css"),
		  new UglifyJSPlugin(),
		  new DashboardPlugin()
		]
  }
  
  module.exports = config;
if (process.env.NODE_ENV === 'production') {
  module.exports.plugins.push(
    //new webpack.optimize.UglifyJsPlugin(),
    new OptimizeCSSAssets(),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  );
}else{
  module.exports.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: false
    })
  );
}
