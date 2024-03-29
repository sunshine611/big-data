// 基础路径 注意发布之前要先修改这里
let baseUrl = '/';
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
	baseUrl: baseUrl, // 根据你的实际情况更改这里
	lintOnSave: true,
	productionSourceMap: false,
	// configureWebpack: config => {
	//     if (process.env.NODE_ENV === 'production') {
	//         return {
	//             plugins: [
	//                 new BundleAnalyzerPlugin()
	//             ]
	//         }
	//     }
	// },
	chainWebpack: (config) => {
		//忽略的打包文件
		config.externals({
			vue: 'Vue',
			'vue-router': 'VueRouter',
			vuex: 'Vuex',
			axios: 'axios',
			'element-ui': 'ELEMENT',
		});
		const entry = config.entry('app');
		entry.add('babel-polyfill').end();
		entry.add('classlist-polyfill').end();
		entry.add('@/mock').end();
	},
	//配置转发代理
	devServer: {
		open: true,
		proxy: {
			'/realshow': {
				// target: 'https://dev.hyzszy.com.cn/',
				target: 'https://xs.rosemary.top/',
				ws: true,
				changeOrigin: true,
				pathRewrite: {
					'^/realshow': 'realshow',
				},
			},
		},
	},
};
