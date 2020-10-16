<template>
	<div class="property">
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
				<div class="col-8">
					<div class="map">
						<div class="map-border map-top-left"></div>
						<div class="map-border map-top-right"></div>
						<div class="map-border map-bottom-left"></div>
						<div class="map-border map-bottom-right"></div>
						<div class="title">小区坐标点位图</div>
						<el-amap
							ref="amapDemo"
							vid="amapDemo"
							viewMode="3D"
							:pitch="20"
							:zoom="zoom"
							:center="center"
							class="map-view"
							:amap-manager="amapManager"
							:events="mapEvents"
						>
							<el-amap-marker
								v-for="(marker, index) in markers"
								:key="index"
								:position="marker.position"
								:events="marker.events"
								:visible="marker.visible"
								:icon="marker.icon"
								:title="marker.title"
								:draggable="marker.draggable"
								:vid="index"
							></el-amap-marker>
						</el-amap>
					</div>
				</div>
				<div class="col-4">
					<div class="row">
						<div class="col-12 mb-4">
							<div class="border-bg1">
								<div class="title">设备预警图</div>
								<router-link class="text-detail" to="/warning"
									>查看详情 <i class="fa fa-plus-square-o"></i
								></router-link>
								<Echart
									height="100%"
									width="100%"
									:chartUpdate="chart1"
								></Echart>
							</div>
						</div>
						<div class="col-12">
							<div class="border-bg1">
								<div class="title">设备列表</div>
								<div class="vh4"></div>
								<div class="row list-title">
									<div class="col-2">设备编号</div>
									<div class="col-3">小区名称</div>
									<div class="col-2">液位高度</div>
									<div class="col-2">气体浓度</div>
									<div class="col-3">报警类型</div>
								</div>
								<vue-seamless-scroll
									:data="deviceList"
									:class-option="{ step: 0.3, hoverStop: true }"
									class="seamless-warp"
								>
									<div
										class="row table-li"
										v-for="(item, index) in deviceList"
										:key="index"
									>
										<div class="col-2 text-hidden">{{ item.deviceNo }}</div>
										<div class="col-3 text-hidden">{{ item.name }}</div>
										<div class="col-2 text-hidden">{{ item.deep }}</div>
										<div class="col-2 text-hidden">
											{{ item.concentration }}
										</div>
										<div class="col-3 text-hidden">{{ item.type }}</div>
									</div>
								</vue-seamless-scroll>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="row m-2 mt-4">
				<div class="col-4">
					<div class="border-bg1">
						<div class="title">物业列表</div>
						<div class="vh4"></div>
						<div class="row list-title">
							<div class="col-3">物业公司</div>
							<div class="col-3">地址</div>
							<div class="col-2">管辖小区</div>
							<div class="col-2">设备</div>
							<div class="col-2">总单量</div>
						</div>
						<vue-seamless-scroll
							:data="propertyList"
							:class-option="{ step: 0.3, hoverStop: true }"
							class="seamless-warp"
						>
							<div
								class="row table-li"
								v-for="(item, index) in propertyList"
								:key="index"
							>
								<div class="col-3 text-hidden">{{ item.name }}</div>
								<div class="col-3 text-hidden">{{ item.address }}</div>
								<div class="col-2 text-hidden">{{ item.manage }}</div>
								<div class="col-2 text-hidden">
									{{ item.scale }}
								</div>
								<div class="col-2 text-hidden">{{ item.all_order }}</div>
							</div>
						</vue-seamless-scroll>
					</div>
				</div>
				<div class="col-4">
					<div class="border-bg1">
						<div class="title">街道列表</div>
						<div class="vh4"></div>
						<div class="row list-title">
							<div class="col-3">街道名称</div>
							<div class="col-3">负责小区数</div>
							<div class="col-3">负责人姓名</div>
							<div class="col-3">联系方式</div>
						</div>
						<vue-seamless-scroll
							:data="streetList"
							:class-option="{ step: 0.3, hoverStop: true }"
							class="seamless-warp"
						>
							<div
								class="row table-li"
								v-for="(item, index) in streetList"
								:key="index"
							>
								<div class="col-3 text-hidden">{{ item.name }}</div>
								<div class="col-3 text-hidden">{{ item.manage }}个</div>
								<div class="col-3 text-hidden">{{ item.contact }}</div>
								<div class="col-3 text-hidden">{{ item.mobile }}</div>
							</div>
						</vue-seamless-scroll>
					</div>
				</div>
				<div class="col-4">
					<div class="border-bg1">
						<div class="title">小区列表</div>
						<div class="vh4"></div>
						<div class="row list-title">
							<div class="col-4">小区名称</div>
							<div class="col-4">地址</div>
							<div class="col-2">化粪池</div>
							<div class="col-2">总单量</div>
						</div>
						<vue-seamless-scroll
							:data="communityList"
							:class-option="{ step: 0.3, hoverStop: true }"
							class="seamless-warp"
						>
							<div
								class="row table-li"
								v-for="(item, index) in communityList"
								:key="index"
							>
								<div class="col-4 text-hidden">{{ item.name }}</div>
								<div class="col-4 text-hidden">{{ item.address }}</div>
								<div class="col-2 text-hidden">{{ item.scale }}</div>
								<div class="col-2 text-hidden">{{ item.all_order }}</div>
							</div>
						</vue-seamless-scroll>
					</div>
				</div>
			</div>
		</div>
		<el-dialog
			width="800px"
			:visible.sync="warningDialog"
			:append-to-body="true"
			custom-class="warning-box"
			:modal="false"
			:show-close="false"
		>
			<template slot="title">
				<div class="clearfix relative">
					<div class="pull-left">
						<div class="warning-title">预警详情类型</div>
					</div>
					<div class="pull-right">
						<ul class="warning-menu">
							<li
								:class="warningShow === 1 ? 'on' : ''"
								@click="switchWarnig(1)"
							>
								待处理
							</li>
							<li
								:class="warningShow === 2 ? 'on' : ''"
								@click="switchWarnig(2)"
							>
								处理中
							</li>
							<li
								:class="warningShow === 3 ? 'on' : ''"
								@click="switchWarnig(3)"
							>
								已处理
							</li>
						</ul>
					</div>
					<i
						class="fa fa-times-circle-o close-icon"
						@click="warningDialog = false"
					></i>
				</div>
			</template>
			<div class="content" v-if="warningShow === 1">
				<div class="row list-title">
					<div class="col-4">小区名称</div>
					<div class="col-4">所在地址</div>
					<div class="col-4">预警类型</div>
				</div>
				<vue-seamless-scroll
					:data="warningList.init"
					:class-option="{ step: 0.3, hoverStop: true }"
					class="seamless-warp"
				>
					<div
						class="row table-li"
						v-for="(item, index) in warningList.init"
						:key="index"
					>
						<div class="col-4 text-hidden">{{ item.name }}</div>
						<div class="col-4 text-hidden">{{ item.address }}</div>
						<div class="col-4 text-hidden">
							<img v-if="item.type === 1" src="../../static/warning1.png" />
							<img
								v-else-if="item.type === 2"
								src="../../static/warning2.png"
							/>
							<img
								v-else-if="item.type === 3"
								src="../../static/warning3.png"
							/>
						</div>
					</div>
				</vue-seamless-scroll>
			</div>
			<div class="content" v-if="warningShow === 2">
				<div class="row list-title">
					<div class="col-4">小区名称</div>
					<div class="col-4">所在地址</div>
					<div class="col-4">预警类型</div>
				</div>
				<vue-seamless-scroll
					:data="warningList.working"
					:class-option="{ step: 0.3, hoverStop: true }"
					class="seamless-warp"
				>
					<div
						class="row table-li"
						v-for="(item, index) in warningList.working"
						:key="index"
					>
						<div class="col-4 text-hidden">{{ item.name }}</div>
						<div class="col-4 text-hidden">{{ item.address }}</div>
						<div class="col-4 text-hidden">
							<img v-if="item.type === 1" src="../../static/warning1.png" />
							<img
								v-else-if="item.type === 2"
								src="../../static/warning2.png"
							/>
							<img
								v-else-if="item.type === 3"
								src="../../static/warning3.png"
							/>
						</div>
					</div>
				</vue-seamless-scroll>
			</div>
			<div class="content" v-if="warningShow === 3">
				<div class="row list-title">
					<div class="col-4">小区名称</div>
					<div class="col-4">所在地址</div>
					<div class="col-4">预警类型</div>
				</div>
				<vue-seamless-scroll
					:data="warningList.done"
					:class-option="{ step: 0.3, hoverStop: true }"
					class="seamless-warp"
				>
					<div
						class="row table-li"
						v-for="(item, index) in warningList.done"
						:key="index"
					>
						<div class="col-4 text-hidden">{{ item.name }}</div>
						<div class="col-4 text-hidden">{{ item.address }}</div>
						<div class="col-4 text-hidden">
							<img v-if="item.type === 1" src="../../static/warning1.png" />
							<img
								v-else-if="item.type === 2"
								src="../../static/warning2.png"
							/>
							<img
								v-else-if="item.type === 3"
								src="../../static/warning3.png"
							/>
						</div>
					</div>
				</vue-seamless-scroll>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import NavHead from '@/components/website/navHead';
