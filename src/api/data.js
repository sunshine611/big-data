import request from '@/router/axios';
import { baseUrl } from '@/config/env';
export const car = (params) =>
	request({
		url: baseUrl + '/realshow/car/index',
		data: params,
		method: 'post',
	});
export const clean = (params) =>
	request({
		url: baseUrl + '/realshow/company/index',
		data: params,
		method: 'post',
	});
export const property = (params) =>
	request({
		url: baseUrl + '/realshow/property/index',
		data: params,
		method: 'post',
	});
export const map = (params) =>
	request({
		url: baseUrl + '/realshow/map/index',
		data: params,
		method: 'post',
	});
export const city = (params) =>
	request({
		url: baseUrl + '/realshow/user/getSetCity',
		data: params,
		method: 'post',
	});
export const smart = (params) =>
	request({
		url: baseUrl + '/realshow/intellect/index',
		data: params,
		method: 'post',
	});
export const device = (params) =>
	request({
		url: baseUrl + '/realshow/device/index',
		data: params,
		method: 'post',
	});
