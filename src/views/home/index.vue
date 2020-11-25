<template>
	<div class="home">
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
		<div class="transport">
			<img
				src="https://hengya.obs.cn-south-1.myhuaweicloud.com/dataview/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20201103152114.png"
				class="car"
			/>
		</div>
		<div class="container-fluid mt-4">
			<div class="row m-2 mb-4 car-num-box">
				<div
					class="col-3"
					v-for="(item, index) in carTypeNumList.slice(0, 4)"
					:key="index"
				>
					<div class="car-num">
						<span class="car-title">{{ item.name }}</span>
						<span class="car-content">{{ item.value }}</span>
					</div>
				</div>
			</div>
			<div class="row m-2">
				<div class="col-4">
					<div
						class="border-bg1 mr-5 justify-content-center align-items-center"
					>
						<div class="title">车辆类型数量</div>
						<Echart
							ref="chart1"
							height="26vh"
							width="100%"
							style="margin-left:1.6rem"
							:chartUpdate="carType"
						></Echart>
					</div>
				</div>
				<div class="col-4 offset-4">
					<div
						class="border-bg1 ml-5 justify-content-center align-items-center"
					>
						<div class="title">车辆月派出频次</div>
						<div class="vh1"></div>
						<div class="vh2"></div>
						<Echart
							ref="chart2"
							height="19vh"
							width="100%"
							:chartUpdate="carSent"
						></Echart>
					</div>
				</div>
			</div>
			<div class="row m-2 mt-4">
				<div class="col-4">
					<div class="border-bg1 mr-5">
						<div class="title">车辆列表</div>
						<div class="vh4"></div>
						<div class="row list-title">
							<div class="col-3">车辆类型</div>
							<div class="col-3">司机姓名</div>
							<div class="col-3">车牌号</div>
							<div class="col-3">状态</div>
						</div>
						<vue-seamless-scroll
							:data="carList"
							:class-option="{ step: 0.3, hoverStop: true }"
							class="seamless-warp"
						>
							<div
								class="row table-li"
								v-for="(item, index) in carList"
								:key="index"
							>
								<div class="col-3">{{ item.name }}</div>
								<div class="col-3">{{ item.user_login }}</div>
								<div class="col-3">{{ item.license_plate }}</div>
								<div class="col-3">
									<el-tag
										effect="dark"
										type="warning"
										size="mini"
										v-if="item.status === '任务中'"
										>{{ item.status }}</el-tag
									>
									<el-tag
										effect="dark"
										type="primary"
										size="mini"
										v-else-if="item.status === '空闲'"
										>{{ item.status }}</el-tag
									>
								</div>
							</div>
						</vue-seamless-scroll>
					</div>
				</div>
				<div class="col-4 offset-4">
					<div class="border-bg1 ml-5">
						<div class="title">车辆类型占比</div>
						<div class="vh1"></div>
						<Echart
							ref="chart5"
							height="22vh"
							width="100%"
							:chartUpdate="carStatus"
						></Echart>
					</div>
				</div>
			</div>
			<div class="row m-2 mt-4">
				<div class="col-4 ">
					<div
						class="border-bg1 mr-5 justify-content-center align-items-center"
					>
						<div class="title">司机列表</div>
						<div class="vh4"></div>
						<div class="row list-title">
							<div class="col-3">车牌号</div>
							<div class="col-3">司机姓名</div>
							<div class="col-3">手机号</div>
							<div class="col-3">身份证</div>
						</div>
						<vue-seamless-scroll
							:data="carList"
							:class-option="{ step: 0.3, hoverStop: true }"
							class="seamless-warp"
						>
							<div
								class="row table-li"
								v-for="(item, index) in carList"
								:key="index"
							>
								<div class="col-3">{{ item.license_plate }}</div>
								<div class="col-3">{{ item.user_login }}</div>
								<div class="col-3">{{ item.mobile }}</div>
								<div class="col-3">{{ item.id_card }}</div>
							</div>
						</vue-seamless-scroll>
					</div>
				</div>
				<div class="col-4 offset-4">
					<div
						class="border-bg1 ml-5 justify-content-center align-items-center"
					>
						<div class="title">车辆设备状态</div>
						<Echart
							ref="chart5"
							height="22vh"
							width="100%"
							:chartUpdate="carDeviceStatus"
						></Echart>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import NavHead from '@/components/website/navHead';
