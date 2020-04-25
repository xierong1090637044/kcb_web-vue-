<template>
	<div>
		<div style="margin-bottom: 10px;">
			<Breadcrumb separator="<b style='color: #999;'>/</b>">
				<BreadcrumbItem to="/">首页</BreadcrumbItem>
				<BreadcrumbItem to="/home/goods">销售记录</BreadcrumbItem>
			</Breadcrumb>
		</div>

		<div style="margin-bottom: 20px;" class="display_flex_bet">
			<div class="display_flex">
				<Input search enter-button placeholder="请输入产品名称" @on-search='searchOpreations' />
				<Button type="error" @click="modal1=true" icon="ios-funnel-outline" style="margin-left: 10px;">筛选</Button>
			</div>

			<div>
				<Button type="primary" @click="exportData()" icon="ios-download-outline"> 导出操作数据</Button>
			</div>
		</div>

		<Table :columns="columns" :data="order_opreations" :loading="loading" ref="table" border size="small" :height="screenHeight - 250">
			<template slot-scope="{ row, index }" slot="action">
				<div style="display: flex;justify-content: center;">
					<div style="margin-right: 10px" @click="showReserve(row)"><Button type="primary" size="small">详情</Button></div>
					<!--<div v-if="row.type == 1 && row.status == false" style="margin-right: 10px"><Button type="primary" size="small"
						 v-print="'#printMe'" @click="Print(row)">销售出库</Button></div>
					<div v-if="row.type == -1 && row.status == false" style="margin-right: 10px"><Button type="primary" size="small"
						 v-print="'#printMe'" @click="Print(row)">销售出库</Button></div>-->
					<div @click="deleteHeaderGood(row.objectId)"><Button type="error" size="small">撤销</Button></div>
				</div>

			</template>
		</Table>

		<div style="margin: 10px;overflow: hidden">
			<div style="float: right;">
				<Page :total="1000" :current="params.pageNum" @on-change="changePage"></Page>
			</div>
		</div>

		<!--筛选弹窗-->
		<Modal v-model="modal1" title="筛选" @on-ok="modal_confrim" @on-cancel="cancel" cancel-text="重置">
			<Form :label-width="80">

				<FormItem label="时间">
					<DatePicker type="date" placeholder="起始时间" style="width: 200px" @on-change="change_startdata" v-model="params.start_time"></DatePicker>
					<DatePicker type="date" placeholder="结束时间" style="width: 200px" @on-change="change_enddata" v-model="params.end_time"></DatePicker>
				</FormItem>

				<FormItem label="客户" style="margin-top: 10px;">
					<Input v-model="params.custom.custom_name" placeholder="请选择客户" @on-focus="producerShow = true"></Input>
				</FormItem>

			</Form>
		</Modal>

		<Modal title="产品图片" v-model="GoodImg.show" class-name="vertical-center-modal">
			<img :src="GoodImg.attr" style="height: 800px;margin: 0 auto;width: 100%;" />
		</Modal>

		<div v-if="detailShow">
			<Modal title="详情" width="60%" :value="true" @on-cancel="detailShow = false" footer-hide>
				<div>
					<Button type="primary" v-print="'#printTest'">打印</Button>
				</div>

				<div id="printTest">
					<div style="font-size: 22px;padding-bottom:10px;font-weight:800; text-align:center">销售单</div>
					<div class="display_flex_bet" style="margin-bottom: 10px;">
						<div style="font-size:14px;">客户：{{detail.candpName}}</div>
						<div style="font-size:14px;">销售日期：{{detail.createdTime}}</div>
					</div>
					<div class="display_flex_bet" style="margin-bottom: 10px;">
						<div style="font-size:14px;">出库仓库：{{detail.stock.stock_name}}</div>
						<div style="font-size:14px;">单据编号：{{detail.objectId}}</div>
					</div>

					<table>
						<thead>
							<th>产品名称</th>
							<th>单位</th>
							<th>数量</th>
							<th>单价（元）</th>
							<th>合计（元）</th>
						</thead>
						<tbody>
							<tr v-for="item in detail.detail" :key="item.id">
								<td>{{item.goodsName}}</td>
								<td>{{item.packingUnit?item.packingUnit:''}}</td>
								<td>{{item.num}}</td>
								<td>{{item.modify_retailPrice}}</td>
								<td>{{item.modify_retailPrice * item.num}}</td>
							</tr>
						</tbody>
						<tbody>
							<tr>
								<td style="font-weight: bold;">合计</td>
								<td></td>
								<td>{{detail.real_num}}</td>
								<td></td>
								<td>{{detail.all_money}}</td>
							</tr>
						</tbody>
						<tbody>
							<tr>
								<td colspan="5" style="text-align: left;height: 80px;padding-left: 20px;font-weight: bold;">备注：{{detail.beizhu?detail.beizhu:'未填写'}}</td>
							</tr>
						</tbody>
					</table>

					<div class="display_flex_bet" style="margin-top: 10px;">
						<div style="font-size:14px;font-weight: bold;" class="display_flex">
							<div>制单人：</div>
							<div style="width:100px">{{detail.opreater?detail.opreater.nickName:''}}</div>
						</div>
						<div style="font-size:14px;font-weight: bold;" class="display_flex">
							<div>经办人签字或盖章：</div>
							<div style="width:100px"></div>
						</div>
					</div>
				</div>
			</Modal>
		</div>


	</div>
