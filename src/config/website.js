/**
 * 全局配置文件
 */
export default {
	title: '大数据系统',
	logo: '大数据系统',
	key: 'hengya', //配置主键,目前用于存储
	indexTitle: '数据大屏',
	lockPage: '/lock',
	tokenTime: 600000, //token过期时间
	Authorization: 'xx-token',
	//http的status默认放行不才用统一处理的,
	statusWhiteList: [400],
	//配置首页不可关闭
	isFirstPage: false,
	fistPage: {
		label: '智能中心',
		value: '/property',
		params: {},
		query: {},
		meta: {
			i18n: 'dashboard',
		},
		group: [],
		close: false,
	},
	//配置菜单的属性
	menu: {
		iconDefault: 'icon-caidan',
		props: {
			label: 'label',
			path: 'path',
			icon: 'icon',
			children: 'children',
		},
	},
};
