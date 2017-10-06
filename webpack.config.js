const path = require('path');
module.exports = {
  entry: [
    path.join(__dirname, 'app', 'index')
  ],
  output: {
    filename: 'expenses.bundle.js',
    path: path.resolve(__dirname, 'CMSGuias', 'media', 'js', 'sales')
  },
  module: {
    rules: [{
      test: /.ts?$/,
      // include: [
      //   path.resolve(__dirname, 'app')
      // ],
      exclude: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, 'bower_components')
      ],
      loader: 'babel-loader!ts-loader',
      query: {
        presets: ['es2015']
      }
    }]
  },
  resolve: {
    extensions: ['.json', '.js', '.ts', '.css']
  },
  devtool: 'inline-source-map',
  // devServer: {
  //   publicPath: path.join('/dist/')
  // }
};