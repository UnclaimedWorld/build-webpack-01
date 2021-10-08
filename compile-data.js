module.exports = {
	webpages: [
		{
			template: './src/templates/index.ejs',
			filename: 'index.html'
		}
	],
	htmlWebpackConfig: {
		inject: 'body',
		meta: {
			viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
		}
	}
};