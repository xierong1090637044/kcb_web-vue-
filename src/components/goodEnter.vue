<template>
	<div>
		<div style="margin-bottom: 10px;">
			<Breadcrumb separator="<b style='color: #999;'>/</b>">
				<BreadcrumbItem to="/">首页</BreadcrumbItem>
				<BreadcrumbItem to="/home/goods">采购或入库</BreadcrumbItem>
			</Breadcrumb>
		</div>

		<div class="display_flex" style="margin-bottom: 20px;">
			<Button type="primary" style="margin-right: 20px;" @click="GoodEditShow = true">
				<Icon type="md-checkmark" style="margin-right: 10px;" />确定选择
			</Button>

			<div class="display_flex">
				<div>选择仓库：</div>
				<Select style="width:300px" @on-change='selectStock'>
					<Option v-for="item in stockList" :value="item.objectId" :key="item.objectId">{{ item.stock_name }}</Option>
				</Select>
			</div>

			<Input search enter-button placeholder="请输入产品名字" style="width: 300px;margin-left: 20px;" @on-search="searchGood" />
		</div>

		<div>
			<Table :columns="columns" :data="goods" :loading="loading" ref="table" border :height="screenHeight - 240"
			 @on-select="selectGoods">
			</Table>

			<div style="margin: 10px;overflow: hidden">
				<div style="float: right;">
					<Page :total="100" :current="pege_number" @on-change="changePage"></Page>
				</div>
			</div>
		</div>

		<!--产品图片展示-->
		<Modal title="产品图片" v-model="GoodImg.show" class-name="vertical-center-modal">
			<img :src="GoodImg.attr" style="height: 800px;margin: 0 auto;width: 100%;" />
		</Modal>

		<!--产品信息编辑-->
		<Drawer title="采购或入库" placement="left" :closable="false" v-model="GoodEditShow" width="720">
			<div v-if="select_goods.length == 0">未选择产品</div>
			<div v-else>
				<Scroll :height="screenHeight - 160">
					<Card bordered v-for="(item,index) in select_goods" :key="index" style="margin:0 20px 20px;">
						<div slot="title" class="display_flex_bet">
							<div>{{item.goodsName}}</div>
							<div>库存:{{item.reserve}}</div>
						</div>

						<div v-if="item.packageContent&&item.packingUnit" style="margin-bottom: 10px;">产品规格：{{item.packageContent}}/{{item.packingUnit}}</div>
						<div v-if="user.rights&&user.rights.othercurrent[0] != '0'" style="margin-bottom: 10px;"></div>
						<div v-else style="margin-bottom: 10px;">期初进货价：{{item.costPrice}}(元)</div>

						<div class="display_flex" style="margin-bottom: 10px;">实际价格：<Input placeholder="请输入实际入库价或者采购价" clearable style="width: 250px;"
							 @on-change="modify_price($event,index)" /></div>

						<div v-if="item.selected_model">
							<div class='display_flex' v-for="(model,key) in (item.selected_model)" :key="key" style="margin-bottom: 10px;">
								<div class="display_flex">
									<div style="color: #f30;">{{model.custom1.value + model.custom2.value + model.custom3.value + model.custom4.value}}</div>入库量：
								</div>
								<InputNumber @on-change="handleModelNumChange($event, index,key,model)" :min="0"></InputNumber>
							</div>
						</div>

						<div class="display_flex" style="margin-bottom: 10px;" v-else>数量：<InputNumber @on-change="modify_num($event,index)"
							 :min="0"></InputNumber>
						</div>
					</Card>
				</Scroll>
				<div class="demo-drawer-footer">
					<Button style="margin-right: 8px" @click="GoodEditShow = false">取消</Button>
					<Button type="primary" @click="ConfrimClick = true">确定</Button>
				</div>
			</div>
		</Drawer>

		<!--产品信息明细-->
		<Drawer title="采购或入库明细" placement="left" :closable="false" v-model="ConfrimClick" width="720">
			<Scroll :height="screenHeight - 660">
				<div v-for="(item,index) in select_goods" :key="index" class='pro_listitem'>
					<div class='pro_list' style='color:#3D3D3D'>
						<div style="width: calc(100% - 260px);">产品：{{item.goodsName}}</div>
						<div v-if="user.rights&&othercurrent.indexOf('1') ==-1">期初进货价：￥0</div>
						<div v-else>期初进货价：￥{{item.costPrice}}</div>
					</div>
					<div v-if="item.selected_model">
						<div v-for="(model,index) in item.selected_model" :key="index" class="display_flex_bet" v-if="model.num > 0">
							<div style="font-size: 12px;color: #999;" v-if="model">{{model.custom1.value + model.custom2.value + model.custom3.value + model.custom4.value}}</div>
							<div style="font-size: 12px;color: #f30;" v-if="model">{{model.num}}</div>
						</div>
					</div>
					<div class='pro_list' v-if="user.rights&&user.rights.othercurrent[0] != '0'">
						<div>实际进货价：￥0（X{{item.num}}）</div>
						<div>合计：￥0</div>
					</div>
					<div class='pro_list' v-else>
						<div>实际进货价：￥{{item.modify_retailPrice}}（X{{item.num}}）</div>
						<div>合计：￥{{item.modify_retailPrice*item.num}}</div>
					</div>
					<div v-if="item.stocks && item.stocks.stock_name" style="font-size: 24px;color:#2ca879;">存放仓库:{{item.stocks.stock_name}}</div>

				</div>
			</Scroll>

			<Form :model="formItem" :label-width="100">

				<FormItem label="选择门店">
					<Select style="width:300px">
						<Option v-for="item in customsList" :value="item.custom_name" :key="item.objectId" v-model="formItem.shopId">{{ item.custom_name }}</Option>
					</Select>
				</FormItem>

				<FormItem label="选择供应商">
					<Select style="width:300px">
						<Option v-for="item in customsList" :value="item.custom_name" :key="item.objectId" v-model="formItem.producerId">{{ item.custom_name }}</Option>
					</Select>
				</FormItem>

				<FormItem label="选择发货方式">
					<Select style="width:300px">
						<Option v-for="item in customsList" :value="item.custom_name" :key="item.objectId" v-model="formItem.outType">{{ item.custom_name }}</Option>
					</Select>
				</FormItem>

				<FormItem label="实际付款">
					<Input placeholder="Enter something..." v-model="formItem.real_money"></Input>
				</FormItem>

				<FormItem>
					<Button type="primary" data-type="1">采购</Button>
					<Button type="success" data-type="2" value="2">入库</Button>
				</FormItem>
			</Form>

		</Drawer>
		
		<producerS :modal7="true"></producerS>

	</div>
