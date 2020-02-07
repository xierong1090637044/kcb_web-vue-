// table.vue
<template>
	<div style="position: relative;">
		<Spin size="large" fix v-if="loading"></Spin>

		<div style="margin-bottom: 10px;">
			<Breadcrumb separator="<b style='color: #999;'>/</b>">
				<BreadcrumbItem to="/">首页</BreadcrumbItem>
				<BreadcrumbItem to="/home/goods">员工管理</BreadcrumbItem>
			</Breadcrumb>
		</div>

		<div style="margin-bottom: 10px;display: flex;align-items: center;justify-content: space-between;">
			<div style="display: flex;align-items: center;">
				<Button type="warning" @click="modal3 = true" icon="md-add" style="margin-right: 10px;background: #ed4014;">添加员工</Button>
			</div>
		</div>

		<Table :columns="columns" :data="data" stripe border :height="screenHeight - 250">
			<template slot-scope="{ row, index }" slot="action">
				<Button type="primary" size="small" style="margin-right: 5px" @click="edit(row)">修改</Button>
				<Button type="error" size="small" @click="remove(row)">删除</Button>
			</template>
		</Table>

		<Modal v-model="modal2" width="360">
			<p slot="header" style="color:#f60;text-align:center">
				<Icon type="ios-information-circle"></Icon>
				<span>确定删除此员工</span>
			</p>
			<div style="text-align:center">
				<p>删除后将无法恢复</p>
			</div>
			<div slot="footer">
				<Button type="error" size="large" long @click="del">删除</Button>
			</div>
		</Modal>

		<!--添加员工-->
		<Modal v-model="modal3" title="添加员工" @on-ok="add_staff" @on-cancel="handleData"  width="60%">
			<Form :label-width="80">
				<FormItem label="名字">
					<Input v-model="staff.name" placeholder="请输入员工的名字"></Input>
				</FormItem>

				<FormItem label="账号">
					<Input v-model="staff.mobilePhoneNumber" placeholder="请输入员工的登陆" maxlength="11"></Input>
				</FormItem>
				<FormItem label="密码">
					<Input v-model="staff.password" placeholder="请输入员工的登陆密码"></Input>
				</FormItem>

				<FormItem label="负责门店">
					<Select v-model="staff.shop" placeholder="请选择负责的门店" style="text-align: left;">
						<Option v-for="(item,index) in shops" :value="item.objectId" :key="index">{{item.name}}</Option>
					</Select>
				</FormItem>

				<FormItem label="地址">
					<Input v-model="staff.address" placeholder="请输入员工的联系地址"></Input>
				</FormItem>

				<FormItem label="启用">
					<i-switch v-model="staff.disabled" size="large" style="text-align: left;">
						<span slot="open">启</span>
						<span slot="close">关</span>
					</i-switch>
				</FormItem>

				<FormItem label="库存模块权限" :label-width="120">
					<CheckboxGroup v-model="staff.rights.current" style="text-align: left;">
						<span v-for="(item,index) in manage" @click="getThisIndex(index)">
							<Checkbox  :label="''+index" :key="index">
								<span>{{item.name}}</span>
							</Checkbox>
						</span>
					</CheckboxGroup>
				</FormItem>

        <FormItem label="财务模块权限" :label-width="120">
        	<CheckboxGroup v-model="staff.rights.moneyCurrent" style="text-align: left;">
        		<span v-for="(item,index) in moneyAuth">
        			<Checkbox  :label="''+index" :key="index">
        				<span>{{item.name}}</span>
        			</Checkbox>
        		</span>
        	</CheckboxGroup>
        </FormItem>

        <FormItem label="分析模块权限" :label-width="120">
        	<CheckboxGroup v-model="staff.rights.analysisCurrent" style="text-align: left;">
        		<span v-for="(item,index) in analysisAuth">
        			<Checkbox  :label="''+index" :key="index">
        				<span>{{item.name}}</span>
        			</Checkbox>
        		</span>
        	</CheckboxGroup>
        </FormItem>

				<FormItem label="记录模块权限" :label-width="120">
					<CheckboxGroup v-model="staff.rights.recodecurrent" style="text-align: left;">
						<Checkbox v-for="(item,index) in recode" :label="''+index" :key="index">
							<span>{{item.name}}</span>
						</Checkbox>
					</CheckboxGroup>
				</FormItem>

				<FormItem label="其他权限" :label-width="120">
					<CheckboxGroup v-model="staff.rights.othercurrent" style="text-align: left;">
						<Checkbox v-for="(item,index) in others" :label="''+index" :key="index">
							<span>{{item.name}}</span>
						</Checkbox>
					</CheckboxGroup>
				</FormItem>
			</Form>
		</Modal>

		<!--选择管理的仓库-->
		<Modal title="选择管理的仓库" v-model="newStock.show">
			<div class="display_flex_bet" style="flex-wrap: wrap;">
				<div style="margin-right: 10px;">仓库</div>
				<CheckboxGroup v-model="staff.selectStock" style="text-align: left;">
					<Checkbox v-for="(item,index) in newStock.allStocks" :label="index" :key="index">
						<span>{{item.stock_name}}</span>
					</Checkbox>
				</CheckboxGroup>
			</div>
		</Modal>


	</div>
