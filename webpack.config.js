const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

console.log(`Development mode is: ${isDev}`);

module.exports = {
  context: path.resolve(__dirname, 'source'),
  entry: {
    main: './js/main.js',
    // leaflet: './leaflet/leaflet.js',
    // nouislider: './nouislider/nouislider.js',
    // pristine: './pristine/pristine.min.js'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[contenthash].js',
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
      // minify: {                            -- webpack already minify html
      //   collapseWhitespace: isProd
      // }
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    new CleanWebpackPlugin(),
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
            from: path.resolve(__dirname, 'source/leaflet'),
            to: path.resolve(__dirname, 'build/leaflet')
          },
          {
            from: path.resolve(__dirname, 'source/nouislider'),
            to: path.resolve(__dirname, 'build/nouislider')
          },
          {
            from: path.resolve(__dirname, 'source/pristine/'),
            to: path.resolve(__dirname, 'build/pristine')
          },
        ]
    })
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
          loader: MiniCssExtractPlugin.loader,
          options: {
            // hmr: IsDev
          }
          },
           "css-loader"], //применение справа-налево
      },
    ],
  },
};
