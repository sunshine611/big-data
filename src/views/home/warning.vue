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
				<div class="col-12">
					<div class="map">
						<div class="map-border map-top-left"></div>
						<div class="map-border map-top-right"></div>
						<div class="map-border map-bottom-left"></div>
						<div class="map-border map-bottom-right"></div>
						<div class="map-shadow map-top"></div>
						<div class="map-shadow map-right"></div>
						<div class="map-shadow map-bottom"></div>
						<div class="map-shadow map-left"></div>
						<div class="map-nav">
							<ul class="left">
								<li
									v-for="item in cityList"
									:key="item.id"
									@click="selectCity(item)"
									:class="{ on: item.id === on }"
								>
									<span class="relative"
										>{{ item.name
										}}<span class="tag" v-if="item.all !== 0">{{
											item.all
										}}</span></span
									>
								</li>
							</ul>
							<div class="right">
								<div class="num">
									<i>预警数量：</i>
									<span
										class="number"
										v-for="(item, index) in warningInfo.all.split('')"
										:key="index"
										>{{ item }}</span
									>
								</div>
								<div class="num">
									<i>今日预警：</i
									><span
										class="number"
										v-for="(item, index) in warningInfo.all.split('')"
										:key="index"
										>{{ item }}</span
									>
								</div>
							</div>
						</div>
						<el-amap
							ref="amapDemo"
							vid="amapDemo"
							viewMode="3D"
							:pitch="50"
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
			</div>
			<div class="row m-2 mt-4">
				<div class="col-12">
					<div class="border-bg">
						<div class="list list-top-left"></div>
						<div class="list list-top-right"></div>
						<div class="list list-bottom-left"></div>
						<div class="list list-bottom-right"></div>
						<div class="title">设备预警信息</div>
						<div class="vh4"></div>
						<el-table
							class="warning-table"
							:data="warningList"
							height="26vh"
							:header-cell-style="{
								background: 'transparent',
								borderBottom: 'none',
								color: '#ddd',
							}"
							:header-row-style="{ background: 'transparent' }"
							:row-style="{ background: 'rgba(8, 66, 167, 0.2)' }"
							:cell-style="{ borderBottom: '1px solid #083a98' }"
							row-class-name="warning-tr"
							@cell-click="selectRow"
						>
							<el-table-column
								prop="septic_tank_number"
								label="化粪池ID"
								width="180"
							>
							</el-table-column>
							<el-table-column
								prop="community_name"
								label="社区名称"
								width="180"
							>
							</el-table-column>
							<el-table-column prop="address" label="社区地址">
							</el-table-column>
							<el-table-column prop="property_name" label="所属物业公司">
							</el-table-column>
							<el-table-column prop="contact" label="社区联系人">
							</el-table-column>
							<el-table-column prop="mobile" label="联系人电话">
							</el-table-column>
							<el-table-column prop="current_volume" label="液位高度">
							</el-table-column>
							<el-table-column prop="update_time" label="报警时间">
							</el-table-column>
							<el-table-column prop="status_text" label="报警类型">
							</el-table-column>
						</el-table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import NavHead from '@/components/website/navHead';
import Echart from '@/components/echart/mixChart';
import { AMapManager } from 'vue-amap';
let amapManager = new AMapManager();
import { mapGetters } from 'vuex';
export default {
	name: 'warning',
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
			propertyList: [], //物业公司列表
			cityList: [], //城市列表
			on: '', //城市选中状态
			warningInfo: {
				all: '0',
				today: '0',
			},
			warningList: [], //预警信息列表
		};
	},
	computed: {
		...mapGetters(['userInfo', 'cityInfo']),
	},
	watch: {
		cityInfo() {
			this.getCityList();
		},
	},
	created() {
		this.getCityList();
	},
	mounted() {},
	methods: {
		//获取城市列表
		getCityList() {
			let params = { do: 'districtList', region_id: this.cityInfo.region_id };
			this.$store
				.dispatch('data/Device', params)
				.then((res) => {
					if (res.code === 1) {
						this.cityList = res.data;
						if (this.cityList.length > 0) {
							this.on = this.cityList[0].id;
						}
					}
				})
				.then(() => {
					this.getWarningList();
				});
		},
		//获取预警信息列表
		getWarningList() {
			let params = { do: 'district', region_id: this.on };
			this.$store.dispatch('data/Device', params).then((res) => {
				if (res.code === 1) {
					this.warningInfo.all = String(res.data.all);
					this.warningInfo.today = String(res.data.today);
					this.warningList = res.data.deviceInfo;
					this.markers = this.warningList.map((item, index) => {
						if (index === 0) {
							this.center = [item.lng, item.lat];
						}
						return {
							position: [item.lng, item.lat],
							title: '名称：' + item.community_name + '\n地址：' + item.address,
						};
					});
				}
			});
		},
		//选择城市
		selectCity(item) {
			this.on = item.id;
			this.center = [item.lng, item.lat];
			this.getWarningList();
		},
		//表格行选中
		selectRow(row) {
			this.center = [row.lng, row.lat];
			this.zoom = 20;
		},
	},
};
</script>

