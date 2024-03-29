import Vue from 'vue';
import axios from './router/axios';
import VueAxios from 'vue-axios';
import App from './App';
import router from './router/router';
import VueParticles from 'vue-particles';
import echarts from 'echarts';
import './permission'; // 权限
import './error'; // 日志
import './cache'; //页面缓冲
import store from './store';
import { loadStyle } from './util/util';
import * as urls from '@/config/env';
import Element from 'element-ui';
import { iconfontUrl, iconfontVersion } from '@/config/env';
import i18n from './lang'; // Internationalization
import './styles/common.scss';
import basicBlock from './components/basic-block/main';
import basicContainer from './components/basic-container/main';
import crudCommon from '@/mixins/crud.js';
import { BootstrapVue } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import VueAnimateNumber from 'vue-animate-number';
import scroll from 'vue-seamless-scroll';
import VueAMap from 'vue-amap';
Vue.use(scroll);
Vue.prototype.$echarts = echarts;
Vue.use(VueAnimateNumber);
window.$crudCommon = crudCommon;
Vue.use(BootstrapVue);
Vue.use(VueParticles);
Vue.use(router);
Vue.use(VueAxios, axios);
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
	key: '5e6e0524ab3f9ab32344dce2c3c17ce8',
	plugin: [
		'AMap.Autocomplete',
		'AMap.PlaceSearch',
		'AMap.Scale',
		'AMap.OverView',
		'AMap.ToolBar',
		'AMap.MapType',
		'AMap.PolyEditor',
		'AMap.CircleEditor',
	],
	v: '1.4.4',
});
Vue.use(Element, {
	i18n: (key, value) => i18n.t(key, value),
});
Vue.use(window.AVUE, {
	i18n: (key, value) => i18n.t(key, value),
});
//注册全局容器
Vue.component('basicContainer', basicContainer);
Vue.component('basicBlock', basicBlock);
// 加载相关url地址
Object.keys(urls).forEach((key) => {
	Vue.prototype[key] = urls[key];
});

// 动态加载阿里云字体库
iconfontVersion.forEach((ele) => {
	loadStyle(iconfontUrl.replace('$key', ele));
});

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	i18n,
	render: (h) => h(App),
}).$mount('#app');
