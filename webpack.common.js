'use strict';

const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
  entry: './src/index.tsx',
	output: {
		clean: true,
		filename: '[name].[contenthash].js',
    hashDigestLength: 8,
	},
	module: {
		rules: [
			{
				test: /\.[jt]sx?$/,
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
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
	plugins: [
		new HtmlPlugin(),
	],
};
