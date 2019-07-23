<template>
	<div>
		<!--<div style="margin-bottom: 10px;display: flex;align-items: center;justify-content: space-between;">

			<div style="display: flex;align-items: center;">
				<router-link to="/home/add_good">
					<Button type="success" style="margin-right: 10px;" icon="md-add">添加产品</Button>
				</router-link>

				<Button type="warning" @click="delete_good()" icon="ios-trash-outline" style="margin-right: 10px;">删除</Button>
				
				<Button type="error" @click="modal1=true" icon="ios-funnel-outline">筛选</Button>
			</div>

			<div style="display: flex;align-items: center;">
				<Button type="primary" @click="exportData()" icon="ios-download-outline"> 导出产品数据</Button>

				<div style="margin-left:10px">
					<input class="input-file" type="file" @change="importfile" accept=".csv,.excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
					 style="display: none;" />
					<Button type="primary" @click="btnClick" icon="ios-cloud-upload-outline">上传Excel表格数据</Button>
				</div>
			</div>
		</div>-->

		<Table :columns="columns" :data="order_opreations" :loading="loading" ref="table" border size="small" :height="screenHeight - 200"></Table>

		<div style="margin: 10px;overflow: hidden">
			<div style="float: right;">
				<Page :total="100" :current="pege_number" @on-change="changePage"></Page>
			</div>
		</div>

		<!--<Modal v-model="modal1" title="筛选" @on-ok="modal_confrim" @on-cancel="cancel" cancel-text="重置">
			<Form :label-width="80">
				<FormItem label="产品名字">
				    <Input v-model="search_goodMame" placeholder="请输入产品名字"></Input>
				</FormItem>
				
				<FormItem label="产品分类">
					<Row>
						<Col span="6">
						<Select v-model="selected_goodsClass" placeholder="请选择一级分类" @on-change="get_secondclass">
							<Option v-for="(value,index) in all_fristclass" :value="value.objectId" :key="index">{{value.class_text}}</Option>
						</Select>
						</Col>
						<Col span="6" style="margin-left: 20px;">
						<Select v-model="selected_second_class" placeholder="请选择二级分类">
							<Option v-for="(value,index) in all_secondclass" :value="value.objectId" :key="index">{{value.class_text}}</Option>
						</Select>
						</Col>
					</Row>
				</FormItem>
				
				<FormItem label="存放仓库">
					<Row>
						<Col span="6">
						<Select v-model="selected_stocks" placeholder="请选择存放仓库">
							<Option v-for="(value,index) in all_stocks" :value="value.objectId" :key="index">{{value.stock_name}}</Option>
						</Select>
						</Col>
					</Row>
				</FormItem>
			</Form>
		</Modal>-->

	</div>
</template>
<script>
	import common from '@/serve/common.js';
	let that;

	export default {
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
						type: 'selection',
						width: 60,
						align: 'center'
					},
					{
						title: '操作产品',
						key: 'goodsName',
						sortable: true
					},
					{
						title: '成本价',
						key: 'costPrice',
						sortable: true
					},
					{
						title: '零售价',
						key: 'retailPrice',
						sortable: true
					},
					{
						title: '所属分类',
						key: 'class',
					},
					{
						title: '所属仓库',
						key: 'stocks',
					},
					{
						title: '当前库存',
						key: 'reserve',
						sortable: true
					},
					{
						title: '规格',
						key: 'packageContent'
					},
					{
						title: '单位',
						key: 'packingUnit'
					},
					{
						title: '登记编号',
						key: 'regNumber'
					},
					{
						title: '产品简介',
						key: 'product_info'
					},
					{
						title: '生产厂家',
						key: 'producer'
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
				/*const query = Bmob.Query('order_opreations');
				query.include("opreater", "custom", "producer");
				query.get(id).then(res => {
					console.log(res);
					that.setData({
						detail: res
					});
					const query = Bmob.Query('order_opreations');
					query.include("goodsId");
					query.field('relations', res.objectId);
					query.relation('Bills').then(res => {
						//console.log(res);
						that.setData({
							products: res.results,
							spinShow: false
						});
					})
				}).catch(err => {
					console.log(err)
				})*/
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