<style lang="scss" scoped="scoped">
@font-face {
	font-family: UNIDREAMLED;
	src: url('../../static/font/UNIDREAMLED.TTF');
}
.property {
	min-height: 100vh;
	background: url('../../static/transport_bg.jpg') no-repeat;
	background-size: cover;
	position: relative;
	.map {
		width: 100%;
		height: 49vh;
		position: relative;
		border: 1px solid #0842a7;
		.map-border {
			position: absolute;
			background: url('../../static/border_bg5.png') no-repeat;
			background-size: 100%;
			width: 1.2rem;
			height: 1.2rem;
			z-index: 11;
			&.map-top-left {
				left: -1px;
				top: -1px;
			}
			&.map-top-right {
				right: -1px;
				top: -1px;
				transform: rotate(90deg);
			}
			&.map-bottom-left {
				left: -1px;
				bottom: -1px;
				transform: rotate(270deg);
			}
			&.map-bottom-right {
				right: -1px;
				bottom: -1px;
				transform: rotate(180deg);
			}
		}
		.map-shadow {
			position: absolute;
			z-index: 10;
			&.map-top {
				left: 0px;
				top: 0px;
				width: 100%;
				height: 10px;
				background-image: linear-gradient(
					to bottom,
					rgba(8, 66, 167, 0.8),
					rgba(0, 0, 0, 0)
				);
			}
			&.map-right {
				right: 0px;
				top: 0px;
				width: 10px;
				height: 100%;
				background-image: linear-gradient(
					to left,
					rgba(8, 66, 167, 0.8),
					rgba(0, 0, 0, 0)
				);
			}
			&.map-bottom {
				left: 0px;
				bottom: 0px;
				width: 100%;
				height: 10px;
				background-image: linear-gradient(
					to top,
					rgba(8, 66, 167, 0.8),
					rgba(0, 0, 0, 0)
				);
			}
			&.map-left {
				left: 0px;
				top: 0px;
				width: 10px;
				height: 100%;
				background-image: linear-gradient(
					to right,
					rgba(8, 66, 167, 0.8),
					rgba(0, 0, 0, 0)
				);
			}
		}
		.map-nav {
			width: 100%;
			position: absolute;
			width: 100%;
			top: 0px;
			left: 0px;
			z-index: 100;
			.left {
				float: left;
				width: 60%;
				overflow-x: auto;
				color: #00f6fa;
				white-space: nowrap;
				margin: 0;
				height: 3.6rem;
				line-height: 3.6rem;
				&::-webkit-scrollbar {
					display: none; /* Chrome Safari */
				}
				li {
					list-style: none;
					margin: 0 20px;
					display: inline-block;
					cursor: pointer;
					position: relative;
					&.on {
						color: #e69f4d;
					}
					.tag {
						position: absolute;
						background: #f00;
						width: 16px;
						height: 16px;
						border-radius: 50%;
						color: #fff;
						display: flex;
						align-items: center;
						justify-content: center;
						right: -8px;
						top: -6px;
						font-size: 0.8rem;
					}
				}
			}
			.right {
				padding-top: 15px;
				display: inline-block;
				color: #00f6fa;
				font-size: 1.4rem;
				width: 40%;
				text-align: right;
				.num {
					display: inline-block;
					margin-right: 1.5rem;
					.number {
						display: inline-block;
						background: url(../../static/number.png) no-repeat;
						background-size: 100% 100%;
						width: 1.8rem;
						height: 2.6rem;
						font-family: UNIDREAMLED;
						font-size: 1.8rem;
						color: #fff;
						text-align: center;
						line-height: 2.6rem;
						margin: 0 5px;
					}
				}
			}
		}
	}
	.border-bg {
		position: relative;
		height: 100%;
		padding: 0rem 1.5rem 0rem 1.5rem;
		height: 32vh;
		border: 1px solid #0842a7;
		background: rgba(8, 66, 167, 0.1);
		box-shadow: 0px 0px 15px rgba(0, 229, 255, 0.3) inset;
		.list {
			position: absolute;
			background: url('../../static/border_bg5.png') no-repeat;
			background-size: 100%;
			width: 1.2rem;
			height: 1.2rem;
			z-index: 11;
			&.list-top-left {
				left: -1px;
				top: -1px;
			}
			&.list-top-right {
				right: -1px;
				top: -1px;
				transform: rotate(90deg);
			}
			&.list-bottom-left {
				left: -1px;
				bottom: -1px;
				transform: rotate(270deg);
			}
			&.list-bottom-right {
				right: -1px;
				bottom: -1px;
				transform: rotate(180deg);
			}
		}
		.title {
			background: url('../../static/title_right.png') no-repeat 140px center;
			color: #e69f4d;
			font-size: 1.2rem;
			position: absolute;
			top: 1vh;
			width: 100%;
			letter-spacing: 0.1rem;
		}
		.warning-table {
			width: 100%;
			background: transparent;
			color: #ddd;
			&::before {
				background-color: transparent;
			}
			tr {
				background: transparent;
			}
			th {
				background: transparent;
			}
			.warning-tr {
				&:hover {
					td {
						color: #029aff;
						background-color: rgba(8, 66, 167, 0.3) !important;
					}
				}
			}
		}
	}
}
</style>
<style>
.el-table--enable-row-hover .el-table__body tr:hover > td {
	background-color: rgba(8, 66, 167, 0.3) !important;
}
</style>
