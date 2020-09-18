<template>
	<div class="car-map">
		<div class="data-view">
			<!-- <el-cascader
				class="city-select"
				v-model="city"
				:options="cityList"
				:props="props"
				filterable
				:show-all-levels="false"
				placeholder="请选择城市"
			></el-cascader> -->
			<el-select
				v-model="form.city"
				size="small"
				class="city-select"
				placeholder="请选择城市"
				@change="selectCity"
			>
				<el-option label="福州" :value="1"></el-option>
				<el-option label="泉州" :value="2"></el-option>
				<el-option label="三明" :value="3"></el-option>
				<el-option label="南平" :value="4"></el-option>
			</el-select>
			<div class="view-content">
				<div class="title">大数据监控</div>
				<div class="table">
					<div
						class="table-li"
						v-for="(item, index) in carTypeNumList"
						:key="index"
					>
						<div class="num-box">
							<span class="num">{{ item.value }}</span
							>辆
						</div>
						<div class="car-name">{{ item.name }}</div>
					</div>
				</div>
			</div>
		</div>
		<el-amap
			vid="amapDemo"
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
</template>
<script>
import { AMapManager } from 'vue-amap';
let amapManager = new AMapManager();
import { mapGetters } from 'vuex';
export default {
	name: 'CarMap',
	components: {},
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
			checkList: [1, 2, 3, 4], //选中项
			form: {
				city: '',
				carType: '',
			},
			loadding: false,
			activeNames: ['1'],
			city: [],
			cityList: [], //城市列表
			props: {
				value: 'id',
				label: 'name',
				children: 'children',
				emitPath: false,
				checkStrictly: true,
			},
			carTypeNumList: [],
		};
	},
	created() {
		this.getCityList();
		this.getCarTypeNumList();
	},
	mounted() {
		this.getCarGps();
		setInterval(() => {
			this.getCarGps();
		}, 60000);
	},
	computed: {
		...mapGetters(['userInfo', 'cityInfo']),
	},
	methods: {
		//获取车辆定位
		getCarGps() {
			let params = { do: 'carList', city: this.form.city };
			this.$store.dispatch('data/Map', params).then((res) => {
				if (res.code === 1) {
					this.center = [res.data[0].lat, res.data[0].lng];
					this.markers = res.data.map((item) => {
						if (item.type === 4) {
							return {
								position: [item.lat, item.lng],
								title: '车辆类型：' + item.name + '\n车牌：' + item.car_number,
								icon:
									'https://hengya.obs.cn-south-1.myhuaweicloud.com/dataview/stain.png',
								events: {
									click: () => {
										let routeUrl = this.$router.resolve({
											path: '/gps-map',
											query: { id: item.id },
										});
										window.open(routeUrl.href, '_blank');
									},
								},
							};
						} else if (item.type === 1) {
							return {
								position: [item.lat, item.lng],
								title: '车辆类型：' + item.name + '\n车牌：' + item.car_number,
								icon:
									'https://hengya.obs.cn-south-1.myhuaweicloud.com/dataview/clean.png',
								events: {
									click: () => {
										let routeUrl = this.$router.resolve({
											path: '/gps-map',
											query: { id: item.id },
										});
										window.open(routeUrl.href, '_blank');
									},
								},
							};
						} else if (item.type === 2) {
							return {
								position: [item.lat, item.lng],
								title: '车辆类型：' + item.name + '\n车牌：' + item.car_number,
								icon:
									'https://hengya.obs.cn-south-1.myhuaweicloud.com/dataview/tool.png',
								events: {
									click: () => {
										let routeUrl = this.$router.resolve({
											path: '/gps-map',
											query: { id: item.id },
										});
										window.open(routeUrl.href, '_blank');
									},
								},
							};
						} else if (item.type === 3) {
							return {
								position: [item.lat, item.lng],
								title: '车辆类型：' + item.name + '\n车牌：' + item.car_number,
								icon:
									'https://hengya.obs.cn-south-1.myhuaweicloud.com/dataview/transport.png',
								events: {
									click: () => {
										let routeUrl = this.$router.resolve({
											path: '/gps-map',
											query: { id: item.id },
										});
										window.open(routeUrl.href, '_blank');
									},
								},
							};
						}
					});
					setTimeout(() => {
						var map = amapManager.getMap();
						map.plugin(['AMap.MapType'], function() {
							//地图类型切换
							var type = new AMap.MapType({
								defaultType: 0, //使用2D地图
							});
							map.addControl(type);
						});
					}, 1000);
				}
			});
		},
		//获取城市列表
		getCityList() {
			this.$store.dispatch('data/City').then((res) => {
				if (res.code === 1) {
					this.cityList = res.data;
				}
			});
		},
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
		//选择城市
		selectCity(value) {
			this.form.city = value;
			this.getCarGps();
		},
	},
};
</script>

<style lang="scss">
@font-face {
	font-family: UNIDREAMLED;
	src: url('../../static/font/UNIDREAMLED.TTF');
}
.car-map {
	.map-view {
		height: 100vh;
		width: 100wh;
	}
	.data-view {
		position: fixed;
		right: 20px;
		top: 20px;
		width: 300px;
		z-index: 100;
		.city-select {
			width: 100%;
			margin-bottom: 20px;
			.el-input__inner {
				height: 37px;
				background: rgba($color: #0d294e, $alpha: 0.7);
				border: 1.5px solid #409eff;
				box-shadow: 0px 0px 6px #08e8f4;
				border-radius: 5px;
				box-sizing: border-box;
				color: #08e8f4;
			}

			.el-cascader__tags {
				.el-cascader__search-input {
					background-color: transparent;
				}
				input::placeholder {
					color: transparent;
				}
				.el-tag {
					background: #062647;
				}
			}

			.el-select__caret {
				color: #409eff;
			}
		}
		.view-content {
			background: rgba($color: #0d294e, $alpha: 0.7);
			border: 1.5px solid #409eff;
			box-shadow: 0px 0px 6px #08e8f4;
			border-radius: 5px;
			text-align: center;
			.title {
				display: inline-block;
				width: 80%;
				height: 55px;
				line-height: 55px;
				font-size: 1.4rem;
				color: #fff;
				background: url('../../static/warning_title_bg.png') center bottom
					no-repeat;
				background-size: 100%;
			}
			.table {
				display: table;
				.table-li {
					width: 50%;
					text-align: center;
					color: #00eeed;
					float: left;
					.num-box {
						height: 80px;
						.num {
							font-size: 4rem;
							font-family: UNIDREAMLED;
							margin-right: 5px;
						}
					}
					.car-name {
						color: #4c82c0;
					}
				}
			}
		}
	}
}
</style>
