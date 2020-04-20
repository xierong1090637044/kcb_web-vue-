<template>
	<div>
		<div style="margin-bottom: 10px;">
			<Button type="success" style="margin-right: 10px;" @click="goodsShow = true" icon="md-add">选择添加产品</Button>
		</div>

		<Table :columns="columns" :data="thisSelectGoods" :loading="loading" ref="table" border size="small" :height="screenHeight - 240">
			<template slot-scope="{ row, index }" slot="action">
				<div style="display: flex;justify-content: center;">
					<Button type="primary" size="small" @click="selectedItem = row;content=row.content" style="margin-right: 5px;">商品详情</Button>
					<Button type="primary" size="small" @click="modifyStatus(row,1)" style="margin-right: 5px;">上架</Button>
					<Button type="primary" size="small" @click="modifyStatus(row,2)">下架</Button>
				</div>
			</template>
		</Table>

		<!--选择产品模板-->
		<onlineShopGoodSelect v-if="goodsShow" @cancle="goodsShow = false" @confrimGoods="confrimSelectGoods"
		 :thisSelectGoods="thisSelectGoods"></onlineShopGoodSelect>

		<Modal title="产品图片" :value="GoodImg?true:false" :styles="{top: '4%'}" footer-hide @on-cancel="GoodImg = ''">
			<img :src="GoodImg" style="margin: 0 auto;width: 50%;" />
		</Modal>

		<Modal title="产品图片" :value="selectedItem?true:false" @on-cancel="selectedItem = '';content=''" :mask-closable="false"
		 :closable="false" @on-ok="addDetail()" width="80%">
			<quill-editor class="editor" v-model="content" ref="QuillEditor" :options="editorOption"></quill-editor>
		</Modal>

		<input type="file" class="upload" @change="addImg" ref="inputer" multiple accept="image/png,image/jpeg,image/gif,image/jpg"
		 v-show="false" />
	</div>
</template>

