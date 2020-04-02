const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  plugins: [ new HtmlWebpackPlugin({ template: './src/index.pug', }) ],
  module: {
    rules: [
      { test: /\.pug$/, loader: 'pug-loader' },
      { test: /\.scss$/,
        use: [
          // Creates `style` nodes from JS strings
          {loader: 'style-loader', options: {injectType: 'styleTag'}},
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
			},
		],
  },
};
