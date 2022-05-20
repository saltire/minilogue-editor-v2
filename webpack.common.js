'use strict';

const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
	output: {
		clean: true,
		filename: '[name].[contenthash].js',
    hashDigestLength: 8,
	},
	module: {
		rules: [
			{
				test: /\.js$/,
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
	plugins: [
		new HtmlPlugin(),
	],
};
