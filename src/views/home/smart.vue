<template>
	<div class="smart">
		<vue-particles
			color="#fff"
			:particleOpacity="0.5"
			:particlesNumber="15"
			shapeType="circle"
			:particleSize="5"
			linesColor="#FFFFFF"
			:linesWidth="1"
			:lineLinked="true"
			:lineOpacity="0.2"
			:linesDistance="150"
			:moveSpeed="4"
			:hoverEffect="true"
			hoverMode="repulse"
			:clickEffect="true"
			clickMode="push"
			class="cash"
		>
		</vue-particles>
		<NavHead></NavHead>
		<div class="container-fluid mt-4">
			<div class="row m-2">
				<div class="col-4">
					<div
						class="border-bg1 mr-5 justify-content-center align-items-center"
					>
						<div class="title">有机肥销售占比</div>
						<Echart height="26vh" width="100%" :chartUpdate="sellPie"></Echart>
					</div>
				</div>
				<div class="col-4">
					<div class="border-bg3">
						<div class="map-border map-top-left"></div>
						<div class="map-border map-top-right"></div>
						<div class="map-border map-bottom-left"></div>
						<div class="map-border map-bottom-right"></div>
						<Echart
							height="100%"
							width="12%"
							v-for="(value, name, index) in organicData"
							:key="index"
							:chartUpdate="waves(name, value, index)"
						></Echart>
					</div>
				</div>
				<div class="col-4">
					<div
						class="border-bg1 ml-5 justify-content-center align-items-center"
					>
						<div class="title">每日粪渣处理量</div>
						<Echart
							height="20vh"
							width="90%"
							:chartUpdate="shitDay"
							style="margin-top:1rem"
						></Echart>
					</div>
				</div>
			</div>
			<div class="row m-2 mt-4">
				<div class="col-4">
					<div class="border-bg2 mr-5">
						<div class="title">今日动态</div>
						<div class="vh1"></div>
						<div class="vh4"></div>
						<div class="row list-title">
							<div class="col-4">项目</div>
							<div class="col-4">数据</div>
							<div class="col-4">单位</div>
						</div>
						<vue-seamless-scroll
							:data="todayData"
							:class-option="{ step: 0.3, hoverStop: true }"
							class="seamless-warp"
						>
							<div
								class="row table-li"
								v-for="(item, index) in todayData"
								:key="index"
							>
								<div class="col-4">{{ item.title }}</div>
								<div class="col-4">{{ item.num }}</div>
								<div class="col-4">{{ item.danwei }}</div>
							</div>
						</vue-seamless-scroll>
					</div>
				</div>
				<div class="col-4 offset-4">
					<div class="border-bg2 ml-5">
						<div class="title">微生物列表</div>
						<div class="vh1"></div>
						<div class="vh4"></div>
						<div class="row list-title">
							<div class="col-4">名称</div>
							<div class="col-4">主要成分</div>
							<div class="col-4">用途</div>
						</div>
						<vue-seamless-scroll
							:data="microbiaList"
							:class-option="{ step: 0.3, hoverStop: true }"
							class="seamless-warp"
						>
							<div
								class="row table-li"
								v-for="(item, index) in microbiaList"
								:key="index"
							>
								<div class="col-4 text-hidden">{{ item.name }}</div>
								<div class="col-4 text-hidden">{{ item.main }}</div>
								<div class="col-4 text-hidden">{{ item.use }}</div>
							</div>
						</vue-seamless-scroll>
					</div>
				</div>
			</div>
			<div class="row m-2 mt-4">
				<div class="col-4">
					<div
						class="border-bg1 mr-5 justify-content-center align-items-center"
					>
						<div class="title">有机肥月产出量</div>
						<Echart
							height="28vh"
							width="100%"
							:chartUpdate="fertilizerBar"
							style="margin-left:1.4rem;"
						></Echart>
					</div>
				</div>
				<div class="col-4  offset-4">
					<div
						class="border-bg1 ml-5 justify-content-center align-items-center"
					>
						<div class="title">有机肥月销售量</div>
						<Echart
							height="28vh"
							width="100%"
							:chartUpdate="fertilizerSellBar"
							style="margin-left:1.4rem;"
						></Echart>
					</div>
				</div>
			</div>
		</div>
		<Echart class="map" width="50%" height="65vh" :chartUpdate="map"></Echart>
	</div>
