const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, 'source'),
  entry: {
    main: './js/main.js',
    leaflet: './leaflet/leaflet.js',
    nouislider: './nouislider/nouislider.js',
    pristine: './pristine/pristine.min.js'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[contenthash].js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    openPage: './index.html',
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html'
    }),
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
};
