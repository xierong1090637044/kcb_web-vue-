<template>
	<div>
		<div style="margin-bottom: 10px;">
			<Breadcrumb separator="<b style='color: #999;'>/</b>">
				<BreadcrumbItem to="/">首页</BreadcrumbItem>
				<BreadcrumbItem to="/home/goods">操作记录</BreadcrumbItem>
			</Breadcrumb>
		</div>

		<div style="margin-bottom: 20px;" class="display_flex_bet">
			<div class="display_flex">
				<Input search enter-button placeholder="请输入产品名称" @on-search='searchOpreations' />
				<Button type="error" @click="modal1=true" icon="ios-funnel-outline" style="margin-left: 10px;">筛选</Button>
			</div>

			<div class="display_flex">
				<Button type="primary" @click="exportData()" icon="ios-download-outline" style="margin-right: 10px;"> 导出盘点汇总记录</Button>

        <JsonExcel :fields="json_fields" name="盘点详情记录.xls" :data="json_data">
          <Button type="primary" icon="ios-download-outline"> 导出盘点详细记录</Button>
        </JsonExcel>
			</div>
		</div>

		<Table :columns="columns" :data="order_opreations" :loading="loading" ref="table" border size="small" :height="screenHeight - 250">
			<template slot-scope="{ row, index }" slot="action">
				<div style="display: flex;justify-content: center;">
					<div style="margin-right: 10px" @click="showReserve(row)"><Button type="primary" size="small">详情</Button></div>
					<!--<div v-if="row.type == 1 && row.status == false" style="margin-right: 10px"><Button type="primary" size="small"
						 v-print="'#printMe'" @click="Print(row)">采购入库</Button></div>
					<div v-if="row.type == -1 && row.status == false" style="margin-right: 10px"><Button type="primary" size="small"
						 v-print="'#printMe'" @click="Print(row)">销售出库</Button></div>-->
					<div @click="revokeOrder(row.objectId)"><Button type="error" size="small">撤销</Button></div>
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
			</Form>
		</Modal>

		<Modal title="产品图片" v-model="GoodImg.show" class-name="vertical-center-modal">
			<img :src="GoodImg.attr" style="height: 800px;margin: 0 auto;width: 100%;" />
		</Modal>


		<Modal title="详情" v-model="detailShow" width="60%" foot-hide>
			<div>
				<Button type="primary" v-print="'#printTest'">打印</Button>
			</div>
			<div id="printTest">
				<div>
					<div style="font-size: 22px;padding-bottom:10px;font-weight:800;font-family:宋体; text-align:center">盘点单</div>
				</div>
				<table>
					<thead>
						<th>产品名称</th>
						<th>盘点仓库</th>
						<th>盘点前库存</th>
						<th>盘点后库存</th>
					</thead>
					<tbody>
						<tr v-for="item in detail.detail" :key="item.id">
							<td>{{item.goodsName}}</td>
							<td>{{item.stock}}</td>
							<td>{{item.reserve}}</td>
							<td>{{item.now_reserve}}</td>
						</tr>
					</tbody>
				</table>

				<div>
					<div class="display_flex_bet" style="margin:10px 0;">
						<div style="font-size:14px;">制单日期：{{detail.createdTime}}</div>
						<div style="font-size:14px;" class="display_flex">
							<div>操作者：</div>
							<div style="width:100px">{{detail.opreater?detail.opreater.nickName:''}}</div>
						</div>
					</div>
					<div class="display_flex_bet" style="margin-bottom: 40px;">
						<div style="font-size:14px;">备注：{{detail.beizhu?detail.beizhu:'未填写'}}</div>
						<div style="font-size:14px;" class="display_flex">
							<div>经办人签字或盖章：</div>
							<div style="width:100px"></div>
						</div>
					</div>
				</div>
			</div>
		</Modal>

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
				order_bills: [],
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
							return h('div', [params.row.goodsName]);
						}
					},
					{
						title: '仓库',
						key: 'stock',
						render: (h, params) => {
							if (params.row.stockNames && params.row.stockNames.length > 0) {
								return h('div', [params.row.stockNames.join("，")])
							} else {
								return h('div', [params.row.stock ? params.row.stock.stock_name : ""])
							}

						}
					},
					{
						title: '操作类别',
						key: 'stockClass',
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
						title: '操作者',
						key: 'nickName',
					},
					{
						title: '创建时间',
						key: 'createdAt',
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
					producer: '',
					custom: '',
					type: 3,
					extra_type: '',
					start_time: '',
					end_time: '',
					pageSize: 50,
					pageNum: 1,
				},
        json_fields: {
          "产品名称": "goodsName",
          "数量": "num",
          "包装含量": "goodsId.packageContent",
          "包装单位": "goodsId.packingUnit",
          //"总计": "total_money",
          "盘点前库存": "reserve",
          "盘点后库存": "now_reserve",
          "盘点仓库": "stock.stock_name",
          //"销售客户": "custom.custom_name",
          "盘点日期": "createdAt",
          "操作者": "opreater.nickName"
        },
        json_data: []
			};
		},

		mounted() {
			that = this;
			that.get_operations();
			window.onresize = () => {
				return (() => {
					that.screenHeight = window.innerHeight;

				})();
			};
		},

		methods: {
      
      //撤销单据
      revokeOrder(orderId) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>是否确认撤销此单据</p>',
          onOk: () => {
            that.$http.Post("order_opreationSellPurchaseRevoke", {
              orderId: orderId,
              negativeOut: true,
            }).then(res => {
               if(res.code == 1){
                 that.get_operations()
               }
            })
          }
        });
      },

      fetchBillList() {
        that.$http.Post("orders_detailBills", {
          startTime: that.params.start_time,
          endTime: that.params.end_time,
          type: 3,
          extra_type: '',
          goodsName: that.params.goodsName,
        }).then(res => {
          that.json_data= res.data.flat()
        })
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
					that.params.start_time = e + " 00:00:01"
				}

			},

			//选择结束时间
			change_enddata(e) {
				if (e) {
					that.params.end_time = e + " 23:59:59"
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
						producer: '',
						custom: '',
						type: 3,
						extra_type: '',
						start_time: '',
						end_time: '',
						pageSize: 50,
						pageNum: 1,
					},
					that.select_custom = ''
				that.get_operations();
			},

			//导出数据表格点击
			exportData(type) {
					this.$refs.table.exportCsv({
						filename: '盘点汇总记录',
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
						if (item.type == 3) {
							for (let bill of item.detail) {
								let stockNames = []
								stockNames.push(bill.stock)
								item.stockNames = stockNames
							}

							item.typeDesc = "盘点"
							item.stockClass = "盘点"
						}
						item.createdTime = item.createdTime ? item.createdTime.iso.split(" ")[0] : item.createdAt
					}
					this.order_opreations = res.data;
          that.fetchBillList()
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
