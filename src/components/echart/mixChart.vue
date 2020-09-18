<template>
	<div
		:class="className"
		:style="{ height: height, width: width }"
		:ref="'echart'"
	></div>
</template>
<script>
export default {
	components: {},
	props: {
		className: {
			type: String,
			default: 'chart',
		},
		width: {
			type: String,
			default: '200px',
		},
		height: {
			type: String,
			default: '200px',
		},
		chartUpdate: {
			type: Object,
		},
	},
	data() {
		return {};
	},
	computed: {},
	created() {},
	mounted() {
		// this.$nextTick(() => {
		this.initChart();
		// });
	},
	watch: {
		chartUpdate: {
			handler(val) {
				this.updateChart(val);
			},
			deep: true,
		},
	},
	methods: {
		initChart() {
			let self = this;
			this.chart = this.$echarts.init(this.$refs.echart);
			this.chart.setOption(this.chartUpdate);
			setTimeout(() => {
				window.onresize = function() {
					self.chart.resize();
				};
			}, 20);
		},
		updateChart(val) {
			this.chart.clear();
			this.chart.setOption(val);
		},
	},
};
</script>
<style lang="scss" scoped></style>
