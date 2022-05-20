'use strict';

const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
  entry: './src/index.ts',
	output: {
		clean: true,
		filename: '[name].[contenthash].js',
    hashDigestLength: 8,
	},
	module: {
		rules: [
			{
				test: /\.[jt]s$/,
				exclude: /node_modules/,
				use: 'babel-loader',
			},
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          { loader: 'sass-loader', options: { sassOptions: { quietDeps: true } } },
        ],
      },
		],
	},
  resolve: {
    extensions: ['.js', '.ts'],
  },
	plugins: [
		new HtmlPlugin(),
	],
};