import Echart from '@/components/echart/mixChart';
import echarts from 'echarts';
import { mapGetters } from 'vuex';
export default {
	name: 'car',
	components: {
		NavHead,
		Echart,
	},
	data() {
		return {
			carTypeNumList: [], //车辆类型数量列表
			carSentList: {
				month: [],
				cleanData: { name: '', data: [] },
				stainData: { name: '', data: [] },
				toolData: { name: '', data: [] },
				transferData: { name: '', data: [] },
			},
			carList: [], //车辆列表
			carTypeStatusList: [], //车辆类型状态
			timer: null,
		};
	},
	computed: {
		...mapGetters(['userInfo', 'cityInfo']),
		carType() {
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
						data: this.carTypeNumList.map((item) => {
							return item.name;
						}),
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
						name: '车辆类型',
						type: 'bar',
						barWidth: '40%',
						barMaxWidth: '40%',
						itemStyle: {
							normal: {
								// label: { show: true, position: 'inside' },
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{ offset: 0, color: '#10c6dc' }, //柱图渐变色
									{ offset: 1, color: '#25b4de' }, //柱图渐变色
								]),
							},
						},
						data: this.carTypeNumList.map((item) => {
							return item.value;
						}),
					},
				],
			};
		},
		carSent() {
			return {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						lineStyle: {
							color: '#fff',
						},
					},
				},
				legend: {
					icon: 'rect',
					itemWidth: 12,
					itemHeight: 12,
					itemGap: 15,
					data: [
						this.carSentList.cleanData.name,
						this.carSentList.stainData.name,
						this.carSentList.toolData.name,
						this.carSentList.transferData.name,
					],
					right: '10px',
					top: '0px',
					textStyle: {
						fontSize: 12,
						color: '#fff',
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
								color: '#fff',
							},
						},
						data: this.carSentList.month.map((item) => {
							return item + '月';
						}),
					},
				],
				yAxis: [
					{
						type: 'value',
						axisTick: {
							show: false,
						},
						scale: true,
						name: '单位：次',
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
							margin: 10,
							textStyle: {
								fontSize: 14,
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
						name: this.carSentList.cleanData.name,
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
						data: this.carSentList.cleanData.data,
					},
					{
						name: this.carSentList.stainData.name,
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
											color: 'rgba(0, 136, 212, 0.3)',
										},
										{
											offset: 0.8,
											color: 'rgba(0, 136, 212, 0)',
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
								color: 'rgb(0,136,212)',
							},
						},
						data: this.carSentList.stainData.data,
					},
					{
						name: this.carSentList.toolData.name,
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
											color: 'rgba(219, 50, 51, 0.3)',
										},
										{
											offset: 0.8,
											color: 'rgba(219, 50, 51, 0)',
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
								color: 'rgb(219,50,51)',
							},
						},
						data: this.carSentList.toolData.data,
					},
					{
						name: this.carSentList.transferData.name,
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
											color: 'rgba(148, 80, 35, 0.3)',
										},
										{
											offset: 0.8,
											color: 'rgba(219, 50, 51, 0)',
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
								color: 'rgb(148, 80, 35)',
							},
						},
						data: this.carSentList.transferData.data,
					},
				],
			};
		},
		carStatus() {
			return {
				tooltip: {
					trigger: 'axis',
				},
				legend: {
					right: '0%',
					top: '10%',
					data: ['忙碌', '空闲'],
					textStyle: {
						color: '#fff',
						fontSize: 10,
					},
					itemWidth: 10,
					itemHeight: 10,
				},
				calculable: true,
				xAxis: [
					{
						type: 'category',
						data: this.carTypeStatusList.map((item) => {
							return item.name;
						}),

						axisLabel: {
							interval: 0,
							textStyle: {
								fontSize: 10,
								color: '#fff',
							},
						},
						axisTick: {
							//y轴刻度线
							show: false,
						},
						axisLine: {
							//y轴
							show: false,
						},
					},
				],
				yAxis: [
					{
						type: 'value',
						scale: true,
						name: '单位：辆',
						min: 0,
						nameTextStyle: {
							color: '#fff',
							fontSize: 10,
						},
						boundaryGap: [0.2, 0.2],
						axisTick: {
							//y轴刻度线
							show: false,
						},
						axisLine: {
							//y轴
							show: false,
						},
						axisLabel: {
							textStyle: {
								color: '#fff',
								fontSize: 10,
								// opacity: 0.1,
							},
						},
						splitLine: {
							//决定是否显示坐标中网格
							show: true,
							lineStyle: {
								color: ['#fff'],
								opacity: 0.2,
							},
						},
					},
					{
						type: 'value',
						scale: true,
						show: false,
						// name: "销量额(万元)",
						nameTextStyle: {
							color: 'rgba(255,255,255,.2)',
						},
						max: 1,
						min: 0,
						boundaryGap: [0.2, 0.2],
						axisTick: {
							//y轴刻度线
							show: false,
						},
						axisLine: {
							//y轴
							show: false,
						},
						axisLabel: {
							textStyle: {
								color: 'rgba(255,255,255,.2)',
								// opacity: 0.1,
							},
						},
						splitLine: {
							//决定是否显示坐标中网格
							show: true,
							lineStyle: {
								color: ['#fff'],
								opacity: 0.2,
							},
						},
					},
				],
				color: ['#44aff0', '#ffba55'],
				grid: {
					left: '5%',
					right: '1%',
					top: '25%',
					bottom: '15%',
					// containLabel: true
				},
				series: [
					{
						animationDuration: 2500,
						barWidth: '20%',
						name: '忙碌',
						type: 'bar',
						data: this.carTypeStatusList.map((item) => {
							return item.busy;
						}),
					},
					{
						barWidth: '20%',
						name: '空闲',
						type: 'bar',
						data: this.carTypeStatusList.map((item) => {
							return item.free;
						}),
					},
				],
				animationEasing: 'cubicOut',
			};
		},
		carDeviceStatus() {
			return {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow',
					},
				},

				legend: {
					// align: 'center',
					// left: '65%',
					top: '28',
					data: ['离线', '停车', '忙碌', '熄火'],
					itemWidth: 10,
					itemHeight: 10,
					textStyle: {
						itemGap: 12,
						color: [],
						fontStyle: 'normal',
						fontSize: 10,
					},
				},
				grid: {
					left: '5%',
					right: '5%',
					bottom: '5%',
					containLabel: true,
				},

				xAxis: {
					axisLabel: {
						textStyle: {
							color: '#fff',
							fontSize: 13,
						},
					},
					splitLine: {
						show: false,
					},
				},
				yAxis: {
					type: 'category',
					data: this.carTypeStatusList.map((item) => {
						return item.name;
					}),
					axisTick: { show: true },
					axisLabel: {
						textStyle: {
							color: '#fff',
							fontSize: 13,
						},
					},
					splitLine: {
						show: false,
					},
				},
				series: [
					{
						name: '离线',
						type: 'bar',
						stack: '状态',
						color: '#5f96e6',
						barWidth: 15,
						label: {
							normal: {
								show: false,
								position: 'insideRight',
							},
						},
						data: this.carTypeStatusList.map((item) => {
							return item.free_offline;
						}),
					},
					{
						name: '停车',
						type: 'bar',
						stack: '状态',
						color: '#57b6e4',
						barWidth: 15,
						label: {
							normal: {
								show: false,
								position: 'insideRight',
							},
						},
						data: this.carTypeStatusList.map((item) => {
							return item.free_stop;
						}),
					},
					{
						name: '忙碌',
						type: 'bar',
						stack: '状态',
						color: '#55ca95',
						barWidth: 15,
						label: {
							normal: {
								show: false,
								position: 'insideRight',
							},
						},
						data: this.carTypeStatusList.map((item) => {
							return item.busy;
						}),
					},
					{
						name: '熄火',
						type: 'bar',
						stack: '状态',
						color: '#ffba55',
						barWidth: 15,
						label: {
							normal: {
								show: false,
								position: 'insideRight',
							},
						},
						data: this.carTypeStatusList.map((item) => {
							return item.free_flameout;
						}),
					},
				],
			};
		},
	},
	watch: {
		cityInfo() {
			this.getCarTypeNumList();
			this.getCarSent();
			this.getCarList();
			this.getCarTypeStatus();
		},
	},
	created() {},
	mounted() {
		this.getCarTypeNumList();
		this.getCarSent();
		this.getCarList();
		this.getCarTypeStatus();
		this.timer = setInterval(() => {
			this.getCarTypeNumList();
			this.getCarSent();
			this.getCarTypeStatus();
		}, 600000);
	},
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
		//获取车辆出动频次
		getCarSent() {
			this.$store
				.dispatch('data/Car', {
					do: 'carOrder',
					region_id: this.cityInfo.region_id,
				})
				.then((res) => {
					if (res.code === 1) {
						this.carSentList = res.data;
					}
				});
		},
		//获取车辆列表
		getCarList() {
			this.$store
				.dispatch('data/Car', {
					do: 'carList',
					region_id: this.cityInfo.region_id,
				})
				.then((res) => {
					if (res.code === 1) {
						this.carList = res.data.data;
					}
				});
		},
		//车辆状态类型对比
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
	},
};
</script>

