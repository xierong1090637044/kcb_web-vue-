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
		},

		methods: {}
	};
</script>
<style scoped>
.display_flex_bet{
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.ivu-input-search {
    background-color: #426ab3 !important;
    border-color: #426ab3 !important;
}
</style>