import Echart from '@/components/echart/mixChart';
import { AMapManager } from 'vue-amap';
let amapManager = new AMapManager();
import { mapGetters } from 'vuex';
export default {
	name: 'property',
	components: {
		NavHead,
		Echart,
	},
	data() {
		return {
			zoom: 13,
			center: [119.357289, 26.086752],
			markers: [],
			amapManager,
			mapEvents: {
				init(o) {
					o.setMapStyle('amap://styles/dc144a5e2c871ded3ed66a3b29e667fd'); //自定义的高德地图的样式
				},
			},
			deviceList: [], //物业公司列表
			propertyList: [], //物业公司列表
			communityList: [], //小区列表
			streetList: [], //街道列表
			warningData: {
				normal: [],
				warning: [],
			}, //设备预警
			warningList: {
				init: [],
				working: [],
				done: [],
			}, //预警列表
			warningDialog: false, //预警列表弹层
			warningShow: 1, //控制预警弹层内容显示
		};
	},
	computed: {
		...mapGetters(['userInfo', 'cityInfo']),
		chart1() {
			return {
				legend: {
					center: 'center',
					bottom: 10,
					data: ['正常', '预警'],
					textStyle: {
						color: '#fff',
					},
				},
				xAxis: {
					name: '气体浓度',
					nameTextStyle: {
						color: '#fff',
						fontSize: 10,
					},
					axisLine: {
						lineStyle: {
							color: 'rgba(255,255,255,0.5)',
						},
					},
					axisLabel: {
						textStyle: {
							fontSize: 12,
							color: '#fff',
						},
					},
					splitLine: {
						lineStyle: {
							color: 'rgba(255,255,255,0.2)',
						},
					},
				},
				yAxis: {
					name: '液位深度',
					nameTextStyle: {
						color: '#fff',
						fontSize: 10,
					},
					axisLine: {
						lineStyle: {
							color: 'rgba(255,255,255,0.5)',
						},
					},
					axisLabel: {
						margin: 10,
						textStyle: {
							fontSize: 12,
							color: '#fff',
						},
					},
					splitLine: {
						lineStyle: {
							color: 'rgba(255,255,255,0.2)',
						},
					},
					scale: true,
				},
				series: [
					{
						name: '正常',
						data: this.warningData.normal,
						type: 'scatter',
						symbolSize: function(data) {
							return Math.sqrt(data[2]);
						},
						emphasis: {
							label: {
								show: true,
								textStyle: {
									color: '#fff',
								},
								formatter: function(param) {
									return (
										param.data[3] +
										'\n气体浓度：' +
										param.data[0] +
										'\n液位深度：' +
										param.data[1]
									);
								},
								position: 'top',
							},
						},
						itemStyle: {
							color: '#01ee6a',
						},
					},
					{
						name: '预警',
						data: this.warningData.warning,
						type: 'scatter',
						symbolSize: function(data) {
							return Math.sqrt(data[2]);
						},
						emphasis: {
							label: {
								show: true,
								textStyle: {
									color: '#fff',
								},
								formatter: function(param) {
									return (
										param.data[3] +
										'\n气体浓度：' +
										param.data[0] +
										'\n液位深度：' +
										param.data[1]
									);
								},
								position: 'top',
							},
						},
						itemStyle: {
							color: '#e55564',
						},
					},
				],
			};
		},
	},
	watch: {
		cityInfo() {
			this.getDeviceList();
			this.getPropertyList();
			this.getStreetList();
			this.getPropertyGps();
			this.getWarningData();
			this.getWarningList();
		},
	},
	created() {
		this.getDeviceList();
		this.getPropertyList();
		this.getStreetList();
		this.getPropertyGps();
		this.getWarningData();
		this.getWarningList();
	},
	mounted() {},
	methods: {
		//获取设备列表
		getDeviceList() {
			this.$store
				.dispatch('data/Property', {
					do: 'device',
					region_id: this.cityInfo.region_id,
				})
				.then((res) => {
					this.deviceList = res.data;
				});
		},
		//获取小区列表
		getPropertyGps() {
			this.$store
				.dispatch('data/Property', {
					do: 'community',
					region_id: this.cityInfo.region_id,
				})
				.then((res) => {
					this.communityList = res.data;
					if (this.communityList.length > 0) {
						this.center = [res.data[0].lng, res.data[0].lat];
					}
					this.markers = res.data.map((item) => {
						return {
							position: [item.lng, item.lat],
							title: '名称：' + item.name + '\n地址：' + item.address,
						};
					});
				});
		},
		//获取物业列表
		getPropertyList() {
			this.$store
				.dispatch('data/Property', {
					do: 'property',
					region_id: this.cityInfo.region_id,
				})
				.then((res) => {
					this.propertyList = res.data;
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
		//获取设备预警数据
		getWarningData() {
			this.$store
				.dispatch('data/Property', {
					do: 'deviceWarning',
					region_id: this.cityInfo.region_id,
				})
				.then((res) => {
					if (res.code === 1) {
						this.warningData = res.data;
					}
				});
		},
		//获取预警列表
		getWarningList() {
			this.$store
				.dispatch('data/Property', {
					do: 'warningDetail',
					region_id: this.cityInfo.region_id,
				})
				.then((res) => {
					if (res.code === 1) {
						this.warningList = res.data;
					}
				});
		},
		//切换预警
		switchWarnig(val) {
			if (val === 1) {
				this.warningShow = 1;
			} else if (val === 2) {
				this.warningShow = 2;
			} else if (val === 3) {
				this.warningShow = 3;
			}
		},
	},
};
</script>

<style scoped="scoped" lang="scss">
.property {
	min-height: 100vh;
	background: url('../../static/transport_bg.jpg') no-repeat;
	background-size: cover;
	position: relative;
	.map {
		width: 100%;
		height: 55vh;
		padding: 1rem;
		border-radius: 5px;
		position: relative;
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
		.title {
			position: absolute;
			left: 2rem;
			top: 1.6rem;
			font-size: 1.2rem;
			z-index: 999;
			color: #07fcff;
			// text-shadow: 0px 0px 5px #07fcff;
		}
		.map-view {
			border-radius: 8px;
			overflow: hidden;
			box-shadow: 0px 0px 15px #1b6aa9;
		}
	}
	.border-bg1 {
		position: relative;
		background: url('../../static/border_bg1.png') no-repeat;
		background-size: 100% 100%;
		height: 100%;
		padding: 0rem 1.5rem 0rem 1.5rem;
		height: 26vh;
		.title {
			font-size: 1rem;
			position: absolute;
			color: #07fcff;
			top: -1vh;
			width: 100%;
			text-align: center;
			letter-spacing: 0.1rem;
		}
		.text-detail {
			color: #07fcff;
			position: absolute;
			right: 5rem;
			top: 1.5rem;
			line-height: 1rem;
			cursor: pointer;
			z-index: 999;
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
			height: 16.4vh;
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
<style lang="scss">
.warning-box {
	background: rgba(21, 66, 112, 0.8);
	box-shadow: 0px 0px 10px #409eff;
	border-radius: 5px;
	height: 400px;

	.el-dialog__body {
		padding: 0px;
	}
	.content {
		overflow: hidden;
		color: #fff;
		text-align: center;
		position: relative;
		&:before {
			content: '';
			border-left: 3px solid #00f6fa;
			height: 80%;
			position: absolute;
			left: 0px;
			top: 0%;
		}
		&:after {
			content: '';
			border-left: 3px solid #00f6fa;
			height: 80%;
			position: absolute;
			right: 0px;
			top: 0%;
		}
		.list-title {
			font-size: 1rem;
		}
		.seamless-warp {
			margin-top: 1rem;
			font-size: 1rem;
			text-align: center;
			height: 260px;
			overflow: hidden;
			color: rgba(154, 168, 212, 1);
			.table-li {
				color: #fff;
				padding: 5px 0;
				border-bottom: 1px solid rgba(154, 168, 212, 0.3);
				.text-hidden {
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
		}
	}
	.warning-title {
		width: 250px;
		height: 40px;
		font-size: 1.2rem;
		color: #fff;
		text-align: center;
		background: url('../../static/warning_title_bg.png') center bottom no-repeat;
		background-size: 100%;
	}
	.warning-menu {
		margin-right: 3rem;
		display: flex;
		align-items: center;
		justify-content: space-around;
		height: 40px;
		width: 320px;
		li {
			float: left;
			color: #fff;
			font-size: 1rem;
			padding: 2px 18px;
			list-style: none;
			cursor: pointer;
			transition: all 0.5s;
			border-radius: 20px;
			&:hover {
				background-image: linear-gradient(to right, #0e61bb, #06b4f6);
			}
			&.on {
				background-image: linear-gradient(to right, #0e61bb, #06b4f6);
			}
		}
	}
	.close-icon {
		position: absolute;
		right: 0rem;
		top: 0.5rem;
		font-size: 1.6rem;
		color: #08c8d9;
		cursor: pointer;
		&:hover {
			color: #00f6fa;
		}
	}
}
</style>
