<template>
	<div>
		<Modal title="选择门店" :closable="false" width="80%" :value="show" @on-cancel="outData">

			<Table :columns="columns" :data="data" stripe border :height="screenHeight - 350" :loading="loading" size="small">
				<template slot-scope="{ row, index }" slot="action">
					<Button type="primary" size="small" style="margin-right: 5px" @click="choose(row)">选择</Button>
				</template>
			</Table>
		</Modal>
	</div>
</template>

<script>
	import shops from '@/serve/shops.js';
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
						title: '门店图片',
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
									}
								})
							]);
						}
					},
					{
						title: '门店名字',
						key: 'name',
					},
					{
						title: '门店地址',
						key: 'address',
					},
					{
						title: '门店电话',
						key: 'phone',
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
			shops.get_shopList().then(res=>{
				console.log(res)
        that.loading = false;
				that.data = res;
			})
		},

    methods:{

      //取消操作
      outData(){
        this.$emit('cancle',false)
      },

      //选择当前操作返回
      choose(row){
        this.$emit('select',row)
      },

    },

	};
</script>

<style>
</style>
