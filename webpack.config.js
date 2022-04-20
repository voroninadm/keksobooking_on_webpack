const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const isDev = process.env.NODE_ENV === 'development';
console.log(`Development mode is: ${isDev}`);

module.exports = {
  context: path.resolve(__dirname, 'source'),
  entry: {
    main: './js/main.js',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[contenthash].js',
    clean: true
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'build'),
    },
    compress: true,
    port: 9000
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html',
      inject: 'body'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    new CopyWebpackPlugin({
      patterns:
        [
          {
            from: path.resolve(__dirname, 'source/img/'),
            to: path.resolve(__dirname, 'build/img')
          },
          {
            from: path.resolve(__dirname, 'source/data/'),
            to: path.resolve(__dirname, 'build/data')
          },
          {
            from: path.resolve(__dirname, 'source/favicon.ico'),
            to: path.resolve(__dirname, 'build/favicon.ico')
          },
        ]
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"], //применение справа-налево
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: "asset",
        use: [
          {
            loader: ImageMinimizerPlugin.loader,
            options: {
              minimizer: {
                implementation: ImageMinimizerPlugin.imageminMinify,
                options: {
                  plugins: [
                    // "imagemin-gifsicle",
                    // "imagemin-jpegtran",
                    // "imagemin-optipng",
                    "imagemin-svgo",
                  ],
                },
              },
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      new CssMinimizerWebpackPlugin(),
      new TerserWebpackPlugin(),
    ],
  },
};
