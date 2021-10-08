const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const mqpacker = require('@hail2u/css-mqpacker');
const autoprefixer = require('autoprefixer');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

const { webpages, htmlWebpackConfig } = require('./compile-data');

module.exports = {
	mode: 'development',
	devtool: 'eval-cheap-module-source-map',
	devServer: {
		watchFiles: ['src/templates/**/*.ejs'],
    	open: true
	},
	entry: './src/app.js',
	module: {
		rules: [
			{
				test: /\.scss$/,
        		include: path.resolve(__dirname, 'src/styles'),
				use: [
					'style-loader',
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
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				type: 'asset/resource'
			},
		]
	},
	output: {
		filename: '[name].js',
		chunkFilename: '[id].js',
		path: path.resolve(__dirname, 'dist/'),
	},
  	plugins: [
  		new SpriteLoaderPlugin({
  			plainSprite: true
  		}),
  		...webpages.map(page => new HtmlWebpackPlugin({...page, ...htmlWebpackConfig}))
	],
}