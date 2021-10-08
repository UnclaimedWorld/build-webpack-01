const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const mqpacker = require('@hail2u/css-mqpacker');
const autoprefixer = require('autoprefixer');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { extendDefaultPlugins } = require("svgo");

const { webpages, htmlWebpackConfig } = require('./compile-data');

module.exports = {
	mode: 'production',
	entry: './src/app.js',
	module: {
		rules: [
			{
				test: /\.scss$/,
        		include: path.resolve(__dirname, 'src/styles'),
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									mqpacker({}),
									autoprefixer()
								]
							}
						}
					},
					'sass-loader'
				]
			},
			{
				test: /\.js$/,
        		include: path.resolve(__dirname, 'src/styles'),
				loader: 'babel-loader',
		        options: {
			        presets: ['@babel/preset-env'],
        			plugins: ['@babel/plugin-transform-runtime']
		        }
			},
			{
				test: /\.svg$/,
        		include: path.resolve(__dirname, 'src/icons'),
				type: 'javascript/auto',
				use: [
					{
						loader: 'svg-sprite-loader',
						options: {
							extract: true,
		  					spriteFilename: 'sprites.svg',
						},
					},
					{
						loader: 'svgo-loader',
						options: {
							plugins: [
								{
									name: 'preset-default',
									params: {
										overrides: {
											removeViewBox: false,
											cleanupIDs: false,
										}
									}
								}
							]
						}
					}
				],
			},
			{
				test: /\.(svg|jpg|jpeg|webp|gif|png)$/,
				type: 'asset/resource',
        		exclude: path.resolve(__dirname, 'src/icons'),
				generator: {
					filename: 'images/[name]-[hash][ext]'
				}
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name][ext]'
				}
			},
		]
	},
	output: {
		filename: '[name].[contenthash].js',
		chunkFilename: '[id].[contenthash].js',
		path: path.resolve(__dirname, 'dist'),
		clean: true,
	},
  	plugins: [
	  	new ImageMinimizerPlugin({
	      minimizerOptions: {
	        plugins: [
	          ["gifsicle", { interlaced: true }],
	          ["jpegtran", { progressive: true, optimize: true }],
	          ["optipng", { optimizationLevel: 5 }],
	          [
	            "svgo",
	            {
	              plugins: extendDefaultPlugins([
	                {
	                  name: "removeViewBox",
	                  active: false,
	                },
	                {
	                  name: "cleanupIDs",
	                  active: false,
	                },
	              ]),
	            },
	          ],
	        ],
	      },
	    }),
  		new SpriteLoaderPlugin({
  			plainSprite: true
  		}),
  		new MiniCssExtractPlugin(),
  		...webpages.map(page => new HtmlWebpackPlugin({...page, ...htmlWebpackConfig}))
	],
	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all'
		}
	}
}