<template>
	<div>
		<div style="margin-bottom: 10px;">
			<Breadcrumb separator="<b style='color: #999;'>/</b>">
				<BreadcrumbItem to="/">首页</BreadcrumbItem>
				<BreadcrumbItem to="/home/goods">操作记录</BreadcrumbItem>
			</Breadcrumb>
		</div>

		<div style="display: flex;align-items: center;margin-bottom: 20px;">
			<Dropdown style="margin-right: 10px" @on-click="selected_options">
				<Button type="primary">
					选择操作类型
					<Icon type="ios-arrow-down"></Icon>
				</Button>
				<DropdownMenu slot="list">
					<DropdownItem name="0"><Button type="primary" > 全部</Button></DropdownItem>
					<DropdownItem name="-1"><Button type="primary" > 出库</Button></DropdownItem>
					<DropdownItem name="1"><Button type="primary" > 入库</Button></DropdownItem>
					<DropdownItem name="2"><Button type="primary" > 退货</Button></DropdownItem>
					<DropdownItem name="3"><Button type="primary" > 盘点</Button></DropdownItem>
				</DropdownMenu>
			</Dropdown>

			<Button type="error" @click="modal1=true" icon="ios-funnel-outline" style="margin-right: 10px;">筛选</Button>

			<Button type="primary" @click="exportData()" icon="ios-download-outline"> 导出操作数据</Button>

		</div>

		<Table :columns="columns" :data="order_opreations" :loading="loading" ref="table" border size="small" :height="screenHeight - 250">
			<template slot-scope="{ row, index }" slot="action">
			  <div style="display: flex;justify-content: center;">
			    <div style="margin-right: 10px" @click="showReserve(row)"><Button type="primary" size="small">详情</Button></div>
					<div v-if="row.type == 1 && row.status == false" style="margin-right: 10px"><Button type="primary" size="small" v-print="'#printMe'" @click="Print(row)">采购入库</Button></div>
					<div v-if="row.type == -1 && row.status == false" style="margin-right: 10px"><Button type="primary" size="small" v-print="'#printMe'" @click="Print(row)">销售出库</Button></div>
			    <div @click="deleteHeaderGood(row.objectId)"><Button type="error" size="small">撤销</Button></div>
			  </div>
			
			</template>
		</Table>


		<Modal v-model="modal1" title="筛选" @on-ok="modal_confrim" @on-cancel="cancel" cancel-text="重置">
			<Form :label-width="80">

				<FormItem label="请选择时间">
					<DatePicker type="date" placeholder="选择起始时间" style="width: 200px" @on-change="change_startdata" v-model="start_time"></DatePicker>
					<DatePicker type="date" placeholder=" 选择结束时间" style="width: 200px" @on-change="change_enddata" v-model="end_time"></DatePicker>
				</FormItem>


				<FormItem label="请选择客户" v-if="type == -1" style="margin-top: 10px;">
					<router-link to="/home/manage/customs?type=choose">
						<Input v-model="select_custom.custom_name" placeholder="请选择客户"></Input>
					</router-link>
				</FormItem>

			</Form>
		</Modal>

		<div style="margin: 10px;overflow: hidden">
			<div style="float: right;">
				<Page :total="100" :current="pege_number" @on-change="changePage"></Page>
			</div>
		</div>

		<Modal title="产品图片" v-model="GoodImg.show" class-name="vertical-center-modal">
			<img :src="GoodImg.attr" style="height: 800px;margin: 0 auto;width: 100%;" />
		</Modal>
		
		<Modal title="操作详情" v-model="detailShow" class-name="vertical-center-modal">
			<div >
				<div style='line-height:70rpx;padding: 0 20rpx;'>操作产品</div>
				<div v-if="detail.type == 3">
					<div>
						<div v-for="(item,index) in products" :key="index" class='pro_listitem'>
							<div class='pro_list' style='color:#000'>
								<div>产品：{{item.goodsName}}</div>
								<div v-if="item.stock">盘点仓库：{{item.stock}}</div>
							</div>
							<div class='pro_list'>
								<div>盘点前库存：{{item.reserve}}</div>
								<div>盘点后库存：{{item.now_reserve}}</div>
							</div>
						</div>
					</div>
				</div>
			
				<div v-else-if="detail.type == 2">
					<div>
						<div v-for="(item,index) in products" :key="index" class='pro_listitem'>
							<div class='pro_list_item' style='color:#000'>
								<div>产品：{{item.goodsName}}（成本价：￥{{item.goodsId.costPrice}}）</div>
							</div>
							<div class='pro_list'>
								<div>退货数量：X{{item.num}}</div>
								<div style="text-align: right;">建议零售价：￥{{item.goodsId.retailPrice}}</div>
							</div>
							<!--<div style="text-align: right;">总价：￥{{item.total_money}}</div>-->
						</div>
					</div>
					<div class='pro_allmoney'>总计：￥{{detail.all_money}}</div>
				</div>
			
				<div v-else-if="detail.type == -2">
					<div>
						<div v-for="(item,index) in products" :key="index" class='pro_listitem'>
							<div class='pro_list' style='color:#000;border-bottom: 1rpx solid#EEEEEE;padding:0 0 10rpx;'>
								<div>产品：{{item.goodsName}}</div>
								<div>调拨数量：{{item.num}}</div>
							</div>
							<div class='pro_list' style="padding: 10rpx 0;">
								<div>调出仓库：{{item.stock}}</div>
								<div>调拨后库存：{{item.reserve - item.num}}</div>
							</div>
							<div class='pro_list'>
								<div>调入仓库：{{item.out_stock}}</div>
								<!--<div>调拨后库存：{{item.out_reserve + item.num}}</div>-->
							</div>
						</div>
					</div>
					<div class='pro_allmoney' v-if="detail.type != -2">总计：￥{{detail.all_money}}</div>
				</div>
			
				<div v-else>
					<div>
						<div v-for="(item,index) in products" :key="index" class='pro_listitem'>
							<div class='pro_list_item' style='color:#000'>
								<div>产品：{{item.goodsName}}
									<text v-if="(user.rights&&user.rights.othercurrent[0] != '0') || detail.type == -1"></text>
									<text v-else>（成本价：￥{{item.goodsId.costPrice}}）</text>
								</div>
							</div>
							<div v-if="item.goodsId.selected_model">
								<div v-for="(model,index) in item.goodsId.selected_model" :key="index" class="display_flex_bet" v-if="model.num > 0">
									<div style="font-size: 24rpx;color: #999;">{{model.custom1.value + model.custom2.value + model.custom3.value + model.custom4.value}}</div>
									<div style="font-size: 24rpx;color: #f30;">{{model.num}}</div>
								</div>
							</div>
							<div class='pro_list'>
								<div v-if="item.type == -1">
									<div v-if="item.stock">出库仓库:{{item.stock}}</div>
									<div v-else>出库仓库:未填写</div>
								</div>
								<div v-else-if="item.type == 1">
									<div v-if="item.stock">存放仓库:{{item.stock}}</div>
									<div v-else>存放仓库:未填写</div>
								</div>
			
								<div>数量：X{{item.num}}</div>
							</div>
							<div class='pro_list'>
								<div>建议零售价：￥{{item.goodsId.retailPrice}}</div>
								<div v-if="item.type == -1">实际卖出价：￥{{item.modify_retailPrice}}</div>
								<div v-else>
									<text v-if="user.rights&&user.rights.othercurrent[0] != '0'">实际进货价：￥0</text>
									<text v-else>实际进货价：￥{{item.modify_retailPrice}}</text>
								</div>
							</div>
			
							<!--<div style="text-align: right;" v-if="user.rights&&user.rights.othercurrent[0] != '0'">总价：￥0</div>
							<div style="text-align: right;" v-else>总价：￥{{item.total_money }}</div>-->
						</div>
					</div>
					<div class='pro_allmoney' v-if="user.rights&&user.rights.othercurrent[0] != '0'">总计：￥0</div>
					<div class='pro_allmoney' v-else>总计：￥{{detail.all_money }}</div>
				</div>
			
				<div v-if="detail.type == -1">
					<div class="kaidanmx" v-if="detail.extra_type == 1">
						<div style="padding: 10rpx 30rpx;">销售明细</div>
						<div v-if="detail.custom" class="display_flex" style="border-bottom: 1rpx solid#F7F7F7;">
							<div class="left_content">客户姓名</div>
							<div>{{detail.custom.custom_name}}</div>
						</div>
						<div v-if="detail.discount" class="display_flex" style="border-bottom: 1rpx solid#F7F7F7;">
							<div class="left_content">折扣率</div>
							<div>{{detail.discount}}%</div>
						</div>
						<div class="display_flex" style="border-bottom: 1rpx solid#F7F7F7;">
							<div class="left_content">实际付款</div>
							<div class="real_color">{{detail.real_money == null ?'未填写':detail.real_money }}</div>
						</div>
						<div class="display_flex" v-if="detail.debt > 0" style="border-bottom: 1rpx solid#F7F7F7;">
							<div class="left_content">欠款</div>
							<div class="real_color">{{detail.debt}}</div>
						</div>
						<div class="display_flex_bet" v-if="detail.typeDesc" style="background: #fff;border-bottom: 1rpx solid#F7F7F7;">
							<div class="display_flex">
								<div class="left_content">发送方式</div>
								<div class="real_color">{{detail.typeDesc}}</div>
							</div>
							<div class="display_flex" v-if="detail.typeDesc =='物流' || detail.typeDesc =='快递'">
								<div class="real_color">{{detail.expressNum}}</div>
							</div>
						</div>
						<div class="display_flex_bet" v-if="detail.typeDesc" style="background: #fff;justify-content: flex-end;padding: 0rpx 30rpx;border-bottom: 1rpx solid#F7F7F7;"
						 @click="gotoexpressDet">
							<div style="margin-right: 10rpx;color: #0a53c3;">查快递 </div>
							<fa-icon type="angle-right" size="20" color="#0a53c3" />
						</div>
						<div class="display_flex">
							<div class="left_content" v-if="detail.createdTime">销售时间</div>
							<div>{{detail.createdTime.iso.split(" ")[0]}}</div>
						</div>
						
					</div>
					<div class="kaidanmx" v-else-if="detail.extra_type == 2">
						<div style="padding: 10rpx 30rpx;">出库明细</div>
						<div v-if="detail.custom" class="display_flex" style="border-bottom: 1rpx solid#F7F7F7;">
							<div class="left_content">客户姓名</div>
							<div>{{detail.custom.custom_name}}</div>
						</div>
						<div v-if="detail.discount" class="display_flex" style="border-bottom: 1rpx solid#F7F7F7;">
							<div class="left_content">折扣率</div>
							<div>{{detail.discount}}%</div>
						</div>
						<div class="display_flex" style="border-bottom: 1rpx solid#F7F7F7;">
							<div class="left_content">实际付款</div>
							<div class="real_color">{{detail.real_money == null ?'未填写':detail.real_money }}</div>
						</div>
						<div class="display_flex" v-if="detail.debt > 0" style="border-bottom: 1rpx solid#F7F7F7;">
							<div class="left_content">欠款</div>
							<div class="real_color">{{detail.debt}}</div>
						</div>
						<div class="display_flex_bet" v-if="detail.typeDesc" style="background: #fff;border-bottom: 1rpx solid#F7F7F7;">
							<div class="display_flex">
								<div class="left_content">发送方式</div>
								<div class="real_color">{{detail.typeDesc}}</div>
							</div>
							<div class="display_flex" v-if="detail.typeDesc =='物流' || detail.typeDesc =='快递'">
								<div class="real_color">{{detail.expressNum}}</div>
							</div>
						</div>
						<div class="display_flex_bet" v-if="detail.typeDesc" style="background: #fff;justify-content: flex-end;padding: 0rpx 30rpx;border-bottom: 1rpx solid#F7F7F7;"
						 @click="gotoexpressDet">
							<div style="margin-right: 10rpx;color: #0a53c3;">查快递 </div>
							<fa-icon type="angle-right" size="20" color="#0a53c3" />
						</div>
						<div class="display_flex" v-if="detail.createdTime">
							<div class="left_content">出库时间</div>
							<div>{{detail.createdTime.iso.split(" ")[0]}}</div>
						</div>
					</div>
				</div>
			
				<!--入库以及采购明细-->
				<div v-else-if="detail.type == 1">
					<div class="kaidanmx" v-if="detail.extra_type == 1">
						<div style="padding: 10rpx 30rpx;">采购明细</div>
						<div v-if="detail.producer" class="display_flex" style="border-bottom: 1rpx solid#F7F7F7;">
							<div class="left_content">供货商姓名</div>
							<div>{{detail.producer.producer_name}}</div>
						</div>
						<div class="display_flex" style="border-bottom: 1rpx solid#F7F7F7;">
							<div class="left_content">实际付款</div>
							<div class="real_color">{{detail.real_money == null ?'未填写':detail.real_money }}</div>
						</div>
						<div class="display_flex" v-if="detail.debt > 0">
							<div class="left_content">欠款</div>
							<div class="real_color">{{detail.debt}}</div>
						</div>
						<div class="display_flex">
							<div class="left_content" v-if="detail.createdTime">采购时间</div>
							<div>{{detail.createdTime.iso.split(" ")[0]}}</div>
						</div>
					</div>
					<div class="kaidanmx" v-else-if="detail.extra_type == 2">
						<div style="padding: 10rpx 30rpx;">入库明细</div>
						<div class="display_flex" v-if="detail.createdTime">
							<div class="left_content">入库时间</div>
							<div>{{detail.createdTime.iso.split(" ")[0]}}</div>
						</div>
					</div>
				</div>
			
				<div v-else-if="detail.type == 2">
					<div class="kaidanmx">
						<div style="padding: 10rpx 30rpx;">退货明细</div>
						<div v-if="detail.custom" class="display_flex">
							<div class="left_content">客户姓名</div>
							<div>{{detail.custom.custom_name}}</div>
						</div>
						<div v-else class="display_flex">
							<div class="left_content">未记录客户</div>
						</div>
					</div>
				</div>
			
				<div style='margin-top:20px' class='detail_bottom'>
					<div style='display:flex;border-bottom:1px solid#ddd;padding-bottom: 20upx;'>
						<div v-if="detail.opreater">
							<img :src='detail.opreater.avatarUrl' class='avatar'></img>
						</div>
						<div class='common_style' v-if="detail.opreater">{{detail.opreater.nickName}}</div>
						<div class='common_style'>（操作者）</div>
					</div>
					<div style='padding:20rpx 0 0'>
						<div v-if="detail.beizhu">备注：{{detail.beizhu}}</div>
						<div v-else>备注：暂无</div>
						<div>操作时间：{{detail.createdAt}}</div>
			
						<div v-if="detail.Images && detail.Images.length > 0">
							<div class="notice_text">凭证图</div>
			
							<div style="width: 100%;padding: 20rpx 0;">
								<div class="upload_image display_flex">
									<div style="position: relative;" v-for="(url,index) in detail.Images" :key="index" @click="pridiv(url)">
										<img :src="url" style="width: 180rpx;height: 180rpx;margin-right: 10rpx;"></img>
									</div>
								</div>
							</div>
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

	import expandRow from '@/components/component/expandRow.vue';
	let that;
	let user;
	export default {
		components: {
			expandRow
		},
		data() {
			return {
				GoodImg: {
					show: false,
					attr: ''
				},
				detail:{},
				detailShow:true,
				products:'',
				
				select_custom: '',
				start_time: '',
				end_time: '',
				type: 0, //操作类型
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
						key: 'real_num',
					}, 
					{
						title: '操作类型',
						key: 'type',
						render: (h, params) => {
							if (params.row.type == 1) {
								if(params.row.extra_type == 2){
									return h('div', ["入库"]);
								}else if(params.row.extra_type == 1){
									return h('div', ["采购"]);
								}
							} else if (params.row.type == -1) {
								if(params.row.extra_type == 2){
									return h('div', ["出库"]);
								}else if(params.row.extra_type == 1){
									return h('div', ["销售"]);
								}
							} else if (params.row.type == 2) {
								return h('div', ["退货"]);
							} else if (params.row.type == 3) {
								return h('div', ["盘点"]);
							} else if (params.row.type == -2) {
								return h('div', ["调拨"]);
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
						key: 'opreater',
						render: (h, params) => {
							return h('div', [params.row.opreater.nickName]);
						}
					},
					{
						title: '时间',
						key: 'type',
						render: (h, params) => {
							return h('div', params.row.createdTime?params.row.createdTime.iso.split(" ")[0]:params.row.createdAt);
						}
					},
					{
					  width: 200,
					  title: '操作',
					  slot: 'action',
					  align: 'center',
					  fixed: 'right',
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

		destroyed() {
			localStorage.removeItem("select_custom")
		},

		methods: {

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
				that.select_custom = ''
				localStorage.removeItem("select_custom")
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
				query.include("opreater", "custom", "producer");
				query.limit(that.page_size);
				query.skip(that.page_size * (that.pege_number - 1));
				query.order("-createdAt"); //按照条件降序
				query.find().then(res => {
					
					this.order_opreations = res;
					that.detail = this.order_opreations[7];
					that.products = res[7].detail;
					
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
	.page {
		color: #4d4d4d;
		height: 100vh;
		overflow-y: scroll;
		background: #FAFAFA;
		font-size: 28rpx;
	}

	.operater_status {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		padding: 20rpx 0;
		background: #b82626;
		color: #fff;
		z-index: 100;
		text-align: center;
	}

	.pro_list {
		display: flex;
		justify-content: space-between;
	}

	.pro_listitem {
		background-color: #fff;
		padding: 10rpx 20rpx;
		border-bottom: 1rpx solid#ddd;
	}

	.pro_allmoney {
		background-color: #fff;
		padding: 10rpx 20rpx;
		text-align: right;
		font-size: 32rpx;
		color: #f30;
	}

	.beizhu_style {
		width: 100%;
		background-color: #fff;
		padding: 20rpx;
		font-size: 32rpx;
	}

	.confrim_button {
		width: 60%;
		background: #426ab3;
		color: #fff;
		font-size: 32rpx;
		margin: 10% 20%;
	}

	.detail_bottom {
		width: calc(100% - 40rpx);
		background-color: #fff;
		padding: 20rpx;
	}

	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}

	.common_style {
		line-height: 80rpx;
		margin-left: 20rpx;
		color: #000;
	}

	.real_color {
		color: #f30 !important;
	}

	.kaidanmx {
		margin-top: 30rpx;
	}

	.display_flex {
		display: flex;
		align-items: center;
		background: #FFFFFF;
		padding: 15rpx 30rpx;
	}

	.left_content {
		width: 150rpx;
	}
</style>
