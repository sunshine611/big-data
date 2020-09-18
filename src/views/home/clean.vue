<template>
	<div class="clean">
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
			<div class="row m-2 mb-4 car-num-box">
				<div
					class="col-3"
					v-for="(item, index) in carTypeNumList.slice(0, 4)"
					:key="index"
				>
					<div class="row car-num">
						<div class="col-5">
							<div class="car-num-box">
								<span class="car-title">{{ item.name }}</span>
								<span class="car-content"
									><span>{{ item.value }}</span
									>辆</span
								>
							</div>
						</div>
						<div class="col-7">
							<Echart
								height="100%"
								width="100%"
								:chartUpdate="carStatusPie(index)"
							></Echart>
						</div>
					</div>
				</div>
			</div>
			<div class="row m-2 mb-4">
				<div class="col-4">
					<div class="border-bg1 justify-content-center align-items-center">
						<div class="title">总接单量占比</div>
						<Echart height="26vh" width="100%" :chartUpdate="orderPie"></Echart>
					</div>
				</div>
				<div class="col-4">
					<div class="border-bg1 justify-content-center align-items-center">
						<div class="title">月处理粪渣</div>
						<Echart
							height="100%"
							width="100%"
							:chartUpdate="shitRadar"
						></Echart>
					</div>
				</div>
				<div class="col-4">
					<div class="border-bg2">
						<div class="title">已承包街道</div>
						<TagCloud
							height="26vh"
							width="100%"
							:data="streetList"
							style="margin-top:2.6vh;"
						></TagCloud>
					</div>
				</div>
			</div>
			<div class="row m-2">
				<div class="col-4">
					<div class="border-bg1 justify-content-center align-items-center">
						<div class="title">月处理订单量</div>
						<Echart
							height="100%"
							width="100%"
							style="margin-left:1.6rem;margin-top:1.6rem;"
							:chartUpdate="orderMonth"
						></Echart>
					</div>
				</div>
				<div class="col-4">
					<div class="border-bg3">
						<div class="title">订单列表</div>
						<div class="vh4"></div>
						<div class="row list-title">
							<div class="col-3">订单号</div>
							<div class="col-3">小区</div>
							<div class="col-3">状态</div>
							<div class="col-3">时间</div>
						</div>
						<vue-seamless-scroll
							:data="orderList"
							:class-option="{ step: 0.3, hoverStop: true }"
							class="seamless-warp"
						>
							<div
								class="row table-li"
								v-for="(item, index) in orderList"
								:key="index"
							>
								<div class="col-3">{{ item.order_sn }}</div>
								<div class="col-3">{{ item.villageName }}</div>
								<div class="col-3">{{ item.stateName }}</div>
								<div class="col-3">{{ item.create_time }}</div>
							</div>
						</vue-seamless-scroll>
					</div>
				</div>
				<div class="col-4">
					<div class="border-bg2">
						<div class="title">月处理清掏量</div>
						<Echart
							height="100%"
							width="100%"
							style="margin-left:1.6rem;margin-top:1.6rem;"
							:chartUpdate="cleanMonth"
						></Echart>
						<!-- <div class="server">
							<div
								class="mb-3"
								v-for="(item, index) in serverList"
								:key="index"
							>
								<div class="server-left">
									第{{ index + 1 }}名：{{ item.name }}
								</div>
								<div class="server-right">
									<el-progress
										v-if="index === 0"
										:stroke-width="16"
										:percentage="item.num"
										:format="serverFormat"
										color="#38eb70"
									></el-progress>
									<el-progress
										v-else-if="index === 1"
										:stroke-width="16"
										:percentage="item.num"
										:format="serverFormat"
										color="#fdf731"
									></el-progress>
									<el-progress
										v-else-if="index === 2"
										:stroke-width="16"
										:percentage="item.num"
										:format="serverFormat"
										color="#ff9800"
									></el-progress>
									<el-progress
										v-else
										:stroke-width="16"
										:percentage="item.num"
										:format="serverFormat"
										color="#aaa"
									></el-progress>
								</div>
							</div>
						</div> -->
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import NavHead from '@/components/website/navHead';
import TagCloud from '@/components/tag-cloud/tagCloud';
import Echart from '@/components/echart/mixChart';
import echarts from 'echarts';
import { mapGetters } from 'vuex';
export default {
	name: 'clean',
	components: {
		NavHead,
		Echart,
		TagCloud,
	},
	data() {
		return {
			carTypeNumList: [], //车辆类型数量列表
			carTypeStatusList: [], //车辆类型状态
			orderListPie: [], //总接单量占比
			radarDate: [], //雷达图时间
			radarData: [], //雷达图数据
			monthOrderListData: [], //月订单数据
			monthOrderListDate: [], //月订单时间
			monthCleanListData: [], //月清掏量数据
			monthCleanListDate: [], //月清掏量时间
			serverList: [], //司机服务评价列表
			orderList: [], //订单列表
			timer: null,
			streetList: [], //街道列表
		};
	},
	computed: {
		...mapGetters(['userInfo', 'cityInfo']),
		carStatusPie() {
			return function(val) {
				for (let i = 0; i < this.carTypeStatusList.length; i++) {
					if (val === i) {
						return {
							color: this.pieColor(val),
							tooltip: {
								trigger: 'item',
								formatter: '{a} <br/>{b} : {c} ({d}%)',
							},
							series: [
								{
									name: '车辆状态',
									type: 'pie',
									radius: ['45%', '70%'],
									center: ['50%', '60%'],
									data: [
										{ value: this.carTypeStatusList[i].busy, name: '忙碌' },
										{ value: this.carTypeStatusList[i].free, name: '空闲' },
									],
									emphasis: {
										itemStyle: {
											shadowBlur: 10,
											shadowOffsetX: 0,
											shadowColor: 'rgba(0, 0, 0, 0)',
										},
									},
									bottom: '10%',
								},
							],
						};
					}
				}
			};
		},
		orderPie() {
			return {
				backgroundColor: 'rgba(0,0,0,0)',
				tooltip: {
					trigger: 'item',
					formatter: '{b}: <br/>{c} ({d}%)',
				},
				color: ['#af89d6', '#0089ff', '#f36f8a'],
				legend: {
					x: '70%',
					y: '38%',
					orient: 'vertical',
					itemGap: 20,
					itemWidth: 16,
					itemHeight: 16,
					data: this.orderListPie.map((item) => {
						return item.name;
					}),
					textStyle: {
						color: [],
						fontStyle: 'normal',
						fontFamily: '总接单量占比',
						fontSize: 16,
					},
				},
				series: [
					{
						name: '总接单量占比',
						type: 'pie',
						clockwise: false,
						minAngle: 20,
						center: ['35%', '55%'],
						radius: [70, 105],
						avoidLabelOverlap: true,
						itemStyle: {
							normal: {
								borderColor: '#1e2239',
								borderWidth: 2,
							},
						},
						label: {
							normal: {
								show: true,
								position: 'inside',
								formatter: '{d}%',
								textStyle: {
									color: '#fff',
								},
							},
							emphasis: {
								show: true,
								textStyle: {
									fontWeight: 'bold',
								},
							},
						},
						data: this.orderListPie,
					},
					{
						name: '',
						type: 'pie',
						clockwise: false,
						silent: true,
						minAngle: 20,
						center: ['35%', '55%'],
						radius: [0, 60],
						itemStyle: {
							normal: {
								borderColor: '#1e2239',
								borderWidth: 1.5,
								opacity: 0.21,
							},
						},
						label: {
							normal: {
								show: false,
							},
						},
						data: this.orderListPie,
					},
				],
			};
		},
		shitRadar() {
			return {
				tooltip: {
					trigger: 'axis',
				},
				color: ['#61dbde'],
				radar: {
					indicator: this.radarDate.map((item) => {
						return { text: item };
					}),
					center: ['50%', '55%'],
					radius: 100,
					name: {
						textStyle: {
							color: '#fff',
						},
					},
				},
				series: [
					{
						type: 'radar',
						tooltip: {
							trigger: 'item',
						},
						areaStyle: {},
						data: [
							{
								value: this.radarData,
								name: '月处理粪渣（立方）',
							},
						],
					},
				],
			};
		},
		orderMonth() {
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
						data: this.monthOrderListDate,
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
						name: '单位：单',
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
						name: '月订单',
						type: 'bar',
						barWidth: '40%',
						barMaxWidth: '40%',
						itemStyle: {
							normal: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{ offset: 0, color: '#13f3cd' }, //柱图渐变色
									{ offset: 1, color: '#09b4f0' }, //柱图渐变色
								]),
							},
						},
						data: this.monthOrderListData,
					},
				],
			};
		},
		cleanMonth() {
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
						data: this.monthCleanListDate,
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
						name: '单位：立方',
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
						name: '月订单',
						type: 'bar',
						barWidth: '40%',
						barMaxWidth: '40%',
						itemStyle: {
							normal: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{ offset: 0, color: '#13f3cd' }, //柱图渐变色
									{ offset: 1, color: '#09b4f0' }, //柱图渐变色
								]),
							},
						},
						data: this.monthCleanListData,
					},
				],
			};
		},
	},
	watch: {
		cityInfo() {
			this.getStreetList();
			this.shitMonth();
			this.getCarTypeStatus();
			this.getCarTypeNumList();
			this.getOrderCountPie();
			this.getMonthOrderList();
			this.getServerList();
			this.getOrderList();
			this.getCleanList();
		},
	},
	created() {
		this.getStreetList();
		this.shitMonth();
		this.getCarTypeStatus();
		this.getCarTypeNumList();
		this.getOrderCountPie();
		this.getMonthOrderList();
		this.getServerList();
		this.getOrderList();
		this.getCleanList();
		this.timer = setInterval(() => {
			this.shitMonth();
			this.getCarTypeStatus();
			this.getOrderCountPie();
			this.getMonthOrderList();
			this.getCleanList();
		}, 10000);
	},
	mounted() {},
	beforeDestroy() {
		if (this.timer) {
			clearInterval(this.timer);
		}
	},
	methods: {
		//获取车辆类型数量
		getCarTypeNumList() {
			this.$store
				.dispatch('data/Car', {
					do: 'carAllNum',
					region_id: this.cityInfo.region_id,
				})
				.then((res) => {
					if (res.code === 1) {
						this.carTypeNumList = res.data;
					}
				});
		},
		//车辆类型状态对比
		getCarTypeStatus() {
			this.$store
				.dispatch('data/Car', {
					do: 'carTypeStatus',
					region_id: this.cityInfo.region_id,
				})
				.then((res) => {
					if (res.code === 1) {
						this.carTypeStatusList = res.data.single;
					}
				});
		},
		//车辆类型状态对比饼状图颜色
		pieColor(val) {
			let colorArr = [];
			if (val === 0) {
				colorArr = ['#00fff4', '#ccc'];
			} else if (val === 1) {
				colorArr = ['#fdf731', '#ccc'];
			} else if (val === 2) {
				colorArr = ['#38eb70', '#ccc'];
			} else if (val === 3) {
				colorArr = ['#ff9800', '#ccc'];
			}
			return colorArr;
		},
		//总接单量占比
		getOrderCountPie() {
			this.$store
				.dispatch('data/Clean', {
					do: 'orderRatio',
					region_id: this.cityInfo.region_id,
				})
				.then((res) => {
					if (res.code === 1) {
						this.orderListPie = res.data;
					}
				});
		},
		//月粪渣处理量
		shitMonth() {
			this.$store
				.dispatch('data/Clean', {
					do: 'excrement',
					region_id: this.cityInfo.region_id,
				})
				.then((res) => {
					if (res.code === 1) {
						this.radarDate = res.data.date;
						this.radarData = res.data.num;
					}
				});
		},
		//获取月订单列表
		getMonthOrderList() {
			this.$store
				.dispatch('data/Clean', {
					do: 'orderMonth',
					region_id: this.cityInfo.region_id,
				})
				.then((res) => {
					if (res.code === 1) {
						this.monthOrderListData = res.data.num;
						this.monthOrderListDate = res.data.date;
					}
				});
		},
		//获取服务评价列表
		getServerList() {
			this.$store
				.dispatch('data/Clean', {
					do: 'appraise',
					region_id: this.cityInfo.region_id,
				})
				.then((res) => {
					if (res.code === 1) {
						this.serverList = res.data;
					}
				});
		},
		//格式化服务评分组件
		serverFormat(value) {
			return value;
		},
		//获取订单列表
		getOrderList() {
			this.$store
				.dispatch('data/Clean', {
					do: 'orderList',
					region_id: this.cityInfo.region_id,
				})
				.then((res) => {
					if (res.code === 1) {
						this.orderList = res.data;
					}
				});
		},
		//获取清掏量列表
		getCleanList() {
			this.$store
				.dispatch('data/Clean', {
					do: 'dealNum',
					region_id: this.cityInfo.region_id,
				})
				.then((res) => {
					if (res.code === 1) {
						this.monthCleanListDate = res.data.date;
						this.monthCleanListData = res.data.num;
					}
				});
		},
		//获取街道列表
		getStreetList() {
			this.$store
				.dispatch('data/Property', {
					do: 'street',
					region_id: this.cityInfo.region_id,
				})
				.then((res) => {
					this.streetList = res.data;
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
.clean {
	min-height: 100vh;
	background: url('../../static/transport_bg.jpg') no-repeat;
	background-size: cover;
	position: relative;
	.car-num-box {
		.car-num {
			border: 1px solid #09fdff;
			box-shadow: 0px 0px 10vh rgba(9, 253, 255, 0.6) inset;
			width: 100%;
			position: relative;
			color: #07fcff;
			transition: all 0.5s;
			margin: 0px;
			.car-num-box {
				display: flex;
				justify-content: flex-end;
				align-items: flex-end;
				height: 15vh;
				padding: 1vh 0;
				.car-title {
					font-size: 1.2rem;
					position: absolute;
					left: 1rem;
					top: 0.6rem;
				}
				.car-content {
					span {
						line-height: 1;
						letter-spacing: 0.4rem;
						font-size: 6rem;
						font-family: UNIDREAMLED;
						margin-right: 0.5rem;
					}
				}
			}
			&:hover {
				box-shadow: 0px 0px 4vh rgba(9, 253, 255, 0.6) inset;
			}
		}
	}
	.border-bg1 {
		position: relative;
		background: url('../../static/border_bg1.png') no-repeat;
		background-size: 100% 100%;
		height: 32vh;
		display: flex;
		.title {
			font-size: 1rem;
			position: absolute;
			color: #07fcff;
			top: -1vh;
			width: 100%;
			text-align: center;
			margin-left: 10px;
			letter-spacing: 0.1rem;
		}
	}
	.border-bg2 {
		position: relative;
		background: url('../../static/border_bg1.png') no-repeat;
		background-size: 100% 100%;
		padding: 1rem;
		height: 32vh;
		color: #06eff2;
		.title {
			font-size: 1rem;
			position: absolute;
			color: #07fcff;
			top: -1vh;
			width: 100%;
			text-align: center;
			letter-spacing: 0.1rem;
		}
		.company {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 0.9rem;
		}
		.server {
			width: 100%;
			margin: 2.6rem;
			color: #fff;
			&-left {
				display: inline-block;
				width: 25%;
			}
			&-right {
				display: inline-block;
				width: 63%;
				/deep/ .el-progress__text {
					color: #fff;
				}
			}
		}
	}
	.border-bg3 {
		position: relative;
		background: url('../../static/border_bg1.png') no-repeat;
		background-size: 100% 100%;
		height: 100%;
		padding: 1rem 1rem 0rem 1rem;
		.title {
			font-size: 1rem;
			position: absolute;
			color: #07fcff;
			top: -1vh;
			width: 100%;
			text-align: center;
			letter-spacing: 0.1rem;
		}
		.list-title {
			color: #07fcff;
			text-align: center;
			font-size: 0.8rem;
			margin-bottom: 1rem;
		}
		.seamless-warp {
			margin-top: 0.6rem;
			font-size: 0.8rem;
			text-align: center;
			height: 21vh;
			overflow: hidden;
			color: rgba(154, 168, 212, 1);
			.table-li {
				color: #fff;
				padding: 4px 0;
			}
		}
	}
}
</style>
