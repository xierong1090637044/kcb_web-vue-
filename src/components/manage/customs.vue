<template>
	<div style="position: relative;">
		<Spin size="large" fix v-if="loading"></Spin>

		<div style="margin-bottom: 10px;">
			<Breadcrumb  separator="<b style='color: #999;'>/</b>">
				<BreadcrumbItem to="/">首页</BreadcrumbItem>
				<BreadcrumbItem  to="/home/goods">客户管理</BreadcrumbItem>
			</Breadcrumb>
		</div>

		<div style="margin-bottom: 10px;" class="display_flex_bet">
      <Input search enter-button placeholder="请输入客户名字" style="width: 25%" @on-search='searchCustom'/>
			<div style="display: flex;align-items: center;">
				<Button type="primary" @click="modal3 = true" icon="md-add" style="margin-right: 10px;background: #ed4014;">添加客户</Button>
			</div>
		</div>
		<Table :columns="columns" :data="data" stripe border :height="screenHeight - 250">
			<template slot-scope="{ row, index }" slot="action">
				<div>
          <Button type="primary" size="small" style="margin-right: 5px" @click="selectCustomId = row.objectId">销售报表</Button>
					<Button type="primary" size="small" style="margin-right: 5px" @click="edit(row)">修改</Button>
					<Button type="error" size="small" @click="remove(row)">删除</Button>
				</div>
			</template>
		</Table>

		<Modal v-model="modal2" width="360">
			<p slot="header" style="color:#f60;text-align:center">
				<Icon type="ios-information-circle"></Icon>
				<span>确定删除此客户</span>
			</p>
			<div style="text-align:center">
				<p>删除后将无法恢复</p>
			</div>
			<div slot="footer">
				<Button type="error" size="large" long @click="del">删除</Button>
			</div>
		</Modal>

		<!--添加客户-->
		<Modal v-model="modal3" title="添加客户" @on-ok="add_custom"  @on-cancel="custom= {}">
			<Form :label-width="80">
				<FormItem label="名字">
					<Input v-model="custom.custom_name" placeholder="请输入客户的名字"></Input>
				</FormItem>
				<FormItem label="地址">
					<Input v-model="custom.custom_address" placeholder="请输入客户的地址"></Input>
				</FormItem>
				<FormItem label="电话">
					<Input v-model="custom.custom_phone" placeholder="请输入客户的电话"></Input>
				</FormItem>


				<FormItem label="欠款金额">
					<Input v-model="custom.debt" placeholder="请输入备注"></Input>
				</FormItem>

				<FormItem label="启用">
					<i-switch v-model="custom.disabled" size="large">
						<span slot="open">启</span>
						<span slot="close">关</span>
					</i-switch>
				</FormItem>
			</Form>
		</Modal>

    <sellHistory :customId="selectCustomId" v-if="selectCustomId" @cancle="selectCustomId = ''"></sellHistory>
	</div>
</template>
<script>
	import customs from '@/serve/customs.js';
  import sellHistory from '@/components/component/custom/sellHistory.vue';
	let that;
	export default {
		components: {
      sellHistory:sellHistory
		},
		data() {
			return {
				screenHeight: window.innerHeight,
        selectCustomId:"",
				custom: {
					custom_name: "",
					custom_address:"",
					custom_phone:"",
					debt: 0,
					disabled: true,
					objectId:"",
				}, //添加客户的对象
				loading: false,
				modal: false,
				modal2: false,
				modal3: false,
				data: [],
				columns: [{
						type: 'index',
						width: 60,
						align: 'center'
					},
					{
						title: '客户名字',
						key: 'custom_name',
					},
					{
						title: '客户地址',
						key: 'custom_address',
					},
					{
						title: '客户电话',
						key: 'custom_phone',
					},

					/*{
						title: '欠款金额',
						key: 'debt',
            render: (h, params) => {
            	return h('div',{
                style: {
                  "color": "#f30"
                },
              }, ["￥"+(params.row.debt)])
            }
					},*/
					{
						title: '创建时间',
						key: 'createdAt',
						sortable: true
					},
          {
          	title: '是否已启用',
            width: 160,
          	key: 'disabled',
          	render: (h, params) => {
          		return h('div', [(params.row.disabled) ? "未启用" : "已启用"])
          	}
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
			//console.log(this.$route.query.type)
			that = this;
			that.getCustomList();
		},

		methods: {

      //得到客户列表
      getCustomList(disabled,search_text){
        this.$Loading.start();
        customs.get_customList(disabled,search_text).then(res=>{
        	this.$Loading.finish();
        	that.data = res;
        })
      },

      //搜索客户
      searchCustom(value){
        that.getCustomList(null,value);
      },

			//添加客户点击确定
			add_custom(){
				if(that.custom.custom_name){
					this.$Loading.start();
					customs.add_custom(that.custom).then(res=>{
						customs.get_customList().then(res=>{
							this.$Message.success('成功');
							this.$Loading.finish();
							that.data = res;
						})
					});
				}else{
					this.$Message.error('请输入客户名字');
				}

			},

			//修改客户
			edit(row) {
				that.modal3 = true;
				that.custom.custom_name = row.custom_name
				that.custom.custom_address = row.custom_address
				that.custom.custom_phone = row.custom_phone
				that.custom.disabled = !row.disabled
				that.custom.debt = row.debt
				that.custom.objectId = row.objectId
			},

			//删除分类点击
			remove(row) {
				that.modal2 = true,
				that.custom.objectId = row.objectId
			},

			//确定删除
			del() {
				that.modal2 = false,
				this.$Loading.start();
				customs.delete_custom(that.custom.objectId).then(res => {
					customs.get_customList().then(res=>{
						this.$Message.success('删除成功');
						this.$Loading.finish();
						that.data = res;
					})
				})
			},


		},
	}
</script>
<style>
  .ivu-input-search {
      background-color: #426ab3 !important;
      border-color: #426ab3 !important;
  }
</style>