</template>
<script>
	import common from '@/serve/common.js';
	import producerS from '@/components/component/producerS.vue';
	import customs from '@/serve/customs.js';
	import goods from '@/serve/goods.js';

	let that;
	export default {
		components: {
			producerS,
		},
		data() {
			return {
				formItem: {
					shopId:'',
					producerId:'',
					outType:'',
					real_money:0,
				},
				GoodImg: {
					show: false,
					attr: ''
				},
				modal2: {
					all_money: 0,
					real_money: 0,
				},

				userid: JSON.parse(localStorage.getItem('bmob')).objectId || '',
				user: JSON.parse(localStorage.getItem('bmob')),
				page_size: 50,
				pege_number: 1,
				screenHeight: window.innerHeight,
				loading: true,
				columns: [{
						width: 60,
						type: 'selection',
						align: 'center',
					},
					{
						width: 280,
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
										width: '60px',
										padding: "4px 0",
									},
									attrs: {
										src: params.row.goodsIcon
									},
									on: {
										'click': function() {
											that.GoodImg.show = true
											that.GoodImg.attr = params.row.goodsIcon
										}
									}
								})
							]);
						}
					},
					{

						align: 'center',
						title: '所属仓库',
						key: 'stocks',
					},
					{

						align: 'center',
						title: '所属分类',
						key: 'class',
					},
					{

						align: 'center',
						title: '库存',
						key: 'reserve',
						sortable: true,
					},
					{

						align: 'center',
						sortable: true,
						title: '成本价',
						key: 'costPrice',
					},
					{

						align: 'center',
						title: '零售价',
						key: 'retailPrice',
						sortable: true,
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
						align: 'center',
						title: '创建时间',
						key: 'createdAt',
						sortable: true,
					}
				],

				GoodEditShow: false, //产品信息编辑显示控制
				ConfrimClick: true,
				goods: [],
				select_goods: JSON.parse(localStorage.getItem("selectProducts")), //选择模式下选择的产品数据
				customsList: JSON.parse(localStorage.getItem("customs")), //客户列表
				stockList: JSON.parse(localStorage.getItem("stocks")), //仓库列表
				search: {
					searchGoodText: '',
					stockId: ''
				}, //搜索条件
				
			};
		},

		mounted() {
			that = this;
			window.onresize = () => {
				return (() => {
					that.screenHeight = window.innerHeight;
				})();
			};
			this.get_productList();
		},

		methods: {

			//输入实际的出入库的价格
			modify_price($event, index) {
				//console.log($event, index)

				that.select_goods[index].modify_retailPrice = $event.target.value
				that.select_goods[index].total_money = that.select_goods[index].num * Number($event.target.value)
			},

			//多类型产品数量改变
			handleModelNumChange($event, index, key, item) {
				item.num = Number($event)
				that.select_goods[index].selected_model[key] = item
				let _sumNum = 0;
				for (let model of that.select_goods[index].selected_model) {
					_sumNum += model.num
				}

				that.select_goods[index].num = _sumNum
				that.select_goods[index].total_money = _sumNum * Number(this.select_goods[index].modify_retailPrice)
				that.select_goods[index].really_total_money = _sumNum * Number(this.select_goods[index].costPrice)

				localStorage.setItem("selectProducts", JSON.stringify(that.select_goods))
			},

			//输入数量时触发
			modify_num($event, index) {
				//console.log($event, index)
				that.select_goods[index].num = Number($event)
				that.select_goods[index].total_money = Number($event) * Number(that.select_goods[index].modify_retailPrice)
			},

			//选择产品
			selectGoods(e) {
				that.select_goods = e
				let index = 0;
				for (let item of that.select_goods) {
					that.select_goods[index].num = 1;
					that.select_goods[index].total_money = 1 * that.select_goods[index].retailPrice;
					that.select_goods[index].modify_retailPrice = that.select_goods[index].retailPrice;
					index += 1;
				}
			},

			changeGoodNum(e, row) {
				let value = e.target.value
				console.log(value, row)
			},

			//搜索产品
			searchGood(e) {
				that.search.searchGoodText = e
				that.get_productList()
			},

			//选择仓库
			selectStock(e) {
				//console.log(e)
				that.search.stockId = e
				that.get_productList()
			},

			//改变页数
			changePage(pege_number) {
				that.pege_number = pege_number;

				that.get_productList();
			},

			//查询产品列表
			get_productList(stockId) {
				const query = Bmob.Query('Goods');
				query.equalTo('userId', '==', that.userid);
				query.equalTo('stocks', '==', that.search.stockId);
				query.include('second_class', 'goodsClass', 'stocks')
				query.equalTo("goodsName", "==", {
					"$regex": "" + that.search.searchGoodText + ".*"
				});
				query.limit(that.page_size);
				query.skip(that.page_size * (that.pege_number - 1));
				query.order("-createdAt"); //按照条件降序
				query.find().then(res => {
					console.log(res);
					for (let item of res) {
						if (item.reserve == 0) {
							item._disabled = true
						}
						item.class = (item.goodsClass ? (item.goodsClass.class_text || "") : "") + "    " + (item.second_class ? (item.second_class
							.class_text || "") : "")
						item.stocks = (item.stocks) ? item.stocks.stock_name : ""

						item.qrcodeImg = jrQrcode.getQrBase64((item.productCode) ? item.productCode : item.objectId + '-' + false)
						item.productCode = (item.productCode) ? item.productCode : item.objectId + '-' + false

						if (item.models) {
							let count = 0
							for (let model of item.models) {
								model.num = 0
								count += 1
							}
							item.num = count
							item.selected_model = item.models
						}
					}
					this.goods = res;
					this.loading = false;
				});
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
