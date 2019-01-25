
/*
    WEBPACK CONFIGURATION VARIABLES
*/
// ========================================================
// DEVELOPER TO CHANGE
// ========================================================

const hostURL = "localhost";
const hostPORT = "8585";

//- -------------------------------------------------------

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  entry: [__dirname + "/../entry.js"],
  // devtool: "source-map" make all your loaders be allowed to create a map during compile
  // good for debugging
  devtool: "source-map",
  // tells where your webpack-dev-server where to watch for changes
  devServer: {
    /*
     BUG NOTE: "webpack-dev-server": "3.1.0"  Do not update this version in the package.json. Until fixed.
          Description: If you use later/latest version of the webpackdevserver. You will get an error of "cannot /get" when you are using webpackdevserver
     */
    contentBase:[__dirname+"/../public/"],
    host: hostURL,
    port: hostPORT
  },
  output: {
    // where to put the bundle.js , but to use webpack-dev-server properly
    // use the path to public and just change the filename: to /path/bundle.js
    path: __dirname + "/../public/",
    /* 
    --------
    used by plugins , mainly for production.
    publicPath: "http://mysite.com/"
    --------
    for eg. in your css you have url(./img.jpg) => url(http://mysite.com)
    publicPath: "/",
    */

    filename: "assets/js/bundle[hash].js"
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({})]
  },
  module: {
    rules: [
      {
        /*
          Take note ONLY 1 test for file.
        */
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "resolve-url-loader",
            options: {
              debug: true
            }
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [require("autoprefixer")]
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader!resolve-url-loader"
      },
      {
        test: /\.(png|jpg|gif|eot|woff2|svg|ttf|woff)$/,
        loader: "url-loader",
        options: {
          limit: 2000,
          outputPath: "assets/img/", // Where to put any resource file
          publicPath: "../img/", // This will change the URL for the CSS. As the URL in css is relative to the CSS file itself not the document.
          fallback: "file-loader" // Will encode any files lower than 2KB = 2000 otherwise use FILE-LOADER which should be installed as well and will pass the same OPTIONS to the fallback.
        }
      },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["@babel/preset-env", "@babel/preset-react","@babel/preset-flow"],
          plugins: []
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "assets/css/style[hash].css"
    }),
    new HtmlWebpackPlugin({
      template: __dirname + "/../src/index.html",
      inject: "body"
    })
  ]
};
