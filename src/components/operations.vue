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
				<Input search enter-button placeholder="请输入产品名称" @on-search='searchOpreations'/>
				<Button type="error" @click="modal1=true" icon="ios-funnel-outline" style="margin-left: 10px;">筛选</Button>
			</div>

			<div>
				<Dropdown style="margin-right: 10px" @on-click="selected_options">
					<Button type="primary">
						操作类型
						<Icon type="ios-arrow-down"></Icon>
					</Button>
					<DropdownMenu slot="list">
						<DropdownItem name="0"><Button type="primary"> 全部</Button></DropdownItem>
						<DropdownItem name="-1"><Button type="primary"> 出库</Button></DropdownItem>
						<DropdownItem name="4"><Button type="primary"> 销售</Button></DropdownItem>
						<DropdownItem name="1"><Button type="primary"> 入库</Button></DropdownItem>
						<DropdownItem name="5"><Button type="primary"> 采购</Button></DropdownItem>
						<DropdownItem name="2"><Button type="primary"> 退货</Button></DropdownItem>
						<DropdownItem name="3"><Button type="primary"> 盘点</Button></DropdownItem>
					</DropdownMenu>
				</Dropdown>
				<Button type="primary" @click="exportData()" icon="ios-download-outline"> 导出操作数据</Button>
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
					<div @click="deleteHeaderGood(row.objectId)"><Button type="error" size="small">撤销</Button></div>
				</div>

			</template>
		</Table>

    <div style="margin: 10px;overflow: hidden">
    	<div style="float: right;">
    		<Page :total="1000" :current="pege_number" @on-change="changePage"></Page>
    	</div>
    </div>

    <!--筛选弹窗-->
		<Modal v-model="modal1" title="筛选" @on-ok="modal_confrim" @on-cancel="cancel" cancel-text="重置">
			<Form :label-width="80">

				<FormItem label="时间">
					<DatePicker type="date" placeholder="起始时间" style="width: 200px" @on-change="change_startdata" v-model="start_time"></DatePicker>
					<DatePicker type="date" placeholder="结束时间" style="width: 200px" @on-change="change_enddata" v-model="end_time"></DatePicker>
				</FormItem>


				<FormItem label="客户" style="margin-top: 10px;">
					<Input v-model="search.custom.custom_name" placeholder="请选择客户" @on-focus="customShow = true"></Input>
				</FormItem>

				<FormItem label="供应商" style="margin-top: 10px;">
					<Input v-model="search.producer.producer_name" placeholder="请选择供应商" @on-focus="producerShow = true"></Input>
				</FormItem>

			</Form>
		</Modal>

		<Modal title="产品图片" v-model="GoodImg.show" class-name="vertical-center-modal">
			<img :src="GoodImg.attr" style="height: 800px;margin: 0 auto;width: 100%;" />
		</Modal>


		<Modal title="详情"  v-model="detailShow" width="60%">
			<div>
				<Button type="primary" v-print="'#printTest'">打印</Button>
			</div>

			<div id="printTest" v-if="detail.type==-1">
				<div v-if="detail.extra_type == 1">
					<div style="font-size: 22px;padding-bottom:10px;font-weight:800;font-family:宋体; text-align:center">销售单</div>
					<div class="display_flex_bet" style="margin-bottom: 10px;">
						<div style="font-size:16px;font-family:宋体;">客户：{{detail.candpName}}</div>
						<div style="font-size:16px;font-family:宋体;">销售日期：{{detail.createdTime}}</div>
					</div>
				</div>

				<div v-if="detail.extra_type == 2">
					<div style="font-size: 22px;padding-bottom:10px;font-weight:800;font-family:宋体; text-align:center">出库单</div>
				</div>


				<table>
					<thead>
						<th>产品名称</th>
						<th>单位</th>
						<th>数量</th>
            <th>出库仓库</th>
						<th>单价</th>
						<th>合计</th>
					</thead>
					<tbody>
						<tr v-for="item in detail.detail" :key="item.id">
							<td>{{item.goodsName}}</td>
							<td>{{item.packingUnit?item.packingUnit:''}}</td>
							<td>{{item.num}}</td>
              <td>{{item.stock}}</td>
							<td>{{item.modify_retailPrice}}</td>
							<td>{{item.modify_retailPrice * item.num}}</td>
						</tr>
					</tbody>
				</table>

				<div v-if="detail.extra_type == 1">
					<div class="display_flex_bet" style="margin-top: 10px;">
						<div style="font-size:16px;font-family:宋体;">实际付款：{{detail.real_money}}</div>
						<div style="font-size:16px;font-family:宋体;" class="display_flex">
							<div>操作者：</div>
							<div style="width:100px">{{detail.opreater?detail.opreater.nickName:''}}</div>
						</div>
					</div>
					<div class="display_flex_bet" style="margin-bottom: 40px;">
						<div style="font-size:16px;font-family:宋体;">备注：{{detail.beizhu?detail.beizhu:'未填写'}}</div>
						<div style="font-size:16px;font-family:宋体;" class="display_flex">
							<div>经办人签字或盖章：</div>
							<div style="width:100px"></div>
						</div>
					</div>
				</div>

				<div v-if="detail.extra_type == 2">
					<div class="display_flex_bet" style="margin-top: 10px;">
						<div style="font-size:16px;font-family:宋体;">出库日期：{{detail.createdTime}}</div>
						<div style="font-size:16px;font-family:宋体;" class="display_flex">
							<div>操作者：</div>
							<div style="width:100px">{{detail.opreater?detail.opreater.nickName:''}}</div>
						</div>
					</div>
					<div class="display_flex_bet" style="margin-bottom: 40px;">
						<div style="font-size:16px;font-family:宋体;">备注：{{detail.beizhu?detail.beizhu:'未填写'}}</div>
						<div style="font-size:16px;font-family:宋体;" class="display_flex">
							<div>经办人签字或盖章：</div>
							<div style="width:100px"></div>
						</div>
					</div>
				</div>

			</div>

			<div id="printTest" v-if="detail.type==1">
				<div v-if="detail.extra_type == 1">
					<div style="font-size: 22px;padding-bottom:10px;font-weight:800;font-family:宋体; text-align:center">采购单</div>
					<div class="display_flex_bet" style="margin-bottom: 10px;">
						<div style="font-size:16px;font-family:宋体;">供应商：{{detail.candpName}}</div>
						<div style="font-size:16px;font-family:宋体;">采购日期：{{detail.createdTime}}</div>
					</div>
				</div>
				<div v-if="detail.extra_type == 2">
					<div style="font-size: 22px;padding-bottom:10px;font-weight:800;font-family:宋体; text-align:center">入库单</div>
				</div>

				<table>
					<thead>
						<th>产品名称</th>
						<th>单位</th>
						<th>数量</th>
            <th>入库仓库</th>
						<th>单价</th>
						<th>合计</th>
					</thead>
					<tbody>
						<tr v-for="item in detail.detail" :key="item.id">
							<td>{{item.goodsName}}</td>
							<td>{{item.packingUnit?item.packingUnit:''}}</td>
							<td>{{item.num}}</td>
              <td>{{item.stock}}</td>
							<td>{{item.modify_retailPrice}}</td>
							<td>{{item.modify_retailPrice * item.num}}</td>
						</tr>
					</tbody>
				</table>

			  <div v-if="detail.extra_type == 1">
					<div class="display_flex_bet" style="margin-top: 10px;">
						<div style="font-size:16px;font-family:宋体;">
							实际付款：{{detail.real_money}}
							<text v-if="detail.debt > 0" style="color: #f30;">（{{detail.debt}}）</text>
						</div>
						<div style="font-size:16px;font-family:宋体;" class="display_flex">
							<div>操作者：</div>
							<div style="width:100px">{{detail.opreater?detail.opreater.nickName:''}}</div>
						</div>
					</div>
					<div class="display_flex_bet" style="margin-bottom: 40px;">
						<div style="font-size:16px;font-family:宋体;">备注：{{detail.beizhu?detail.beizhu:'未填写'}}</div>
						<div style="font-size:16px;font-family:宋体;" class="display_flex">
							<div>经办人签字或盖章：</div>
							<div style="width:100px"></div>
						</div>
					</div>
				</div>
				<div v-if="detail.extra_type == 2">
					<div class="display_flex_bet" style="margin-top: 10px;">
						<div style="font-size:16px;font-family:宋体;">入库日期：{{detail.createdTime}}</div>
						<div style="font-size:16px;font-family:宋体;" class="display_flex">
							<div>操作者：</div>
							<div style="width:100px">{{detail.opreater?detail.opreater.nickName:''}}</div>
						</div>
					</div>
					<div class="display_flex_bet" style="margin-bottom: 40px;">
						<div style="font-size:16px;font-family:宋体;">备注：{{detail.beizhu?detail.beizhu:'未填写'}}</div>
						<div style="font-size:16px;font-family:宋体;" class="display_flex">
							<div>经办人签字或盖章：</div>
							<div style="width:100px"></div>
						</div>
					</div>
				</div>

			</div>
		</Modal>

		<!--生产商列表-->
		<producerS @cancle="producerShow = false" v-if="producerShow" @select="selectProducter"></producerS>
		<customS @cancle="customShow = false" :show="customShow" @select="selectCustom"></customS>

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
				producerShow:false,
				GoodImg: {
					show: false,
					attr: ''
				},
				detail: {}, //操作详情
				detailShow: false,
				select_custom: '',
				start_time: '',
				end_time: '',
				type: '', //操作类型
				order_opreations: [],
				order_bills: [],
				padding_size: 30,
				modal1: false,
				userid: JSON.parse(localStorage.getItem('user')).objectId || '',
				user: JSON.parse(localStorage.getItem('user')),
				page_size: 100,
				pege_number: 1,
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
						title: '数量',
            sortable: true,
						key: 'real_num',
					},
					{
						title: '客户或供应商',
            key:'candpName',
					},
					{
						title: '操作类型',
            key:'typeDesc',
					},
          {
          	title: '仓库',
            key:'stock',
            render: (h, params) => {
              if(params.row.stockNames && params.row.stockNames.length >0){
                return h('div', [params.row.stockNames.join("，")])
              }else{
                return h('div', [params.row.stock?params.row.stock.stock_name:""])
              }

            }
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

				search:{
					goodName:'',
					producer:'',
					custom:''
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

		destroyed() {
			localStorage.removeItem("select_custom")
		},

		methods: {

			//选择客户
			selectCustom(row){
				that.customShow = false
				that.search.custom = row
			},

			//选择供应商
			selectProducter(row) {
			  that.producerShow = false
			  that.search.producer = row
			},

			//输入产品名字筛选
			searchOpreations(value){
				that.search.goodName = value
				that.get_operations()
			},

			showReserve(row) {
				console.log(row)
        if(row.type == 1 || row.type == -1){
          that.detail = row;
          that.detailShow = true
        }else{
         this.$Message['error']({
           background: true,
           content: '暂无打印模板，敬请期待'
         });
        }
			},

			//选择起始时间
			change_startdata(e) {
				if (e) {
					that.start_time = e + " 00:00:00"
				}

			},

			//选择结束时间
			change_enddata(e) {
				if (e) {
					that.end_time = e + " 00:00:00"
				}
			},

			//筛选确定
			modal_confrim() {
				that.get_operations();
			},

			//筛选取消
			cancel() {
				that.search = {
					goodName:'',
					producer:'',
					custom:''
				},
				that.select_custom = ''
				that.start_time = ''
				that.end_time = ''
				that.get_operations();
			},

			//导出数据表格点击
			exportData(type) {
				if (that.type == 0) {
					this.$Message.warning('请选择操作类型');
				} else if (that.type == -1) {
					this.$refs.table.exportCsv({
						filename: '出库记录',
					});
				} else if (that.type == 1) {
					this.$refs.table.exportCsv({
						filename: '入库记录',
					});
				} else if (that.type == 2) {
					this.$refs.table.exportCsv({
						filename: '退货记录',
					});
				} else if (that.type == 3) {
					this.$refs.table.exportCsv({
						filename: '盘点记录',
					});
				}else if (that.type == 4) {
					this.$refs.table.exportCsv({
						filename: '销售记录',
					});
				}else if (that.type == 3) {
					this.$refs.table.exportCsv({
						filename: '采购记录',
					});
				}

			},

			//选择操作是触发
			selected_options(name) {
				console.log(name)
				that.type = Number(name)
				that.get_operations();
			},

			//改变页数
			changePage(pege_number) {
				that.pege_number = pege_number;
				that.get_operations();
			},

			//查询操作列表
			get_operations() {
				const query = Bmob.Query('order_opreations');
				query.equalTo('master', '==', that.userid);
				if (that.start_time) {
					query.equalTo("createdAt", ">", that.start_time);
				}
				if (that.end_time) {
					query.equalTo("createdAt", "<", that.end_time);
				}
				if(that.type){
					if(that.type == 4){
						query.equalTo('type', '==', -1);
						query.equalTo('extra_type', '==', 1);
					}else if(that.type == 5){
						query.equalTo('type', '==', 1);
						query.equalTo('extra_type', '==', 1);
					}else if(that.type == 1){
						query.equalTo('type', '==', 1);
						query.equalTo('extra_type', '==', 2);
					}else if(that.type == -1){
						query.equalTo('type', '==', -1);
						query.equalTo('extra_type', '==', 2);
					}else{
						query.equalTo('type', '==', that.type);
					}
				}

				if(that.search.goodName){
					query.equalTo("goodsName","==", { "$regex": "" + that.search.goodName + ".*" });
				}

				if(that.search.producer){
					query.equalTo("producer","==", that.search.producer.objectId);
				}

				if(that.search.custom){
					query.equalTo("custom","==", that.search.custom.objectId);
				}
				query.include("opreater", "custom", "producer","stock");
				query.limit(that.page_size);
				query.skip(that.page_size * (that.pege_number - 1));
				query.order("-createdAt"); //按照条件降序
				query.find().then(res => {
					for(let item of res){
						item.nickName = item.opreater.nickName
            if (item.type == 1) {
            	if (item.extra_type == 2) {
                item.typeDesc = "入库"
            	} else if (item.extra_type == 1) {
                item.typeDesc = "采购"
            	} else if (item.extra_type == 4) {
                item.typeDesc = "销售退货"
            	}
              item.candpName = item.producer?item.producer.producer_name:'未填写'
            } else if (item.type == -1) {
            	if (item.extra_type == 2) {
                item.typeDesc = "出库"
            	} else if (item.extra_type == 1) {
                item.typeDesc = "销售"
            	} else if (item.extra_type == 4) {
                item.typeDesc = "采购退货"
            	}
              item.candpName = item.custom?item.custom.custom_name:'未填写'
            } else if (item.type == 2) {
              item.typeDesc = "退货"
              item.candpName = item.custom?item.custom.custom_name:'未填写'
            } else if (item.type == 3) {
              item.typeDesc = "盘点"
            } else if (item.type == -2) {
              item.typeDesc = "调拨"
            }

            item.createdTime =  item.createdTime ? item.createdTime.iso.split(" ")[0] : item.createdAt
					}
					this.order_opreations = res;
					this.loading = false;
				});
			},

			//查询所有的单个操作列表
			get_bills() {
				const query = Bmob.Query('Bills');
				query.equalTo('userId', '==', that.userid);
				query.equalTo('type', '==', that.type);
				if (that.start_time) {
					query.equalTo("createdAt", ">", that.start_time);
				}
				if (that.end_time) {
					query.equalTo("createdAt", "<", that.end_time);
				}
				if (that.type == -1 && that.select_custom && that.modal1 == false) {
					query.equalTo('custom', '==', that.select_custom.objectId);
				}
				query.limit(that.page_size);
				query.skip(that.page_size * (that.pege_number - 1));
				query.order("-createdAt"); //按照条件降序
				query.include("operater", "custom", "producer");
				query.find().then(res => {
					console.log(res);

					that.products = res.detail;
					that.order_bills = res
				});
			}
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
