<template>
	<div>
		<div style="margin-bottom: 10px;">
			<Breadcrumb separator="<b style='color: #999;'>/</b>">
				<BreadcrumbItem to="/">首页</BreadcrumbItem>
				<BreadcrumbItem to="/home/goods">产品入库</BreadcrumbItem>
			</Breadcrumb>
		</div>

		<div style="background: #FFFFFF;padding-bottom: 1.25rem;">
			<div>
				<div style="text-align: right;padding:0 0 0.625rem;">
					<Button type="primary" @click="handleSubmit(2)" :disabled="button_disabled">确定入库</Button>
				</div>
				<Table :columns="columns" :data="selectGoods" ref="table" border :height="screenHeight - 440" size="small">
					<template slot-scope="{ row, index }" slot="goodsName">
						<div v-if="row.goodsName">{{row.goodsName}}</div>
						<Input placeholder="点击选择产品" @on-focus="goodsShow = true;selectIndex = index" v-else>
						<Icon type="ios-arrow-down" slot="suffix" />
						</Input>
					</template>
					<template slot-scope="{ row, index }" slot="reserve">
						<div v-if="row.selected_model">
							<div v-for="(model,key) in row.selected_model" :key="key" class="display_flex" style="margin:0.25rem 0.375rem;">
								<div>{{model.custom1.value + model.custom2.value + model.custom3.value + model.custom4.value}}：</div>
								<InputNumber placeholder="请输入数量" size="small" @on-focus="selectIndex = index" v-if="row.goodsName" :value="key== 0?1:0"
								 :min="1" @on-change="handleModelNumChange($event, index,key,model)"></InputNumber>
							</div>
						</div>
						<div v-else>
							<InputNumber placeholder="请输入数量" size="small" @on-focus="selectIndex = index" v-if="row.goodsName" :min="0"
							 @on-change="modify_num($event, index)"></InputNumber>
						</div>
					</template>
					<!--<template slot-scope="{ row, index }" slot="modify_retailPrice">
            <InputNumber placeholder="请输入实际成本价" size="small" @on-focus="selectIndex = index" v-if="row.goodsName" :min="0"
              :value="Number(row.modify_retailPrice)" @on-change="modify_price($event, index)"></InputNumber>
          </template>-->
					<template slot-scope="{ row, index }" slot="action">
						<ButtonGroup>
							<Button icon="md-add" @click="addSelectGoods"></Button>
							<Button icon="md-close" @click="reduceSelectGoods(index)"></Button>
						</ButtonGroup>
					</template>
				</Table>
			</div>

			<div style="padding: 0 0.625rem;">
				<Form :model="formItem" :label-width="100" style="margin-top: 1.875rem;">

					<div class="display_flex">
						<FormItem label="入库仓库">
							<FormItem prop="producttime">
								<Input v-model="formItem.stock.stock_name" placeholder="请选择入库仓库" @on-focus="stockShow = true"></Input>
								<Icon type="ios-arrow-down" slot="suffix" />
							</FormItem>
						</FormItem>

						<FormItem label="入库日期">
							<FormItem prop="producttime">
								<DatePicker type="datetime" placeholder="请选择入库日期" v-model="formItem.date" format="yyyy-MM-dd HH:mm:ss"></DatePicker>
							</FormItem>
						</FormItem>

						<FormItem label="备注" style="width: 25rem;margin-left: 1.875rem;">
							<Input v-model="formItem.beizhu" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
						</FormItem>
					</div>

				</Form>
			</div>

		</div>

		<!--选择产品模板-->
		<goodsS :show="goodsShow" @cancle="goodsShow = false" @confrimGoods="confrimSelectGoods" type="enter"
		 :thisSelectGoods="selectGoods"></goodsS>
		<stocksS v-if="stockShow" @confrim="chooseStock" @cancle="stockShow = false"></stocksS>

	</div>
