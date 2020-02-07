<template>
	<div>
		<Modal title="选择仓库" :closable="false" width="80%" :value="true" @on-cancel="outData">

			<Table :columns="columns" :data="data" stripe border :height="screenHeight - 350" :loading="loading" size="small">
				<template slot-scope="{ row, index }" slot="action">
					<Button type="primary" size="small" style="margin-right: 5px" @click="choose(row)">选择</Button>
				</template>
			</Table>
		</Modal>
	</div>
</template>

<script>
	import manage from '@/serve/manage.js';
	import jrQrcode from "jr-qrcode";

	let that;
	export default {
		props: ['show'],

		data() {
			return {
				screenHeight: window.innerHeight,
				loading: true,
				data: [],
				columns: [{
						type: 'index',
						width: 60,
						align: 'center'
					},
					{
						title: '仓库图片',
						key: 'Image',
						width: 140,
						render: (h, params) => {
							return h('div', {
								style: {
									"text-align": "center"
								},
							}, [
								h('img', {
									style: {
										height: "100px",
										padding: "4px 0",
									},
									attrs: {
										src: params.row.Image ? params.row.Image[0] : ''
									},
									on: {
										'click': function() {
											that.GoodImg.show = true
											that.GoodImg.attr = params.row.Image[0]
										}
									}
								})
							]);
						}
					},
					{
						title: '仓库名字',
						key: 'stock_name',
					},
					{
						title: '仓库负责人',
						key: 'charge',
						render: (h, params) => {
							return h('div', [params.row.charge ? params.row.charge.nickName : ''])
						}
					},
					{
						title: '是否已启用',
						key: 'disabled',
						render: (h, params) => {
							return h('div', [(params.row.disabled) ? "未启用" : "已启用"])
						}
					},
					{
						title: '备注',
						key: 'beizhu',
					},
					{
						title: '仓库二维码',
						width: 120,
						key: 'qrcodeImg',
						render: (h, params) => {
							return h('div', {
								style: {
									"text-align": "center",
									"padding": "10px 0"
								},
							}, [
								h('img', {
									style: {
										width: "65px",
									},
									attrs: {
										src: params.row.qrcodeImg
									}
								})
							]);
						}
					},
					{
						title: '创建时间',
						key: 'createdAt',
						sortable: true
					},
					{
						title: '操作',
						slot: 'action',
						align: 'center'
					}
				]
			}
		},

		mounted() {
			that = this;
			manage.getstock_list().then(res => {
				for (let item of res) {
					item.qrcodeImg = jrQrcode.getQrBase64((item.objectId + '-stock'))
				}
        this.loading =false;
				that.data = res
			})
		},

    methods:{

      //取消操作
      outData(){
        this.$emit('cancle',false)
      },

      //选择当前操作返回
      choose(row){
        this.$emit('confrim',row)
      },

    },

	};
</script>

<style>
</style>
