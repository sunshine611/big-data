<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>
export default {
	name: 'app',
	data() {
		return {};
	},
	created() {},
	methods: {},
	computed: {},
};
</script>
<style lang="scss">
@import '~font-awesome/css/font-awesome.min.css';
#app {
	width: 100%;
	height: 100%;
}
.cash {
	position: fixed;
	width: 100%;
	height: 100%;
}
.mr-5 {
	margin-right: 5rem;
}
.ml-5 {
	margin-left: 5rem;
}
.pointer {
	cursor: pointer;
}
.vh1 {
	height: 1vh;
	width: 100%;
}
.vh2 {
	height: 2vh;
	width: 100%;
}
.vh4 {
	height: 4vh;
	width: 100%;
}
.vh5 {
	height: 5vh;
	width: 100%;
}
.relative {
	position: relative;
}
.text-hidden {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.amap-maptype-list {
	display: none !important;
}
.amap-maptypecontrol {
	bottom: 80px !important;
	top: auto;
}
</style>
