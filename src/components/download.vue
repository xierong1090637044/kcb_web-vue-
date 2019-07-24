<template>
	<div style="position: relative;" >
	  <img src="@/assets/download.png" style="width: 100%;" />
	  <img src="@/assets/qq_qun.jpg" class="qq_qunstyle" />
	  <div class="button_ele">
		  <div><button class="button_class" @click="download('ios')">iphone版下载</button></div>
		  <div><button class="button_class" @click="download('androind')">Android版下载</button></div>
	  </div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		mounted() {
			
		},
		methods: {
			download(type){
				if(type =="androind"){
					window.open("/static/android.apk");
				}
				
				if(type =="ios"){
					window.open("/static/ios.ipa");
				}
				
			}
		}
	}
</script>


<style>
	.button_ele{
		position: absolute;
    bottom: 19%;
    left: 16.5%;
	}
	.button_class{
		width: 160%;
    padding: 10% 10%;
    border-radius: 40px;
		margin-bottom: 30%;
		background: #fff;
		font-weight: bold;
	}
	.qq_qunstyle{
		position: absolute;
		bottom: 30%;
    right: 19%;
    width: 10%;
    height: 23%;
	}
</style>