</template>

<script>
import NavHead from '@/components/website/navHead';
import Echart from '@/components/echart/mixChart';
import echarts from 'echarts';
import echartsLiquidfill from 'echarts-liquidfill';
import 'echarts/map/js/province/fujian.js';
import { mapGetters } from 'vuex';
export default {
	name: 'smart',
	components: {
		NavHead,
		Echart,
		echartsLiquidfill,
	},
	data() {
		return {
			sellList: [], //有机肥销售占比
			dayShitList: [], //日粪渣处理量
			dayShitDate: [], //日粪渣处理量日期
			todayData: [], //今日动态
			microbiaList: [], //微生物列表
			fertilizerDate: [], //有机肥产出量日期
			fertilizerData: [], //有机肥产出量数据
			fertilizerSellDate: [], //有机肥产出量数据
			fertilizerSellData: [], //有机肥产出量数据
			organicData: {}, //有机质含量配比
			cityData: [],
			timer: null,
		};
	},
	computed: {
		...mapGetters(['userInfo', 'cityInfo']),
		sellPie() {
			return {
				color: [
					'#b6a2de',
					'#5ab1ef',
					'#ffb980',
					'#d87a80',
					'#8d98b3',
					'#2ec7c9',
				],
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b} : {c} ({d}%)',
				},
				legend: {
					itemWidth: 15, // 标志图形的长度
					itemHeight: 15, // 标志图形的宽度
					orient: 'vertical',
					right: '12%',
					top: '25%',
					textStyle: {
						color: '#fff',
						fontSize: 12,
					},
					data: this.sellList.map((item) => {
						return item.name;
					}),
				},
				series: [
					{
						name: '有机肥销售占比',
						type: 'pie',
						radius: '60%',
						center: ['35%', '60%'],
						roseType: 'radius',
						data: this.sellList,
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)',
							},
						},
						bottom: '10%',
					},
				],
			};
		},
		shitDay() {
			return {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						lineStyle: {
							color: '#fff',
						},
					},
				},
				grid: {
					x: 35,
					y: 25,
					x2: 8,
					y2: 25,
				},
				xAxis: [
					{
						type: 'category',
						boundaryGap: false,
						axisLine: {
							lineStyle: {
								color: '#57617B',
							},
						},
						axisLabel: {
							textStyle: {
								fontSize: 10,
								color: '#fff',
							},
						},
						data: this.dayShitDate,
					},
				],
				yAxis: [
					{
						type: 'value',
						axisTick: {
							show: false,
						},
						scale: true,
						name: '单位：吨',
						nameTextStyle: {
							color: '#fff',
							fontSize: 10,
						},
						axisLine: {
							lineStyle: {
								color: '#57617B',
							},
						},
						axisLabel: {
							textStyle: {
								fontSize: 10,
								color: '#fff',
							},
						},
						splitLine: {
							lineStyle: {
								color: '#57617B',
							},
						},
					},
				],
				series: [
					{
						name: '粪渣处理量',
						type: 'line',
						smooth: true,
						lineStyle: {
							normal: {
								width: 2,
							},
						},
						areaStyle: {
							normal: {
								color: new echarts.graphic.LinearGradient(
									0,
									0,
									0,
									1,
									[
										{
											offset: 0,
											color: 'rgba(137, 189, 27, 0.3)',
										},
										{
											offset: 0.8,
											color: 'rgba(137, 189, 27, 0)',
										},
									],
									false
								),
								shadowColor: 'rgba(0, 0, 0, 0.1)',
								shadowBlur: 10,
							},
						},
						itemStyle: {
							normal: {
								color: 'rgb(137,189,27)',
							},
						},
						data: this.dayShitList,
					},
				],
			};
		},
		fertilizerBar() {
			return {
				grid: { show: 'true', borderWidth: '0' },
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow',
					},

					formatter: function(params) {
						var tar = params[0];
						return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
					},
				},
				xAxis: [
					{
						type: 'category',
						splitLine: { show: false },
						data: this.fertilizerDate,
						axisLabel: {
							show: true,
							textStyle: {
								color: '#fff',
							},
						},
						axisLine: {
							lineStyle: {
								type: 'solid',
								color: '#fff',
								width: '1',
							},
						},
					},
				],
				yAxis: [
					{
						type: 'value',
						splitLine: { show: false },
						axisLabel: {
							show: true,
							textStyle: {
								color: '#fff',
							},
						},
						axisLine: {
							lineStyle: {
								type: 'solid',
								color: '#fff',
								width: '1',
							},
						},
					},
				],
				series: [
					{
						name: '有机肥月产出量',
						type: 'bar',
						barWidth: '40%',
						barMaxWidth: '40%',
						itemStyle: {
							normal: {
								// label: { show: true, position: 'inside' },
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{ offset: 0, color: '#13f3cd' }, //柱图渐变色
									{ offset: 1, color: '#09b4f0' }, //柱图渐变色
								]),
							},
						},
						data: this.fertilizerData,
					},
				],
			};
		},
		fertilizerSellBar() {
			return {
				grid: { show: 'true', borderWidth: '0' },
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow',
					},

					formatter: function(params) {
						var tar = params[0];
						return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
					},
				},
				xAxis: [
					{
						type: 'category',
						splitLine: { show: false },
						data: this.fertilizerSellDate,
						axisLabel: {
							show: true,
							textStyle: {
								color: '#fff',
							},
						},
						axisLine: {
							lineStyle: {
								type: 'solid',
								color: '#fff',
								width: '1',
							},
						},
					},
				],
				yAxis: [
					{
						type: 'value',
						splitLine: { show: false },
						axisLabel: {
							show: true,
							textStyle: {
								color: '#fff',
							},
						},
						axisLine: {
							lineStyle: {
								type: 'solid',
								color: '#fff',
								width: '1',
							},
						},
					},
				],
				series: [
					{
						name: '有机肥月产出量',
						type: 'bar',
						barWidth: '40%',
						barMaxWidth: '40%',
						itemStyle: {
							normal: {
								// label: { show: true, position: 'inside' },
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{ offset: 0, color: '#97e0c2' }, //柱图渐变色
									{ offset: 1, color: '#12f4e9' }, //柱图渐变色
								]),
							},
						},
						data: this.fertilizerSellData,
					},
				],
			};
		},
		waves() {
			return function(name, value, index) {
				return {
					title: {
						// 标题
						text: name,
						textStyle: {
							// 标题的样式
							color: '#fff', // 字体颜色
							fontSize: 14,
							fontWeight: '400',
							align: 'center', // 文字的水平方式
							baseline: 'middle',
							position: 'inside',
							verticalAlign: 'middle', // 文字的垂直方式
						},
						left: 'center', // 定位
						bottom: '12%',
					},
					series: [
						{
							type: 'liquidFill',
							radius: '95%',
							waveAnimation: true,
							data: [
								{
									value: value,
									direction: 'left',
									itemStyle: {
										normal: {
											color: (function() {
												if (index === 0) {
													return '#e65a56';
												} else if (index === 1) {
													return '#feb64d';
												} else if (index === 2) {
													return '#62d9ad';
												} else if (index === 3) {
													return '#5aaef3';
												} else if (index === 4) {
													return '#06eff2';
												} else if (index === 5) {
													return '#c1d135';
												}
											})(),
										},
									},
								},
							],
							outline: {
								// show: true , //是否显示轮廓 布尔值
								borderDistance: 2, // 外部轮廓与图表的距离 数字
								itemStyle: {
									borderColor: (function() {
										if (index === 0) {
											return '#e65a56';
										} else if (index === 1) {
											return '#feb64d';
										} else if (index === 2) {
											return '#62d9ad';
										} else if (index === 3) {
											return '#5aaef3';
										} else if (index === 4) {
											return '#06eff2';
										} else if (index === 5) {
											return '#c1d135';
										}
									})(), // 边框的颜色
									borderWidth: 2, // 边框的宽度
									// shadowBlur: 5 , //外部轮廓的阴影范围 一旦设置了内外都有阴影
									// shadowColor: '#000' //外部轮廓的阴影颜色
								},
							},
							itemStyle: {
								opacity: 0.9, // 波浪的透明度
								shadowBlur: 0, // 波浪的阴影范围
							},
							backgroundStyle: {
								color: 'rgba(0,0,0,0)', // 图表的背景颜色
							},
							label: {
								// 数据展示样式
								show: true,
								color: '#fff',
								insideColor: '#fff',
								fontSize: 20,
								fontWeight: 400,
								align: 'center',
								baseline: 'middle',
								position: 'inside',
								formatter: function(param) {
									let num = param.value * 100;
									return num.toFixed(2) + '%';
								},
							},
						},
					],
				};
			};
		},
		map() {
			return {
				tooltip: {
					trigger: 'item',
					formatter: '{a}<br>{b}：{c}',
				},
				geo: {
					map: '福建',
					scaleLimit: {
						min: 1,
						max: 2,
					},
					zoom: 1,
					top: 120,
					label: {
						normal: {
							show: true,
							fontSize: '14',
							color: '#000',
						},
						emphasis: {
							color: '#061d33',
						},
					},
					itemStyle: {
						normal: {
							borderColor: '#000',
							areaColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: '#13f3cd' }, //柱图渐变色
								{ offset: 1, color: '#09b4f0' }, //柱图渐变色
							]),
							borderWidth: 0.5,
						},
						emphasis: {
							areaColor: '#13f3cd',
							shadowOffsetX: 1,
							shadowOffsetY: 1,
							shadowBlur: 5,
							borderWidth: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)',
						},
					},
				},
				series: [
					{
						name: '订单量',
						type: 'map',
						geoIndex: 0,
						data: this.cityData,
					},
				],
			};
		},
	},
	watch: {
		cityInfo() {
			this.getSellList();
			this.getDayShitList();
			this.getTodayDay();
			this.getMicrobialList();
			this.getFertilizerBar();
			this.getFertilizerSellBar();
			this.getOrganicData();
			this.getCityData();
		},
	},
	created() {},
	mounted() {
		this.getSellList();
		this.getDayShitList();
		this.getTodayDay();
		this.getMicrobialList();
		this.getFertilizerBar();
		this.getFertilizerSellBar();
		this.getOrganicData();
		this.getCityData();
		this.timer = setInterval(() => {
			this.getSellList();
			this.getDayShitList();
			this.getFertilizerBar();
			this.getFertilizerSellBar();
		}, 600000);
	},
	beforeDestroy() {
		if (this.timer) {
			clearInterval(this.timer);
		}
	},
	methods: {
		//有机肥销售数量占比
		getSellList() {
			this.$store
				.dispatch('data/Smart', {
					do: 'sale',
					region_id: this.cityInfo.region_id,
				})
				.then((res) => {
					if (res.code === 1) {
						this.sellList = res.data;
					}
				});
		},
		//获取日粪渣处理量
		getDayShitList() {
			this.$store
				.dispatch('data/Smart', {
					do: 'monthF',
					region_id: this.cityInfo.region_id,
				})
				.then((res) => {
					if (res.code === 1) {
						this.dayShitDate = res.data.date;
						this.dayShitList = res.data.num;
					}
				});
		},
		//获取今日动态
		getTodayDay() {
			this.$store
				.dispatch('data/Smart', {
					do: 'new',
					region_id: this.cityInfo.region_id,
				})
				.then((res) => {
					if (res.code === 1) {
						this.todayData = res.data;
					}
				});
		},
		//获取微生物列表
		getMicrobialList() {
			this.$store
				.dispatch('data/Smart', {
					do: 'microbe',
					region_id: this.cityInfo.region_id,
				})
				.then((res) => {
					if (res.code === 1) {
						this.microbiaList = res.data;
					}
				});
		},
		//获取有机肥月产出量
		getFertilizerBar() {
			this.$store
				.dispatch('data/Smart', {
					do: 'month',
					region_id: this.cityInfo.region_id,
				})
				.then((res) => {
					if (res.code === 1) {
						this.fertilizerDate = res.data.date;
						this.fertilizerData = res.data.num;
					}
				});
		},
		//获取有机肥月销售量
		getFertilizerSellBar() {
			this.$store
				.dispatch('data/Smart', {
					do: 'monthProduce',
					region_id: this.cityInfo.region_id,
				})
				.then((res) => {
					if (res.code === 1) {
						this.fertilizerSellDate = res.data.date;
						this.fertilizerSellData = res.data.num;
					}
				});
		},
		//获取有机质含量配比
		getOrganicData() {
			this.$store
				.dispatch('data/Smart', {
					do: 'organicFertilizer',
					region_id: this.cityInfo.region_id,
				})
				.then((res) => {
					if (res.code === 1) {
						this.organicData = res.data;
					}
				});
		},
		//获取城市数据
		getCityData() {
			this.$store
				.dispatch('data/Smart', {
					do: 'regionNum',
					region_id: this.cityInfo.region_id,
				})
				.then((res) => {
					if (res.code === 1) {
						this.cityData = res.data;
					}
				});
		},
	},
};
</script>

