<template>
	<div class="tag-cloud">
		<svg
			:width="width"
			:height="height"
			@mousemove="listener($event)"
			ref="tagSvg"
		>
			<a
				:href="tag.href"
				rel="external nofollow"
				v-for="(tag, index) in tags"
				:key="index"
				class="tag-text"
			>
				<text
					:x="tag.x"
					:y="tag.y"
					:font-size="20 * (600 / (600 - tag.z))"
					:fill-opacity="(400 + tag.z) / 600"
					fill="#fff"
				>
					{{ tag.text }}
				</text>
			</a>
		</svg>
	</div>
</template>

<script>
export default {
	name: 'tagCloud',
	data() {
		return {
			// width: 700,
			// height: 700,
			RADIUS: 200, //球的半径
			speedX: Math.PI / 360, //球一帧绕x轴旋转的角度
			speedY: Math.PI / 360, //球-帧绕y轴旋转的角度
			tags: [],
			timer: null,
			streetList: this.data, //街道列表
		};
	},
	props: {
		width: {
			type: String,
			default: '500px',
		},
		height: {
			type: String,
			default: '500px',
		},
		data: {
			type: Array,
		},
	},
	created() {},
	mounted() {
		this.createData();
		this.timer = setInterval(() => {
			this.createData();
			if (this.data.length > 0) {
				clearInterval(this.timer);
			}
		}, 500);
		setInterval(() => {
			this.rotateX(this.speedX);
			this.rotateY(this.speedY);
		}, 17);
	},
	beforeDestroy() {
		if (this.timer) {
			clearInterval(this.timer);
		}
	},
	watch: {
		data: {
			handler(newData, oldData) {
				this.streetList = newData;
				this.createData();
			},
			deep: true,
		},
	},
	computed: {
		CX() {
			//球心x坐标
			return this.$refs.tagSvg.clientWidth / 2;
		},
		CY() {
			//球心y坐标
			return this.$refs.tagSvg.clientHeight / 2;
		},
	},
	methods: {
		createData() {
			let tags = [];
			for (let i = 0; i < this.streetList.length; i++) {
				let tag = {};
				let k = -1 + (2 * (i + 1) - 1) / this.streetList.length;
				let a = Math.acos(k);
				let b = a * Math.sqrt(this.streetList.length * Math.PI); //计算标签相对于球心的角度
				tag.text = this.streetList[i].name;
				tag.x = this.CX + this.RADIUS * Math.sin(a) * Math.cos(b); //根据标签角度求出标签的x,y,z坐标
				tag.y = this.CY + this.RADIUS * Math.sin(a) * Math.sin(b);
				tag.z = this.RADIUS * Math.cos(a);
				tag.href = '#'; //给标签添加链接
				tags.push(tag);
			}
			this.tags = tags; //让vue替我们完成视图更新
		},
		rotateX(angleX) {
			var cos = Math.cos(angleX);
			var sin = Math.sin(angleX);
			for (let tag of this.tags) {
				var y1 = (tag.y - this.CY) * cos - tag.z * sin + this.CY;
				var z1 = tag.z * cos + (tag.y - this.CY) * sin;
				tag.y = y1;
				tag.z = z1;
			}
		},
		rotateY(angleY) {
			var cos = Math.cos(angleY);
			var sin = Math.sin(angleY);
			for (let tag of this.tags) {
				var x1 = (tag.x - this.CX) * cos - tag.z * sin + this.CX;
				var z1 = tag.z * cos + (tag.x - this.CX) * sin;
				tag.x = x1;
				tag.z = z1;
			}
		},
		listener(event) {
			//响应鼠标移动
			var x = event.clientX - this.CX;
			var y = event.clientY - this.CY;
			this.speedX =
				x * 0.0001 > 0
					? Math.min(this.RADIUS * 0.00002, x * 0.0001)
					: Math.max(-this.RADIUS * 0.00002, x * 0.0001);
			this.speedY =
				y * 0.0001 > 0
					? Math.min(this.RADIUS * 0.00002, y * 0.0001)
					: Math.max(-this.RADIUS * 0.00002, y * 0.0001);
		},
	},
};
</script>

<style lang="scss" scope>
.tag-cloud {
	background: url('../../static/cloud_bg.png') center center no-repeat;
	background-size: auto 100%;
	a {
		text-decoration: none;
	}
}
.tag-text {
	color: #fff !important;
}
</style>