</template>
<script>
	import goodsS from '@/components/component/goodsS.vue';
	import stocksS from '@/components/component/stocksS.vue';

	import send_temp from '@/serve/send_temp.js';
	import common from '@/serve/common.js';
	import goods from '@/serve/goods.js';

	let that;
	export default {
		components: {
			goodsS,
			stocksS
		},
		data() {
			return {
				button_disabled: false,
				stockShow: false,
				shopShow: false,
				producerShow: false,
				goodsShow: false,
				formItem: {
					stock: '',
					all_money: 0,
					real_money: 0,
					real_num: 0, //数量
					beizhu: '', //备注
					Images: [],
					stockClass: '',
					date: common.getDay(0,true), //入库日期
				},
				selectIndex: 0,
				selectGoods: [],
				userid: JSON.parse(localStorage.getItem('user')).objectId || '',
				user: JSON.parse(localStorage.getItem('user')),
				screenHeight: window.innerHeight,
				loading: true,
				columns: [{
						type: 'index',
						width: 60,
						align: 'center'
					}, {
						width: 200,
						title: '产品名字',
						key: 'goodsName',
						slot: 'goodsName',
						align: 'center',
					},
					{

						align: 'center',
						title: '所属分类',
						key: 'class',
					},
					{
						width: 200,
						align: 'center',
						title: '数量',
						key: 'reserve',
						slot: 'reserve',
					},
					{
						width: 100,
						align: 'center',
						title: '成本价',
						key: 'costPrice',
					},
					{
						align: 'center',
						title: '规格',
						key: 'packageContent',
					},
					{
						align: 'center',
						title: '单位',
						key: 'packingUnit',
					},
					{
						width: 120,
						title: '操作',
						slot: 'action',
						align: 'center'
					}
				],

			};
		},

		mounted() {
			that = this;
			that.handleData()
		},

		methods: {
			//提交表单
			handleSubmit(type) {

				that.$Loading.start();
				that.button_disabled = true;
				let selectGoods = []
				let uid = localStorage.getItem('uid')
				let thisUser = JSON.parse(localStorage.getItem('user'))
				for (let item of that.selectGoods) {
					if (item.goodsName) {
						selectGoods.push(item)
					}
				}

				if (selectGoods.length == 0) {
					this.$Message.error('"没有选择入库产品');
					that.button_disabled = false;
					return
				}

				if (that.formItem.stock == null || that.formItem.stock == "" || that.formItem.stock == undefined) {
					this.$Message.error('"请选择入库仓库');
					return
				}
				that.$http.Post("stock_goodEnter", {
					"goods": selectGoods,
					"beizhu": that.formItem.beizhu,
					"real_num": that.formItem.real_num,
					"stockClass": that.formItem.stockClass,
					"stockId": that.formItem.stock.objectId,
					"stockName": that.formItem.stock.stock_name,
					"real_money": that.formItem.real_money,
					"debt": 0,
					"all_money": that.formItem.all_money,
					"Images": that.formItem.Images,
					"opreater": JSON.parse(localStorage.getItem("user")).objectId,
					"nowDay": that.formItem.date
				}).then(res => {
					if (res) {
						that.button_disabled = false;
						that.$Loading.finish();
						that.handleData();
						
					}
				})
			},

			//选择仓库
			chooseStock(value) {
				that.formItem.stock = value
				that.stockShow = false
			},

			//输入数量时触发
			modify_num($event, index) {
				console.log($event, index)
				that.selectGoods[index].num = Number($event)
				that.selectGoods[index].total_money = Number($event) * Number(that.selectGoods[index].modify_retailPrice)
				that.selectGoods[index].really_total_money = Number($event) * Number(that.selectGoods[index].costPrice)

				that.formItem.real_money = 0
				that.formItem.all_money = 0
				that.formItem.real_num = 0
				for (let item of that.selectGoods) {
					that.formItem.real_num += Number(item.num ? item.num : 0)
					that.formItem.all_money += Number(item.total_money ? item.total_money : 0)
					that.formItem.real_money += Number(item.really_total_money ? item.really_total_money : 0)
				}
			},

			//多类型产品数量改变
			handleModelNumChange($event, index, key, item) {
				//console.log(that.selectGoods)
				item.num = Number($event)
				that.selectGoods[index].selected_model[key] = item
				let _sumNum = 0;
				for (let model of that.selectGoods[index].selected_model) {
					_sumNum += model.num
				}

				that.selectGoods[index].num = _sumNum
				that.selectGoods[index].total_money = _sumNum * Number(this.selectGoods[index].modify_retailPrice)
				that.selectGoods[index].really_total_money = _sumNum * Number(this.selectGoods[index].costPrice)

				that.formItem.real_money = 0
				that.formItem.all_money = 0
				that.formItem.real_num = 0
				for (let item of that.selectGoods) {
					that.formItem.real_num += Number(item.num ? item.num : 0)
					that.formItem.all_money += Number(item.total_money ? item.total_money : 0)
					that.formItem.real_money += Number(item.total_money ? item.total_money : 0)
				}
			},

			confrimSelectGoods(goods) {
				that.selectGoods = [];
				that.goodsShow = false;
				let count = 0;
				for (let item of goods) {
					that.formItem.real_money += Number(item.retailPrice)
					that.formItem.all_money += Number(item.costPrice)
					that.formItem.real_num += Number(item.num)
					that.selectGoods.push(item)
					count += 1
					if (count == goods.length) {
						for (let i = 0; i <= 4; i++) {
							let good = {}
							good.goodsName = ''
							good.stocks = ''
							good.class = ''
							good.reserve = ''
							good.costPrice = ''
							good.modify_retailPrice = ''
							good.retailPrice = ''
							good.packageContent = ''
							good.packingUnit = ''
							good.createdAt = ''
							that.selectGoods.push(good)
						}
					}
				}
				//console.log(goods, that.selectGoods)
			},

			//增加选择的产品数目
			addSelectGoods() {
				let good = {}
				good.goodsName = ''
				good.stocks = ''
				good.class = ''
				good.reserve = ''
				good.costPrice = ''
				good.modify_retailPrice = ''
				good.retailPrice = ''
				good.packageContent = ''
				good.packingUnit = ''
				good.createdAt = ''
				that.selectGoods.push(good)
			},

			handleData() {
				that.selectGoods = []
				for (let i = 0; i <= 8; i++) {
					let good = {}
					good.goodsName = ''
					good.stocks = ''
					good.class = ''
					good.reserve = ''
					good.costPrice = ''
					good.modify_retailPrice = ''
					good.retailPrice = ''
					good.packageContent = ''
					good.packingUnit = ''
					good.createdAt = ''
					that.selectGoods.push(good)
				}
				that.formItem = {
					stock: '',
					all_money: 0,
					real_money: 0,
					real_num: 0, //数量
					beizhu: '', //备注
					Images: [],
					stockClass: '',
					date: common.getDay(0,true), //入库日期
				}
			},

			reduceSelectGoods(index) {
				console.log(index)
				that.selectGoods.splice(index, 1)
			},
		}
	};
</script>

<style>
	@media only screen {
		.print {
			display: none
		}
	}

	.ivu-scroll-wrapper {
		background: #f7f7f7;
	}

	.demo-drawer-footer {
		padding: 20px 0;
		text-align: right;
	}

	.display_flex {
		display: flex;
		align-items: center;
	}

	.display_flex_bet {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.vertical-center-modal {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;

		.ivu-modal {
			top: 0;
		}
	}

	.pro_list {
		display: flex;
		justify-content: space-between;
	}

	.pro_listitem {
		background-color: #fff;
		padding: 10px 20px;
		border-bottom: 1px solid#ddd;
	}

	.pro_allmoney {
		background-color: #fff;
		padding: 10px 20px;
		text-align: right;
		font-size: 32px;
		color: #f30
	}

	.confrim_button {
		background: #1651aa;
		color: #fff;
		font-weight: bold;
		font-size: 32px;
		border-radius: unset;
		padding: 0 10px;
	}
</style>
