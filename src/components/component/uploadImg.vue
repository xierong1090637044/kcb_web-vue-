<template>
	<div class="control-form">
		<ul class="upload-imgs">
			<li v-if="imgLen>=3 ? false : true">
				<input type="file" class="upload" @change="addImg" ref="inputer" multiple accept="image/png,image/jpeg,image/gif,image/jpg"
				 v-show="false" />
				<a class="add" @click="upload"><i class="iconfont icon-plus"></i>
					<p>点击上传</p>
				</a>
			</li>
			<li v-for='(value, key) in imgs' :key="key">
				<p class="img"><img :src="value" style="width: 100%;"><a class="close" @click="delImg(key)">×</a></p>
			</li>
		</ul>
	</div>
</template>

<script>
	let that;

	export default {
		props: [],
		name: 'uploadImg',
		data() {
			return {
				imgs: [],
				imgLen: 0,
			}
		},

		mounted() {
			that = this
		},

		methods: {


			upload() {
				document.querySelector('.upload').click();
			},

			addImg(event) {
				let inputDOM = this.$refs.inputer;
				// 通过DOM取文件数据
				this.fil = inputDOM.files;
				if (this.fil) {
					let file
					for (let item of this.fil) {
						file = Bmob.File(item.name, item);
					}
					file.save().then(res => {
						that.imgs.push(res[0].url)

						this.$emit("selectImg", that.imgs)
					})
				}

				let oldLen = this.imgLen;
				let len = this.fil.length + oldLen;
				if (len > 3) {
					return false;
				}
				for (let i = 0; i < this.fil.length; i++) {
					let size = Math.floor(this.fil[i].size / 1024);
					if (size > 5 * 1024 * 1024) {
						alert('请选择5M以内的图片！');
						return false
					}
					this.imgLen++;
					this.$set(this.imgs, this.fil[i].name + '?' + new Date().getTime() + i, this.fil[i]);
				}
			},

			getObjectURL(file) {
				var url = null;
				if (window.createObjectURL != undefined) { // basic
					url = window.createObjectURL(file);
				} else if (window.URL != undefined) { // mozilla(firefox)
					url = window.URL.createObjectURL(file);
				} else if (window.webkitURL != undefined) { // webkit or chrome
					url = window.webkitURL.createObjectURL(file);
				}


				return url;
			},

			delImg(key) {
				this.$delete(this.imgs, key);
				this.imgLen--;
			},
		}
	}
</script>

<style>
	.upload-imgs {
		margin: 0.625rem 0;
		overflow: hidden;
		font-size: 0;
		width: 22.5rem;
	}

	.upload-imgs li {
		position: relative;
		width: 118px;
		height: 118px;
		font-size: 14px;
		display: inline-block;
		padding: 10px;
		border: 2px dashed #ccc;
		text-align: center;
		vertical-align: middle;
	}

	.upload-imgs li:hover {
		border-color: $them-color;
	}

	.upload-imgs .add {
		display: block;
		background-color: #ccc;
		color: #ffffff;
		height: 94px;
		padding: 8px 0;
	}

	.upload-imgs .add .iconfont {
		padding: 10px 0;
		font-size: 40px;
	}

	.upload-imgs li:hover .add {
		background-color: $them-color;
	}

	.upload-imgs li .upload {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		width: 118px;
		height: 118px;
	}

	.upload-imgs .img {
		position: relative;
		width: 94px;
		height: 94px;
		line-height: 94px;
	}

	.upload-imgs .img img {
		vertical-align: middle;
	}

	.upload-imgs .img .close {
		display: none;
	}

	.upload-imgs li:hover .img .close {
		display: block;
		position: absolute;
		right: -6px;
		top: -10px;
		line-height: 1;
		font-size: 22px;
		color: #aaa;
	}
</style>
