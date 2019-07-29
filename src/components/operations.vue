<template>
	<div>

		<Table :columns="columns" :data="order_opreations" :loading="loading" ref="table" border size="small" :height="screenHeight - 200" ></Table>

		<div style="margin: 10px;overflow: hidden">
			<div style="float: right;">
				<Page :total="100" :current="pege_number" @on-change="changePage"></Page>
			</div>
		</div>

	</div>
</template>
<script>
	import common from '@/serve/common.js';
	import expandRow from '@/components/component/expandRow.vue';
	let that;

	export default {
		components: {
			expandRow
		},
		data() {
			return {
				order_opreations: [],
				padding_size: 30,
				modal1: false,
				userid: JSON.parse(localStorage.getItem('bmob')).objectId || '',
				page_size: 100,
				pege_number: 1,
				screenHeight: window.innerHeight,
				loading: true,
				columns: [{
						type: 'expand',
						width: 50,
						render: (h, params) => {
							return h(expandRow, {
								props: {
									row: params.row
								}
							})
						}
					},
					{
						type: 'index',
						width: 60,
						align: 'center'
					},
					{
						title: '操作产品',
						key: 'goodsName',
						sortable: true,
						render: (h, params) => {
							return h('div', [params.row.goodsName + " 等"]);
						}
					},
					{
						title: '实际应付（实际应收）',
						key: 'all_money',
						sortable: true
					},
					{
						title: '欠款',
						key: 'debt',
						sortable: true
					},
					{
						title: '操作类型',
						key: 'type',
						render: (h, params) => {
							if(params.row.type == 1){
								return h('div', ["入库"]);
							}else if(params.row.type == -1){
								return h('div', ["出库"]);
							}else if(params.row.type == 2){
								return h('div', ["退货"]);
							}else if(params.row.type == 3){
								return h('div', ["盘点"]);
							}
							
						}
					},
					{
						title: '操作者',
						key: 'opreater',
						render: (h, params) => {
							return h('div', [params.row.opreater.nickName]);
						}
					},
					{
						title: '创建时间',
						key: 'createdAt',
						sortable: true
					}
				],
			};
		},

		mounted() {
			that = this;
			window.onresize = () => {
				return (() => {
					that.screenHeight = window.innerHeight;
				})();
			};
			this.get_operations();

		},

		methods: {


			//导出数据表格点击
			exportData(type) {
				this.$refs.table.exportCsv({
					filename: '操作记录',
					original: false
				});
			},

			//改变页数
			changePage(pege_number) {
				that.pege_number = pege_number;

				that.get_operations();
			},


			//查询产品列表
			get_operations() {
				const query = Bmob.Query('order_opreations');
				query.equalTo('master', '==', that.userid);
				query.include("opreater", "custom", "producer");
				query.limit(that.page_size);
				query.skip(that.page_size * (that.pege_number - 1));
				query.order("-createdAt"); //按照条件降序
				query.find().then(res => {
					console.log(res);
					this.order_opreations = res;
					this.loading = false;
				});
			}
		}
	};
</script>
