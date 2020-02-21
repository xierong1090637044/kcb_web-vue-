<template>
	<div>
		<Modal title="选择供应商" :closable="false" width="80%" :value="true" @on-cancel="outData" footer-hide>

			<Table :columns="columns" :data="data" stripe border :height="screenHeight - 350" :loading="loading" size="small">
				<template slot-scope="{ row, index }" slot="action">
					<Button type="primary" size="small" style="margin-right: 5px" @click="choose(row)">选择</Button>
				</template>
			</Table>
		</Modal>
	</div>
</template>

<script>
	import producers from '@/serve/producers.js';
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
						title: '供货商Id',
						key: 'objectId',
					},
					{
						title: '供货商名字',
						key: 'producer_name',
					},
					{
						title: '供货商地址',
						key: 'producer_address',
					},
					{
						title: '供货商电话',
						key: 'producer_phone',
					},
					{
						title: '是否已启用',
						key: 'disabled',
						render: (h, params) => {
							return h('div', [(params.row.disabled) ? "未启用" : "已启用"])
						}
					},
					{
						title: '欠款金额',
						key: 'debt',
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
			producers.get_producerList().then(res => {
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
