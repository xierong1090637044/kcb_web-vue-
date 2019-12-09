<template>
	<div>
		<Modal :title="select_good.goodsName" :styles="{top: '4%'}" width="1000" :value="show" @on-cancel="outData" @on-ok="outData">
			<Table :columns="selectcColumns" :data="goods" :loading="loading" ref="table" border size="small" id="print_table"
			 :height="screenHeight">
				<template slot-scope="{ row, index }" slot="action">
					<div style="display: flex;justify-content: center;">
						<div><Button type="primary" size="small">删除</Button></div>
						<!--<div><Button type="primary" size="small" v-print="'#printMe'" @click="Print(row)">打印</Button></div>-->

					</div>

				</template>
			</Table>
		</Modal>
	</div>
</template>

<script>
	let that;
	export default {
		props: ['show', 'select_good'],
		components: {},
		data() {
			return {
				screenHeight: window.innerHeight - 400,
				goods: [],
				loading: true,
				selectcColumns: [{
						width: 60,
						type: 'selection',
						align: 'center',
					},
					{
						width: 180,
						title: '产品名字',
						key: 'goodsName',
						sortable: true,
						align: 'center',
					},
					{
						width: 100,
						align: 'center',
						title: '所属仓库',
						key: 'stocks',
					},
					{
						width: 120,
						align: 'center',
						title: '库存',
						key: 'reserve',
						sortable: true,
					},
					{
						width: 160,
						align: 'center',
						title: '创建时间',
						key: 'createdAt',
						sortable: true,
					},
					{
						title: '规格',
						align: 'center',
						key: 'models',
						render: (h, params) => {
							var arr = params.row.models
							return h('div', arr.map(function(item, index) {
								return h('div', {
									style: {
										marginRight: '5px'
									}
								},'规格' item.custom1.value + item.custom2.value+item.custom3.value+item.custom4.value)
							}))
						}
					},
					{
						width: 100,
						title: '操作',
						slot: 'action',
						align: 'center',
						fixed: 'right',
					}
				],
			}
		},

		mounted() {
			that = this;
		},

		watch: {
			'show': function(newVal) {
				console.log(newVal)
				if (newVal) {
					let uid = JSON.parse(localStorage.getItem('bmob')).objectId;
					//获得产品的附属产品
					const query = Bmob.Query('Goods');
					query.equalTo("userId", "==", uid);
					query.equalTo("order", "==", 1);
					query.equalTo("header", "==", that.select_good.objectId);
					query.include("stocks");
					query.find().then(res => {
						console.log(res)
						for (let item of res) {
							item.stocks = item.stocks.stock_name || ""
						}
						that.goods = res;
						that.loading = false;
					});
				} else {
					that.goods = []
				}
			}
		},

		methods: {
			outData() {
				this.$emit('cancle', false)
			}
		},

	}
</script>

<style>
</style>
