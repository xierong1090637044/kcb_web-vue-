<template>
	<div>
		<Modal :title="select_good.goodsName" :styles="{top: '4%'}" width="1000" :value="show" @on-cancel="outData" @on-ok="outData">
			<div style="margin-bottom: 10px;display: flex;align-items: center;justify-content: space-between;">
				<div></div>
				<div>
					<Button type="success" style="margin-right: 10px;" @click="newStock.show = true" icon="md-add">关联新的仓库</Button>
				</div>
			</div>

			<Table :columns="selectcColumns" :data="goods" :loading="loading" ref="table" border size="small" id="print_table"
			 :height="screenHeight">
				<template slot-scope="{ row, index }" slot="action">
					<div style="display: flex;justify-content: center;">
						<div><Button type="primary" size="small" @click="deleteGood(row)">删除</Button></div>
						<!--<div><Button type="primary" size="small" v-print="'#printMe'" @click="Print(row)">打印</Button></div>-->

					</div>

				</template>
			</Table>
		</Modal>

		<!--选择新的仓库-->
		<Modal title="关联新的仓库" v-model="newStock.show" :styles="{top: '4%'}" @on-ok="linkNewStock">
			<div class="display_flex_bet">
				<div style="margin-right: 10px;">选择关联到新的仓库</div>
				<Select v-model="newStock.selectStock" style="width:200px">
					<Option v-for="(item,index)  in newStock.allStocks" :value="item.objectId" :key="index">{{ item.stock_name }}</Option>
				</Select>
			</div>

		</Modal>
	</div>
</template>

<script>
	import goods from '@/serve/goods.js';

	let that;
	let uid;
	export default {
		props: ['show', 'select_good'],
		components: {},
		data() {
			return {
				newStock: {
					show: false,
					allStocks: [],
					selectStock: ''
				},
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
							if (params.row.models) {
								return h('div', arr.map(function(item, index) {
									return h('div', {
										style: {
											marginRight: '5px'
										}
									}, [
										h('span', {}, '规格：' + item.custom1.value + item.custom2.value + item.custom3.value + item.custom4.value),
										h('span', {
											style: {
												marginLeft: '20px'
											}
										}, '库存数：' + item.reserve)
									])
								}))
							}
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
			uid = JSON.parse(localStorage.getItem('bmob')).objectId;
			//得到仓库列表
			goods.getstock_list().then(res => {
				console.log(res)
				that.newStock.allStocks = res
				//that.all_fristclass = res
			});
		},

		watch: {
			'show': function(newVal) {
				console.log(newVal)
				if (newVal) {
					//获得产品的附属产品
					that.getSecondGoods()
				} else {
					that.goods = []
				}
			}
		},

		methods: {
			outData() {
				this.$emit('cancle', false)
			},

			deleteGood(item) {
				console.log(item)
				this.$Modal.confirm({
					title: '是否确认删除',
					content: '<p>删除后数据不可恢复</p>',
					onOk: () => {
						const query = Bmob.Query('Goods');
						query.destroy(item.objectId).then(res => {
							console.log(res)
							const query1 = Bmob.Query("Goods");
							query1.equalTo("header", "==", item.header.objectId);
							query1.equalTo("order", "==", 1);
							query1.statTo("sum", "reserve");
							query1.find().then(res => {
								console.log("dasds", res)
								let now_reserve = res[0]._sumReserve
								const query = Bmob.Query('Goods');
								query.set('reserve', now_reserve)
								query.set('stocktype', (now_reserve > item.header.warning_num) ? 1 : 0)
								query.set('id', item.header.objectId)
								query.save().then(res => {
									this.$emit('cancle', false)
								})
							})
						}).catch(err => {
							console.log(err)
						})
					},
				});
			},

			//关联新的仓库按钮点击
			addNewStockProduct() {
				
			},

			//关联到新的仓库
			linkNewStock() {
				if (that.newStock.selectStock) {
					const query = Bmob.Query("Goods");
					query.equalTo("userId", "==", uid);
					query.equalTo("header", "==", that.select_good.objectId);
					query.equalTo("stocks", "==", that.newStock.selectStock);
					query.find().then(res => {
						console.log(res)
						if (res.length == 0) {
							that.upload_good_withNoCan(that.select_good, that.newStock.selectStock).then(res => {
								if (res[0]) {
									this.$message.success('关联成功');
									that.loading = true
									that.getSecondGoods()
								}
							})
						} else {
							this.$message.error('此仓库已存在此产品');
						}
					});
				}
			},

			getSecondGoods() {
				//获得产品的附属产品
				const query = Bmob.Query('Goods');
				query.equalTo("userId", "==", uid);
				query.equalTo("order", "==", 1);
				query.equalTo("header", "==", that.select_good.objectId);
				query.include("stocks", "header");
				query.find().then(res => {
					console.log(res)
					for (let item of res) {
						item.stocks = item.stocks.stock_name || ""
					}
					that.goods = res;
					that.loading = false;
				});
			},

			upload_good_withNoCan(good, stock) {
				return new Promise((resolve, reject) => {
					const pointer = Bmob.Pointer('_User')
					const userid = pointer.set(uid)
					const pointer1 = Bmob.Pointer('stocks')
					const p_stock_id = pointer1.set(stock) //仓库的id关联

					const pointer2 = Bmob.Pointer('Goods')
					const p_good_id = pointer2.set(good.objectId) //仓库的id关联

					const query = Bmob.Query('Goods');
					query.set("goodsName", good.goodsName)
					query.set("costPrice", good.costPrice)
					query.set("retailPrice", good.retailPrice)
					if (good.models) query.set("models", good.models)
					query.set("reserve", 0)
					query.set("stocks", p_stock_id)
					query.set("header", p_good_id)
					query.set("order", 1)
					query.set("userId", userid)
					query.save().then(res => {
						console.log(res)
						resolve([true, res])
					}).catch(err => {
						console.log(err)
					})

				})
			},
		},

	}
</script>

<style>
</style>