</template>
<script>
	import staffs from '@/serve/staffs.js';
	import shops from '@/serve/shops.js';
	import goods from '@/serve/goods.js';
	import expandRights from '@/components/component/expandRights.vue';

	let that;
	export default {
		components: {
			expandRights
		},
		data() {
			return {
				newStock: {
					show: false,
					allStocks: [],
				},
				screenHeight: window.innerHeight,
				shops: [],
				manage: [{
						id: 1,
						name: '产品管理'
					},
					{
						id: 2,
						name: '员工管理'
					},
					{
						id: 3,
						name: '仓库管理'
					},
					{
						id: 4,
						name: '门店管理'
					},
					{
						id: 5,
						name: '客户管理'
					},
					{
						id: 6,
						name: '产品类别管理'
					},
					{
						id: 7,
						name: '库存管理（出库、入库、调拨、盘点操作）'
					},
					{
						id: 8,
						name: '采购（采购，采购退货操作）'
					},
					{
						id: 9,
						name: '销售（销售，销售退货操作）'
					}
				],

        //财务权限模块
        moneyAuth:[{
        		id: 1,
        		name: '财务管理模块查看'
        	}
        ],

        //分析模块权限
        analysisAuth:[{
        		id: 1,
        		name: '分析模块查看'
        	}
        ],
				recode: [{
						id: 1,
						name: '入库记录'
					},
					{
						id: 2,
						name: '出库记录'
					},
					{
						id: 3,
						name: '调拨记录'
					},
					{
						id: 4,
						name: '盘点记录'
					},
				],
				others: [{
					id: 1,
					name: '进价隐藏'
				},{
					id: 2,
					name: '审核'
				},{
					id: 3,
					name: '看板查看'
				}],
				staff: {
					name: "",
					mobilePhoneNumber: "",
					password: "",
					shop: '',
					address: "",
					disabled: true,
					rights: {
						current: [],
            analysisCurrent:[],
            moneyCurrent:[],
						recodecurrent: [],
						othercurrent: [], //其他权限
					},
					objectId: "",
					selectStock: [], //选择的仓库
				}, //添加员工的对象
				loading: false,
				modal: false,
				modal2: false,
				modal3: false,
				data: [],
				columns: [{
						type: 'expand',
						width: 50,
						render: (h, params) => {
							return h(expandRights, {
								props: {
									row: params.row.rights
								}
							})
						}
					}, {
						type: 'index',
						width: 60,
						align: 'center'
					},
					{
						title: '员工Id',
						key: 'objectId',
					},
					{
						title: '员工名字',
						key: 'nickName',
					},
					{
						title: '登录账号',
						key: 'mobilePhoneNumber',
					},
					{
						title: '登录密码',
						key: 'pwd',
					},
					{
						title: '负责门店',
						key: 'shop',
						render: (h, params) => {
							return h('div', [params.row.shop ? params.row.shop.name : "无"])
						}
					},
					{
						title: '联系地址',
						key: 'address',
					},
					{
						title: '是否已启用',
						key: 'disabled',
						render: (h, params) => {
							return h('div', [(params.row.disabled) ? "未启用" : "已启用"])
						}
					},
					{
						title: '创建时间',
						key: 'createdAt',
						sortable: true
					},
					{
						title: '操作',
						slot: 'action',
						align: 'center'
					}
				]
			}
		},

		mounted() {
			that = this;
			this.$Loading.start();
			staffs.get_stafflist().then(res => {
				console.log(res)

				that.data = res;

				shops.get_shopList().then(res => {
					//console.log(res)
					that.shops = res;
					goods.getstock_list().then(res => {
						console.log(res)
						that.newStock.allStocks = res
						this.$Loading.finish();
						//that.all_fristclass = res
					});
				})
			})


		},

		methods: {

			//选择第一个权限是触发
			getThisIndex(index) {
				console.log(index,that.staff.rights.current,that.staff.rights.current.indexOf('2'))
				if (index == 2) {
					setTimeout(function(){
						if(that.staff.rights.current.indexOf('2') !=-1){
							that.newStock.show = true;
						}
					},100)
				}
			},

			//添加员工点击确定
			add_staff() {
				console.log(that.staff)
				if (that.staff.name) {
					this.$Loading.start();
					staffs.add_staff(that.staff).then(res => {
						staffs.get_stafflist().then(res => {
							this.$Message.success('成功');
							this.$Loading.finish();
							that.data = res;
						})
					});
				} else {
					this.$Message.error('请输入员工名字');
				}

			},

			//修改员工
			edit(row) {
				that.modal3 = true;
				that.staff.name = row.username
				that.staff.mobilePhoneNumber = row.mobilePhoneNumber
				that.staff.password = row.pwd
				that.staff.shop = (row.shop) ? (row.shop.name) : ""
				that.staff.address = row.address
				that.staff.objectId = row.objectId
				that.staff.disabled = !row.disabled

				that.staff.rights.current = row.rights.current || []
				that.staff.rights.recodecurrent = row.rights.recodecurrent || []
				that.staff.rights.othercurrent = row.rights.othercurrent || []
        that.staff.rights.analysisCurrent = row.rights.analysisCurrent || []
        that.staff.rights.moneyCurrent = row.rights.moneyCurrent || []
			},

			//删除分类点击
			remove(row) {
				that.modal2 = true,
					that.staff.objectId = row.objectId
			},

			//确定删除
			del() {
				that.modal2 = false,
					this.$Loading.start();
				staffs.delete_staff(that.staff.objectId).then(res => {
					staffs.get_stafflist().then(res => {
						this.$Message.success('删除成功');
						this.$Loading.finish();
						that.data = res;
					})
				})
			},

			//重置数据
			handleData() {
				that.staff = {
					name: "",
					mobilePhoneNumber: "",
					password: "",
					shop: '',
					address: "",
					disabled: true,
					rights: {
						current: [],
						recodecurrent: [],
						othercurrent: [],
            analysisCurrent:[],
            moneyCurrent:[],
					},
					objectId: "",
					selectStock: [], //选择的仓库
				} //添加员工的对象
			},

		},
	}
</script>
