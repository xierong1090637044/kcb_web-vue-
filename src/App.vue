<style scoped></style>
<template>
	<div class="layout" :style="{ height: screenHeight + 'px' }"><router-view></router-view></div>
</template>
<script>
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
	},

	methods: {}
};
</script>
