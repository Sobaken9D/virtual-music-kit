const path = require("node:path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    main: [path.join(__dirname, './src/js/main.js'), path.join(__dirname, './src/sass/style.scss')],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(html)$/,
        use: ['html-loader']
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src', 'html', 'index.html'),
      chunks: ['main']
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css",
      chunkFilename: "css/[name].[contenthash:8].css",
    }),
    new CopyPlugin({
      patterns: [
        {from: "src/assets/sounds", to: "assets/sounds"},
      ],
    })
  ],
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: './src',
      watch: true
    },
    open: true,
    port: 8060,
  },
};