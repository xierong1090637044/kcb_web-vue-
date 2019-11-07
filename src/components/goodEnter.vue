<template>
	<div>
		<div style="margin-bottom: 10px;">
			<Breadcrumb separator="<b style='color: #999;'>/</b>">
				<BreadcrumbItem to="/">首页</BreadcrumbItem>
				<BreadcrumbItem to="/home/goods">采购或入库</BreadcrumbItem>
			</Breadcrumb>
		</div>

		<div class="display_flex_bet" style="margin-bottom: 20px;">
			<div class="display_flex">
				<div>选择客户：</div>
				<Select prefix="ios-contact" style="width:300px">
					<Option v-for="item in customsList" :value="item.custom_name" :key="item.objectId">{{ item.custom_name }}</Option>
				</Select>
			</div>

			<Input search enter-button placeholder="请输入产品名字" style="width: 300px" @on-search="searchGood" />
		</div>

		<Table :columns="columns" :data="goods" :loading="loading" ref="table" border size="small" :height="screenHeight - 640"
		 @on-select="selectGoods">
		</Table>

		<div style="margin: 10px;overflow: hidden">
			<div style="float: right;">
				<Page :total="100" :current="pege_number" @on-change="changePage"></Page>
			</div>
		</div>

		<Form :model="formItem" :label-width="80">
			<FormItem label="Input">
				<Input v-model="formItem.input" placeholder="Enter something..."></Input>
			</FormItem>
			
			
			<FormItem label="Text">
				<Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
			</FormItem>
			<FormItem>
				<Button type="primary">确定</Button>
			</FormItem>
		</Form>

		<!--产品图片展示-->
		<Modal title="产品图片" v-model="GoodImg.show" class-name="vertical-center-modal">
			<img :src="GoodImg.attr" style="height: 800px;margin: 0 auto;width: 100%;" />
		</Modal>

	</div>
</template>
<script>
	import common from '@/serve/common.js';
	import customs from '@/serve/customs.js';
	import goods from '@/serve/goods.js';

	let that;
	export default {
		components: {},
		data() {
			return {
				GoodImg: {
					show: false,
					attr: ''
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
						width: 120,
						align: 'center',
						title: '库存',
						key: 'reserve',
						sortable: true,
					},
					{
						width: 120,
						align: 'center',
						title: '数量',
						key: 'num',
					},
					{
						width: 120,
						align: 'center',
						title: '实际价格',
						key: 'num',
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
						width: 100,
						align: 'center',
						title: '规格',
						key: 'packageContent',
					},
					{
						width: 100,
						align: 'center',
						title: '单位',
						key: 'packingUnit',
					},
					{
						width: 100,
						align: 'center',
						title: '所属分类',
						key: 'class',
					},
					{
						width: 100,
						align: 'center',
						title: '所属仓库',
						key: 'stocks',
					},
					{
						width: 160,
						align: 'center',
						title: '创建时间',
						key: 'createdAt',
						sortable: true,
					}
				],
				goods: [],
				select_goods: [], //选择模式下选择的产品数据
				customsList: [],
				searchGoodText: '',
				formItem: {
					input: '',
					select: '',
					radio: 'male',
					checkbox: [],
					switch: true,
					date: '',
					time: '',
					slider: [20, 50],
					textarea: ''
				}
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

			customs.get_customList(false, '').then(res => {
				console.log(res)
				that.customsList = res
			})
		},

		methods: {

			//选择产品
			selectGoods(e) {
				console.log(e)
			},

			//搜索产品
			searchGood(e) {
				that.searchGoodText = e
				that.get_productList()
			},

			//改变页数
			changePage(pege_number) {
				that.pege_number = pege_number;

				that.get_productList();
			},

			//查询产品列表
			get_productList() {
				const query = Bmob.Query('Goods');
				query.equalTo('userId', '==', that.userid);
				query.include('second_class', 'goodsClass', 'stocks')

				query.equalTo("goodsName", "==", {
					"$regex": "" + that.searchGoodText + ".*"
				});
				query.limit(that.page_size);
				query.skip(that.page_size * (that.pege_number - 1));
				query.order("-createdAt"); //按照条件降序
				query.find().then(res => {
					console.log(res);
					for (let item of res) {
						item.class = (item.goodsClass ? (item.goodsClass.class_text || "") : "") + "    " + (item.second_class ? (item.second_class
							.class_text || "") : "")
						item.stocks = (item.stocks) ? item.stocks.stock_name : ""

						item.qrcodeImg = jrQrcode.getQrBase64((item.productCode) ? item.productCode : item.objectId + '-' + false)
						item.productCode = (item.productCode) ? item.productCode : item.objectId + '-' + false
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
</style>
