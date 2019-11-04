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
		
		let current = Bmob.User.current()
		console.log(current)
		if(localStorage.getItem('bmob')){
			let identity = localStorage.getItem('identity')
			let current = Bmob.User.current()
			current.user = ''
			if(identity == 1){
				localStorage.setItem("bmob",JSON.stringify(current))
			}
		}
	},

	methods: {}
};
</script>