</template>
<script>
	import common from '@/serve/common.js';
	import customs from '@/serve/customs.js';
	import Print from 'vue-print-nb';

	import expandRow from '@/components/component/expandRow.vue';
	import customS from '@/components/component/customS.vue';
	import producerS from '@/components/component/producerS.vue';
	let that;
	let user;
	export default {
		components: {
			expandRow,
			customS,
			producerS
		},
		data() {
			return {
				customShow: false,
				producerShow: false,
				GoodImg: {
					show: false,
					attr: ''
				},
				detail: {}, //操作详情
				detailShow: false,

				order_opreations: [],
				padding_size: 30,
				modal1: false,
				userid: JSON.parse(localStorage.getItem('user')).objectId || '',
				user: JSON.parse(localStorage.getItem('user')),

				screenHeight: window.innerHeight,
				loading: true,
				columns: [{
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
						title: '销售数量',
						sortable: true,
						key: 'real_num',
					},
					{
						title: '商品总价',
						sortable: true,
						key: 'all_money',
					},
					{
						title: '其他费用',
						sortable: true,
						key: 'otherMoney',
					},
					{
						title: '优惠金额',
						sortable: true,
						key: 'discountMoney',
					},
					{
						title: '现结款',
						sortable: true,
						key: 'haveGetMoney',
					},
					{
						title: '现结后欠款',
						sortable: true,
						key: 'debt',
					},
					{
						title: '结算账户',
						key: 'accountName',
					},
					{
						title: '客户',
						key: 'candpName',
					},
					{
						title: '仓库',
						key: 'stockName',
					},
					{
						title: '备注',
						key: 'beizhu',
						render: (h, params) => {
							return h('div', [
								h('div', params.row.beizhu),
								h('div', {
									style: {
										display: "flex"
									},
								}, [h('img', {
										style: {
											width: '60px',
											margin: '0 10px 0 0',
											padding: "4px 0",
										},
										attrs: {
											src: params.row.Images ? params.row.Images[0] : ''
										},
										on: {
											'click': function() {
												that.GoodImg.show = true
												that.GoodImg.attr = params.row.Images[0]
											}
										}
									}),
									h('img', {
										style: {
											width: '60px',
											margin: '0 10px 0 0',
											padding: "4px 0",
										},
										attrs: {
											src: params.row.Images ? (params.row.Images[1] ? params.row.Images[1] : '') : ''
										},
										on: {
											'click': function() {
												that.GoodImg.show = true
												that.GoodImg.attr = params.row.Images[1]
											}
										}
									}),
									h('img', {
										style: {
											width: '60px',
											margin: '0 10px 0 0',
											padding: "4px 0",
										},
										attrs: {
											src: params.row.Images ? (params.row.Images[2] ? params.row.Images[2] : '') : ""
										},
										on: {
											'click': function() {
												that.GoodImg.show = true
												that.GoodImg.attr = params.row.Images[2]
											}
										}
									})
								]),
							]);
						}
					},
					{
						title: '状态',
						key: 'statusDesc',
						render: (h, params) => {
							return h('div', {
								style: {
									"color": (params.row.status) ? "#2ca879" : "#f30"
								},
							}, [(params.row.status) ? "已出库" : "未出库"])
						}
					},
					{
						title: '操作者',
						key: 'nickName',
					},
					{
						title: '时间',
						key: 'createdTime',
					},
					{
						width: 200,
						title: '操作',
						slot: 'action',
						align: 'center',
						fixed: 'right',
					}
				],

				params: {
					goodsName: '',
					custom: '',
					start_time: '',
					end_time: '',
					pageSize: 50,
					pageNum: 1,
          type:-1,
          extra_type:1
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

			this.get_operations();
		},

		methods: {

			//选择客户
			selectProducter(row) {
				that.producerShow = false
				that.params.custom = row
			},

			//输入产品名字筛选
			searchOpreations(value) {
				that.params.goodsName = value
				that.get_operations()
			},

			showReserve(row) {
				that.detail = row;
				that.detailShow = true
			},

			//选择起始时间
			change_startdata(e) {
				if (e) {
					that.params.start_time = e + " 00:00:00"
				}

			},

			//选择结束时间
			change_enddata(e) {
				if (e) {
					that.params.end_time = e + " 00:00:00"
				}
			},

			//筛选确定
			modal_confrim() {
				that.get_operations();
			},

			//筛选取消
			cancel() {
				that.params = {
					goodsName: '',
					custom: '',
					start_time: '',
					end_time: '',
					pageSize: 50,
					pageNum: 1,
				}
				that.get_operations();
			},

			//导出数据表格点击
			exportData(type) {
				this.$refs.table.exportCsv({
					filename: '销售记录',
				});
			},

			//改变页数
			changePage(pageNum) {
				that.params.pageNum = pageNum;
				that.get_operations();
			},

			//查询操作列表
			get_operations() {
				that.$http.Post("order_opreationList", {
				  startTime: that.params.start_time,
				  endTime: that.params.end_time,
				  type: that.params.type,
				  extra_type: that.params.extra_type,
				  pageSize: that.params.pageSize,
				  pageNum: that.params.pageNum,
				  goodsName: that.params.goodsName,
				}).then(res => {
					for (let item of res.data) {
						item.nickName = item.opreater.nickName
						item.stockName = item.stock ? item.stock.stock_name : '未填写'
						item.candpName = item.custom ? item.custom.custom_name : '未填写'
						item.createdTime = item.createdTime ? item.createdTime.iso.split(" ")[0] : item.createdAt
						item.accountName = item.account ? item.account.name : '未填写'
						item.statusDesc = item.status ? '已出库' : '未出库'
					}
					this.order_opreations = res.data;
					this.loading = false;
				});
			},


		}
	};
</script>
<style>
	#printTest table {
		font-family: "宋体";
		border-collapse: collapse;
		width: 99.5%;
	}

	#printTest table thead th {
		height: 40px;
		font-size: 13px;
		/* width: 10px; */
		text-align: center;
		border: 1px solid black;
	}

	#printTest table tbody tr {
		font-size: 13px;
		border: 1px solid black;
		height: 40px;
		text-align: center;
	}

	#printTest table tbody td {
		font-size: 13px;
		text-align: center;
		border: 1px solid black;
	}
</style>