<script>
	import onlineShopGoodSelect from '@/components/component/onlineShopGoodSelect.vue';

	let that;
	const toolbarOptions = [
		['bold', 'italic', 'underline', 'strike'], // toggled buttons
		['blockquote', 'code-block'],
		[{
			'header': 1
		}, {
			'header': 2
		}], // custom button values
		[{
			'list': 'ordered'
		}, {
			'list': 'bullet'
		}],
		[{
			'script': 'sub'
		}, {
			'script': 'super'
		}], // superscript/subscript
		[{
			'indent': '-1'
		}, {
			'indent': '+1'
		}], // outdent/indent
		[{
			'direction': 'rtl'
		}], // text direction

		[{
			'size': ['small', false, 'large', 'huge']
		}], // custom dropdown
		[{
			'header': [1, 2, 3, 4, 5, 6, false]
		}],

		[{
			'color': []
		}, {
			'background': []
		}], // dropdown with defaults from theme
		[{
			'font': []
		}],
		[{
			'align': []
		}],
		['link', 'image', 'video'],
		['clean'] // remove formatting button
	]
	export default {
		components: {
			onlineShopGoodSelect
		},
		data() {
			return {
				formData: new FormData(),
				imgLen: 0,
				selectedItem: '',
				content: '',
				editorOption: {
					modules: {
						toolbar: {
							container: toolbarOptions, // 工具栏
							handlers: {
								'image': function(value) {
									if (value) {
										document.querySelector('.upload').click();
									} else {
										this.quill.format('image', false);
									}
								}
							}
						}
					}
				},
				screenHeight: window.innerHeight,
				loading: true,
				thisSelectGoods: [],
				GoodImg: '',
				goodsShow: false,
				columns: [{
						type: 'index',
						width: 60,
						align: 'center'
					},
					{
						width: 180,
						title: '产品名字',
						key: 'goodsName',
						sortable: true,
						align: 'center',
					},
					{
						title: '产品图片',
						key: 'goodsIcon',
						width: 100,
						render: (h, params) => {
							return h('div', {
								style: {
									"text-align": "center"
								},
							}, [
								h('img', {
									style: {
										width: '20px',
									},
									attrs: {
										src: params.row.goodsIcon
									},
									on: {
										'click': function() {
											that.GoodImg = params.row.goodsIcon
										}
									}
								})
							]);
						}
					},
					{
						width: 100,
						align: 'center',
						sortable: true,
						title: '成本价',
						key: 'costPrice',
					},
					{
						width: 100,
						align: 'center',
						title: '零售价',
						key: 'retailPrice',
						sortable: true,
					},
					{
						width: 120,
						align: 'center',
						title: '库存',
						key: 'reserve',
						sortable: true,
					},
					{
						width: 150,
						align: 'center',
						title: '所属分类',
						key: 'category',
					},
					{
						width: 100,
						align: 'center',
						title: '规格',
						key: 'model',
					},
					{
						width: 160,
						align: 'center',
						title: '创建时间',
						key: 'createdAt',
						sortable: true,
					},
					{
						width: 100,
						align: 'center',
						title: '有无详情',
						key: 'content',
						render: (h, params) => {
							return h('div', {
								style: {
									"color": (params.row.content) ? "#2ca879" : "#f30"
								},
							}, [(params.row.content) ? "已上传" : "未上传"])
						}
					},
					{
						width: 100,
						align: 'center',
						title: '上下架状态',
						key: 'content',
						render: (h, params) => {
							return h('div', {
								style: {
									"color": (params.row.status) ? "#2ca879" : "#f30"
								},
							}, [(params.row.status) ? "已上架" : "已下架"])
						}
					},
					{
						width: 200,
						title: '操作',
						slot: 'action',
						align: 'center',
						fixed: 'right',
					}
				],
				pageNum:1,
			}
		},

		mounted() {
			that = this
			that.getOnlineGoods()
		},

		methods: {

			modifyStatus(item, type) {
				let content = ""
				let status = true;
				if (type == 1) {
					content = "是否确定上架此产品?"
				} else if (type == 2) {
					content = "是否确定下架此产品?"
					status = false
				}
				this.$confirm(content, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then((res) => {
					that.$http.Post("shop_goodManage", {
						"type": "modifyStatus",
						"status": status,
						"objectId": item.objectId
					}).then(res => {
						if (res) {
							that.getOnlineGoods()
						}
					})

				});
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
						let quill = this.$refs.QuillEditor.quill
						let length = quill.getSelection().index;
						quill.insertEmbed(length, 'image', res[0].url)
						quill.setSelection(length + 1)
					})
				}
			},

			addDetail(item) {
				that.$http.Post("shop_goodManage", {
					"type": "editH5Det",
					"content": that.content,
					"objectId": that.selectedItem.objectId
				}).then(res => {
					if (res) {
						that.selectedItem = ''
						that.getOnlineGoods()
					}
				})
			},

			//得到产品列表
			getOnlineGoods() {
				that.$http.Post("shop_goodManage", {
					goodClass:'',
					content: '',
					pageSize: 200,
					pageNum: that.pageNum,
					order: "-createdAt",
					"type": "get"
				}).then(res => {
					that.loading = false
					that.thisSelectGoods = res.data
					console.log(res)
				})
			},

			//确定选择添加的产品
			confrimSelectGoods(value) {
				if (value.selectedGoodsId.length > 0 && value.selectedGoodClass) {
					that.$http.Post("shop_goodManage", {
						"selectedGoodsId": value.selectedGoodsId,
						"selectedGoodClass": value.selectedGoodClass,
						"type": "add"
					}).then(res => {
						that.goodsShow = false
						that.getOnlineGoods()
					})
				} else if (value.selectedGoodsId.length == 0) {
					that.$Message.warning('请选择要添加的产品');
				} else if (value.selectedGoodClass == '') {
					that.$Message.warning('请关联到产品类别');
				}
			}
		},
	}
</script>

<style>
	.ql-container {
		height: 400px;
	}
</style>