<style scoped="scoped" lang="scss">
@font-face {
	font-family: UNIDREAMLED;
	src: url('../../static/font/UNIDREAMLED.TTF');
}
.smart {
	min-height: 100vh;
	background: url('../../static/transport_bg.jpg') no-repeat;
	background-size: cover;
	position: relative;
	.map {
		position: fixed !important;
		top: 25vh;
		left: 50%;
		margin-left: -25%;
	}
	.car-num-box {
		.car-num {
			border: 1px solid #09fdff;
			box-shadow: 0px 0px 8vh rgba(9, 253, 255, 0.6) inset;
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			color: #07fcff;
			transition: all 0.5s;
			.car-title {
				font-size: 1.2rem;
				position: absolute;
				left: 1rem;
				top: 0.6rem;
			}
			.car-content {
				letter-spacing: 0.4rem;
				font-size: 3.4rem;
				font-family: UNIDREAMLED;
			}
			&:hover {
				box-shadow: 0px 0px 3vh rgba(9, 253, 255, 0.6) inset;
			}
		}
	}
	.border-bg1 {
		position: relative;
		background: url('../../static/border_bg1.png') no-repeat;
		background-size: 100% 100%;
		height: 26vh;
		display: flex;
		.title {
			font-size: 1rem;
			position: absolute;
			color: #07fcff;
			top: -1vh;
			width: 100%;
			text-align: center;
			margin-left: 10px;
		}
	}
	.border-bg2 {
		position: relative;
		background: url('../../static/border_bg2.png') no-repeat;
		background-size: 100% 100%;
		height: 26vh;
		.title {
			font-size: 1rem;
			position: absolute;
			color: #07fcff;
			width: 40%;
			top: 0;
			left: 0;
			text-align: center;
			margin-top: 0.5rem;
			letter-spacing: 0.5rem;
		}
		.list-title {
			color: #07fcff;
			text-align: center;
			font-size: 0.8rem;
		}
		.seamless-warp {
			margin-top: 1rem;
			font-size: 0.8rem;
			text-align: center;
			height: 16vh;
			overflow: hidden;
			color: rgba(154, 168, 212, 1);
			.table-li {
				color: #fff;
				padding: 4px 1rem;
			}
		}
	}
	.border-bg3 {
		position: relative;
		background-size: 100% 100%;
		height: 20vh;
		display: flex;
		margin-left: -3.6rem;
		margin-right: -3.6rem;
		margin-top: 1vh;
		justify-content: space-around;
		.map-border {
			position: absolute;
			background: url('../../static/border_bg4.png') no-repeat;
			background-size: 100%;
			width: 3rem;
			height: 3rem;
			&.map-top-left {
				left: 0px;
				top: 0px;
			}
			&.map-top-right {
				right: 0px;
				top: 0px;
				transform: rotate(90deg);
			}
			&.map-bottom-left {
				left: 0px;
				bottom: 0px;
				transform: rotate(270deg);
			}
			&.map-bottom-right {
				right: 0px;
				bottom: 0px;
				transform: rotate(180deg);
			}
		}
	}
}
</style>
