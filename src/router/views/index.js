import Layout from '@/page/index/';
export default [
	{
		path: '/',
		redirect: '/home/index',
		name: '司机大屏',
		component: () =>
			import(/* webpackChunkName: "views" */ '@/views/home/index'),
	},
	{
		path: '/clean',
		name: '清掏大屏',
		component: () =>
			import(/* webpackChunkName: "views" */ '@/views/home/clean'),
	},
	{
		path: '/property',
		name: '物业大屏',
		component: () =>
			import(/* webpackChunkName: "views" */ '@/views/home/property'),
	},
	{
		path: '/warning',
		name: '预警大屏',
		component: () =>
			import(/* webpackChunkName: "views" */ '@/views/home/warning'),
	},
	{
		path: '/smart',
		name: '智能中心',
		component: () =>
			import(/* webpackChunkName: "views" */ '@/views/home/smart'),
	},
	{
		path: '/car-map',
		name: '车辆定位',
		component: () =>
			import(/* webpackChunkName: "views" */ '@/views/home/carMap'),
	},
	{
		path: '/gps-map',
		name: '车辆轨迹',
		component: () =>
			import(/* webpackChunkName: "views" */ '@/views/home/GPSMap'),
	},
	{
		path: '/form-detail',
		component: Layout,
		children: [
			{
				path: 'index',
				name: '详情页',
				meta: {
					i18n: 'detail',
				},
				component: () =>
					import(/* webpackChunkName: "views" */ '@/views/util/form-detail'),
			},
		],
	},
	{
		path: '/info',
		component: Layout,
		redirect: '/info/index',
		children: [
			{
				path: 'index',
				name: '个人信息',
				meta: {
					i18n: 'info',
				},
				component: () =>
					import(/* webpackChunkName: "views" */ '@/views/user/info'),
			},
			{
				path: 'setting',
				name: '个人设置',
				meta: {
					i18n: 'setting',
				},
				component: () =>
					import(/* webpackChunkName: "views" */ '@/views/user/setting'),
			},
		],
	},
];
