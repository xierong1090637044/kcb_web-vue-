<template>
	<div class="layout" :style="{ height: screenHeight + 'px' }">
		<router-view></router-view>
	</div>
</template>
<script>
	import mine from '@/serve/mine.js';
	import manage from '@/serve/manage.js';
	import customs from '@/serve/customs.js';

	export default {
		data() {
			return {
				screenHeight: window.innerHeight
			};
		},

		mounted() {
			const that = this;
			window.onresize = () => {
				return (() => {
					that.screenHeight = window.innerHeight;
				})();
			};

			if (this.getUserAgent()) {
				let current = Bmob.User.current()
				console.log(current)
				if (localStorage.getItem('user')) {
					let identity = localStorage.getItem('identity')
					let current = Bmob.User.current()
					current.user = ''
					if (identity == 1) {
						localStorage.setItem("user", JSON.stringify(current))
					}

					manage.getstock_list(false, '').then(res => {
						localStorage.setItem("stocks", JSON.stringify(res))
					})
					customs.get_customList(false, '').then(res => {
						localStorage.setItem("customs", JSON.stringify(res))
					})

					mine.query_setting()
				}
			} else {
				this.$router.push({
					path: '/404'
				})
			}
		},

		methods: {

			getUserAgent() {
				var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
				//判断是否chorme浏览器
				if (userAgent.indexOf("Chrome") > -1) {
					return true;
				} else {
					return false;
				}
			}
		}
	};
</script>
<style scoped>
	.icon {
		width: 1em;
		height: 1em;
		vertical-align: -0.15em;
		fill: currentColor;
		overflow: hidden;
	}

	.display_flex_bet {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.ivu-input-search {
		background-color: #426ab3 !important;
		border-color: #426ab3 !important;
	}
</style>