<style scoped="scoped" lang="scss">
@font-face {
	font-family: UNIDREAMLED;
	src: url('../../static/font/UNIDREAMLED.TTF');
}
.home {
	min-height: 100vh;
	background: url('../../static/transport_bg.jpg') no-repeat;
	background-size: cover;
	position: relative;
	.transport {
		background: url('../../static/transport.png') no-repeat;
		background-size: 100% 100%;
		position: fixed;
		top: 70%;
		left: 50%;
		margin-left: -12%;
		margin-top: -18%;
		width: 24%;
		height: 60%;
		.car {
			position: absolute;
			width: 80%;
			left: 50%;
			margin-left: -40%;
			top: 0%;
			animation: carenMove 3.6s ease-in-out infinite;
		}
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
				font-size: 4rem;
				font-family: UNIDREAMLED;
				position: relative;
				&:after {
					font-size: 1.2rem;
					font-style: italic;
					content: '运行中';
					position: absolute;
					bottom: 20px;
					right: -110px;
					width: 100px;
					font-weight: 600;
					letter-spacing: 0.2rem;
				}
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
		height: 100%;
		padding: 0rem 1.5rem 0rem 1.5rem;
		height: 23vh;
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
			height: 14vh;
			overflow: hidden;
			color: rgba(154, 168, 212, 1);
			.table-li {
				color: #fff;
				padding: 4px 0;
			}
		}
	}
}
@keyframes carenMove {
	0% {
		transform: translateY(0px);
	}

	50% {
		transform: translateY(25%);
	}

	100% {
		transform: translateY(0px);
	}
}
</style>
