<template>
	<div class="nav-head">
		<div class="row nav-box">
			<div class="col-3">
				<div class="menu-box text-right">
					<div
						class="menu"
						@click="goUrl(5)"
						:class="num === 5 ? 'active' : ''"
					>
						车辆轨迹
					</div>
					<div
						class="menu"
						@click="goUrl(1)"
						:class="num === 1 ? 'active' : ''"
					>
						智能中心
					</div>
					<div
						class="menu"
						@click="goUrl(2)"
						:class="num === 2 ? 'active' : ''"
					>
						司机大屏
					</div>
				</div>
			</div>
			<div class="col-6 nav-content">
				<div class="nav-title">
					{{ text }}
				</div>
			</div>
			<div class="col-3">
				<div class="menu-box text-left">
					<div
						class="menu"
						@click="goUrl(3)"
						:class="num === 3 ? 'active' : ''"
					>
						清掏大屏
					</div>
					<div
						class="menu"
						@click="goUrl(4)"
						:class="num === 4 ? 'active' : ''"
					>
						城市大屏
					</div>
					<div class="menu city" @click="dialogCity = true">
						选择城市
					</div>
				</div>
			</div>
			<el-tooltip class="item" effect="dark" content="退出登录" placement="top">
				<div class="exit" @click="logout"></div>
			</el-tooltip>
		</div>
		<el-dialog
			width="600px"
			:visible.sync="dialogCity"
			:append-to-body="true"
			title="选择城市"
			custom-class="city-box"
			:modal="false"
		>
			<el-cascader
				class="city-select"
				v-model="city"
				:options="cityList"
				:props="props"
				clearable
				filterable
				:show-all-levels="false"
				placeholder="请选择城市"
			></el-cascader>
			<div class="text-center">
				<el-button type="primary" size="small" @click="selectCity"
					><i class="fa fa-check"></i> 确定</el-button
				>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { resetRouter } from '@/router/router';
export default {
	name: 'navHead',
	data() {
		return {
			num: 0,
			text: '',
			city: [],
			cityList: [], //城市列表
			props: {
				multiple: true,
				value: 'region_id',
				label: 'name',
				children: 'children',
				emitPath: false,
			},
			dialogCity: false, //选择城市弹层
		};
	},
	created() {
		this.getCityList();
	},
	mounted() {
		if (this.$parent.$options.name === 'smart') {
			this.num = 1;
			this.text = '智能控制中心';
		} else if (this.$parent.$options.name === 'car') {
			this.num = 2;
			this.text = '司机端数据大屏';
		} else if (this.$parent.$options.name === 'clean') {
			this.num = 3;
			this.text = '清掏公司端数据大屏';
		} else if (this.$parent.$options.name === 'property') {
			this.num = 4;
			this.text = '城市数据大屏';
		} else if (this.$parent.$options.name === 'warning') {
			this.text = '化粪池预警大屏';
		}
	},
	watch: {},
	computed: {
		...mapGetters(['cityInfo']),
	},
	methods: {
		goUrl(val) {
			if (val === 1) {
				this.$router.push({ path: '/smart' });
			} else if (val === 2) {
				this.$router.push({ path: '/' });
			} else if (val === 3) {
				this.$router.push({ path: '/clean' });
			} else if (val === 4) {
				this.$router.push({ path: '/property' });
			} else if (val === 5) {
				let routeUrl = this.$router.resolve({
					path: '/car-map',
				});
				window.open(routeUrl.href, '_blank');
			}
		},
		//退出登录
		logout() {
			this.$confirm(this.$t('logoutTip'), this.$t('tip'), {
				confirmButtonText: this.$t('submitText'),
				cancelButtonText: this.$t('cancelText'),
				type: 'warning',
			}).then(() => {
				this.$store.dispatch('LogOut').then(() => {
					resetRouter();
					this.$router.push({ path: '/login' });
				});
			});
		},
		//获取城市列表
		getCityList() {
			this.$store
				.dispatch('data/City')
				.then((res) => {
					if (res.code === 1) {
						this.cityList = res.data;
					}
				})
				.then(() => {
					if (this.cityInfo.region_id) {
						this.city = this.cityInfo.region_id.split(',');
					}
				});
		},
		//选择城市
		selectCity() {
			let params = { region_id: this.city.join(',') };
			this.$store.commit('data/SET_CITY', params);
			this.dialogCity = false;
		},
	},
};
</script>

<style lang="scss" scope>
.nav-head {
	padding-top: 1.5vh;
	.nav-box {
		margin: 0px;
		position: relative;
		.exit {
			position: absolute;
			right: 1rem;
			top: 0.5rem;
			width: 20px;
			height: 20px;
			display: inline-block;
			background: url('../../static/exit_icon.png') -1px 0px no-repeat;
			cursor: pointer;
			transition: all 0.3s;
			&:hover {
				background: url('../../static/exit_icon.png') -1px -20px no-repeat;
			}
		}
		.menu-box {
			margin-top: 4.2vh;
			color: #06eff2;
			.menu {
				cursor: pointer;
				display: inline-block;
				border: 1.5px solid #017b90;
				padding: 5px 13px;
				margin: 0px 15px;
				position: relative;
				transition: all 0.3s;
				&:hover {
					border: 1.5px solid #06eff2;
					box-shadow: 0px 0px 10px #06eff2;
				}
				&.active {
					border: 1.5px solid #06eff2;
					box-shadow: 0px 0px 10px #06eff2;
				}
				&.city {
					border: 1.5px solid #409eff;
					box-shadow: 0px 0px 10px #409eff;
					color: #409eff;
				}
			}
		}
		.nav-content {
			background: url('../../static/title_bg.png') center top no-repeat;
			background-size: 100% 100%;
			.nav-title {
				padding: 10px 0 15px 0;
				color: #06eff2;
				font-size: 2.8rem;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
}
.city-box {
	background: rgba(21, 66, 112, 0.9);
	box-shadow: 0px 0px 10px #409eff;
	border-radius: 5px;
	.el-dialog__title {
		color: #409eff;
	}
	.el-dialog__close {
		color: #409eff;
	}
	.city-select {
		width: 100%;
		margin-bottom: 30px;
		.el-input__inner {
			height: 37px;
			background-color: transparent;
			border: 1.5px solid #409eff;
			box-shadow: 0px 0px 10px #409eff;
			border-radius: 0;
			box-sizing: border-box;
			color: #409eff;
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
}
</style>
