let path = require('path');

module.exports = {
  entry: './src/app.ts',
  devtool: "source-map",
  output: {
    filename: 'jsnes.js',
    path: path.resolve(__dirname, 'dist')
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  }
};
