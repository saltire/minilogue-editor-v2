'use strict';

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');


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
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.svg$/,
        use: '@svgr/webpack',
      },
      {
        test: /\.woff2$/,
        type: 'asset/resource',
      },
		],
	},
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  optimization: {
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ],
    splitChunks: { chunks: 'all' },
  },
	plugins: [
		new HtmlPlugin({
      favicon: './src/assets/favicon.png',
    }),
	],
};
