/* eslint-disable */
import { car, clean, property, map, city, smart } from '@/api/data';
import { setStore, getStore } from '@/util/store';
const data = {
	namespaced: true,
	state: {
		cityInfo: getStore({ name: 'cityInfo' }) || {},
	},
	actions: {
		//车
		Car({}, params) {
			return new Promise((resolve) => {
				car(params).then((res) => {
					resolve(res.data);
				});
			});
		},
		//清掏公司
		Clean({}, params) {
			return new Promise((resolve) => {
				clean(params).then((res) => {
					resolve(res.data);
				});
			});
		},
		//小区
		Property({}, params) {
			return new Promise((resolve) => {
				property(params).then((res) => {
					resolve(res.data);
				});
			});
		},
		//地图
		Map({}, params) {
			return new Promise((resolve) => {
				map(params).then((res) => {
					resolve(res.data);
				});
			});
		},
		//城市
		City({}, params) {
			return new Promise((resolve) => {
				city(params).then((res) => {
					resolve(res.data);
				});
			});
		},
		//智能中心
		Smart({}, params) {
			return new Promise((resolve) => {
				smart(params).then((res) => {
					resolve(res.data);
				});
			});
		},
	},
	mutations: {
		SET_CITY: (state, cityInfo) => {
			state.cityInfo = cityInfo;
			setStore({ name: 'cityInfo', content: state.cityInfo });
		},
	},
};
export default data;
