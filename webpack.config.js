const path = require('path')

module.exports = {
  entry: [
    path.join(__dirname, 'CMSGuias', 'media', 'js', 'serviceFactory.ts'),
    path.join(__dirname, 'CMSGuias', 'media', 'js', 'sales', 'costproject')
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true
        },
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  externals: {
    angular: 'angular'

  },
  output: {
    filename: 'costproject.bundle.js', // change name output
    path: path.resolve(__dirname, 'CMSGuias', 'media', 'js', 'sales') // './CMSGuias/media/js/sales' //path.resolve(__dirname, 'CMSGuias', 'media', 'js', 'sales')
  }
};
// const path = require('path')

// // console.log(path.join(__dirname, 'CMSGuias', 'media', 'js', 'serviceFactory.ts'))

// module.exports = {
//   entry: [
//     './CMSGuias/media/js/serviceFactory.ts',
//     './CMSGuias/media/js/sales/generalExpenses/expenses.controller.ts',
//     './CMSGuias/media/js/sales/generalExpenses/gexpenses.ts'
//     // path.join(__dirname, 'CMSGuias', 'media', 'js', 'serviceFactory.ts'),
//     // path.join(__dirname, 'CMSGuias', 'media', 'js', 'sales', 'generalExpenses', 'expenses.controller.ts'),
//     // path.join(__dirname, 'CMSGuias', 'media', 'js', 'sales', 'generalExpenses', 'gexpenses.ts')
//   ],
//   // module: {
//   //   rules: [{
//   //     test: /\.tsx?$/,
//   //     // include: [
//   //     //   path.resolve(__dirname, 'CMSGuias', 'media', 'js')
//   //     // ],
//   //     exclude: [
//   //       path.resolve(__dirname, 'node_modules'),
//   //       path.resolve(__dirname, 'bower_components')
//   //     ],
//   //     loader: 'babel-loader!ts-loader',
//   //     query: {
//   //       presets: ['es2015']
//   //     }
//   //   }]
//   // },
//   resolve: {
//     extensions: [ ".tsx", ".ts", ".js" ]
//   },
//   output: {
//     filename: 'gexpenses.bundle.js',
//     path: './CMSGuias/media/js/sales' //path.resolve(__dirname, 'CMSGuias', 'media', 'js', 'sales')
//   },
//   devtool : 'source-map'
//   // devServer: {
//   //   publicPath: path.join('/dist/')
//   // }
// }