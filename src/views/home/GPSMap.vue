<template>
	<div class="gps-map">
		<div class="opera-area">
			<el-button @click="play" type="primary" size="small">播放</el-button>
			<el-button @click="stopPlay" type="primary" size="small"
				>暂停播放</el-button
			>
			<el-button @click="continuePlay" type="primary" size="small"
				>继续播放</el-button
			>
		</div>
		<el-amap
			vid="amapDemo"
			:center="center"
			:amap-manager="amapManager"
			:zoom="zoom"
			class="amap-demo"
			v-loading="loadding"
			:events="mapEvents"
		>
		</el-amap>
	</div>
</template>
<script>
import { AMapManager } from 'vue-amap';
let amapManager = new AMapManager();
export default {
	name: 'gpsMap',
	data() {
		return {
			id: this.$route.query.id,
			mapEvents: {
				init(o) {
					o.setMapStyle('amap://styles/dc144a5e2c871ded3ed66a3b29e667fd'); //自定义的高德地图的样式
				},
			},
			zoom: 14,
			center: [119.357289, 26.086752],
			amapManager,
			marker: {},
			map: {},
			polyline: {},
			passedPolyline: {},
			lineArr: [],
			timeArr: [],
			loadding: false,
		};
	},
	created() {
		this.getCarGps();
	},
	mounted() {
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
	},
	computed: {},
	updated() {},
	watch: {},
	methods: {
		//开始回放
		play() {
			this.marker.moveAlong(this.lineArr, 200);
		},
		//停止回放
		stopPlay() {
			this.marker.pauseMove();
		},
		//继续回放
		continuePlay() {
			this.marker.resumeMove();
		},
		//获取车辆轨迹
		getCarGps() {
			this.loadding = true;
			let params = { do: 'gpsLocus', id: this.id };
			this.$store
				.dispatch('data/Map', params)
				.then((res) => {
					if (res.code === 1) {
						this.lineArr = res.data.map((item) => {
							return [item.lon_c, item.lat_c];
						});
						if (res.data.length === 0) {
							this.$message.warning('该日期区间暂无路线轨迹');
							this.center = [119.357289, 26.086752];
						} else {
							this.center = this.lineArr[0];
						}
					}
				})
				.then(() => {
					var self = this;
					self.map = amapManager.getMap();
					self.map.clearMap();
					self.marker = new AMap.Marker({
						map: self.map,
						position: self.center,
						icon: 'https://webapi.amap.com/images/car.png',
						offset: new AMap.Pixel(-26, -13),
						autoRotation: true,
						angle: -90,
					});
					//构建轨迹
					self.polyline = new AMap.Polyline({
						map: self.map,
						path: self.lineArr,
						showDir: true,
						strokeColor: '#28F', //线颜色
						// strokeOpacity: 1,     //线透明度
						strokeWeight: 6, //线宽
						// strokeStyle: "solid"  //线样式
					});
					//构建移动轨迹
					self.passedPolyline = new AMap.Polyline({
						map: self.map,
						// path: lineArr,
						strokeColor: '#AF5', //线颜色
						// strokeOpacity: 1,     //线透明度
						strokeWeight: 6, //线宽
						// strokeStyle: "solid"  //线样式
					});
					self.marker.on('moving', function(e) {
						self.passedPolyline.setPath(e.passedPath);
					});
					self.map.setFitView();
					this.loadding = false;
				});
		},
	},
};
</script>
<style lang="scss" scoped>
.gps-map {
	.opera-area {
		position: fixed;
		left: 20px;
		top: 20px;
		z-index: 10;
	}
	.amap-demo {
		height: 100vh;
		width: 100%;
	}
}
</style>
