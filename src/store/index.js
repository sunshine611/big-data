import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import common from './modules/common';
import tags from './modules/tags';
import logs from './modules/logs';
import data from './modules/data';
import getters from './getters';

Vue.use(Vuex);
const store = new Vuex.Store({
	modules: {
		user,
		common,
		logs,
		tags,
		data,
	},
	getters,
});

export default store;
