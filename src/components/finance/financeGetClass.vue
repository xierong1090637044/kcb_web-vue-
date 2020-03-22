// table.vue
<template>
	<div style="position: relative;">
		<Spin size="large" fix v-if="loading"></Spin>

		<div style="margin-bottom: 10px;">
			<Breadcrumb separator="<b style='color: #999;'>/</b>">
				<BreadcrumbItem to="/">首页</BreadcrumbItem>
				<BreadcrumbItem to="/home/goods">类别管理</BreadcrumbItem>
			</Breadcrumb>
		</div>
		
		<div style="margin-bottom: 10px;display: flex;align-items: center;justify-content: space-between;">
			<div style="display: flex;align-items: center;">
				<Button type="warning" @click="modal3 = true" icon="md-add" style="margin-right: 10px;background: #ed4014;">添加一级分类</Button>
			</div>
		</div>
		
		<Row type="flex" justify="start">
			<Col span="12">
				<Table :columns="columns" :data="data" stripe border :height="screenHeight - 250">
					<template slot-scope="{ row, index }" slot="action">
						<Button type="primary" size="small" style="margin-right: 5px" @click="edit(row,1)">修改</Button>
						<Button type="primary" size="small" style="margin-right: 5px" @click="add(row)">添加二级分类</Button>
						<Button type="primary" size="small" style="margin-right: 5px" @click="getSecond(row)">查看二级分类</Button>
						<Button type="error" size="small" @click="remove(row,1)">删除</Button>
					</template>
				</Table>
			</Col>
			<Col span="11" offset="1">
				<Table :columns="columns1" :data="data1" stripe border :height="screenHeight - 250" >
					<template slot-scope="{ row, index }" slot="action">
						<Button type="primary" size="small" style="margin-right: 5px" @click="edit(row,2)">修改</Button>
						<Button type="error" size="small" @click="remove(row,2)">删除</Button>
					</template>
				</Table>
			</Col>
		</Row>

		<Modal v-model="modal" :title="classType==1?'修改一级分类':'修改二级分类'" @on-ok="modal_confrim">
			<Form :label-width="80">
				<FormItem label="名字">
					<Input v-model="class_text"></Input>
				</FormItem>
			</Form>
		</Modal>

		<Modal v-model="modal2" width="360">
			<p slot="header" style="color:#f60;text-align:center">
				<Icon type="ios-information-circle"></Icon>
				<span>确定删除此分类</span>
			</p>
			<div style="text-align:center">
				<p>删除后将无法恢复</p>
			</div>
			<div slot="footer">
				<Button type="error" size="large" long @click="del">删除</Button>
			</div>
		</Modal>

		<!--添加一级分类-->
		<Modal v-model="modal3" title="添加一级分类" @on-ok="add_fristclass">
			<Form :label-width="80">
				<FormItem label="名字">
					<Input v-model="frist_classtext" placeholder="请输入一级类别的名字"></Input>
				</FormItem>
			</Form>
		</Modal>

		<!--添加二级级分类-->
		<Modal v-model="modal4" title="添加二级分类" @on-ok="add_secondclass">
			<Form :label-width="80">
				<FormItem label="名字">
					<Input v-model="second_classtext" placeholder="请输入二级类别的名字"></Input>
				</FormItem>
			</Form>
		</Modal>


	</div>
</template>
<script>
	import goods from '@/serve/goods.js';
	import manage from '@/serve/manage.js';

	let that;
	export default {
		components: {
		},
		data() {
			return {
				screenHeight: window.innerHeight,
				second_classtext: '', //二级分类的内容输入
				frist_classtext: '', //一级分类的内容输入
				loading: false,
				select_item: '',
				select_item1:'',
				class_text: '',
				modal: false,
				modal2: false,
				modal3: false,
				modal4: false, //二级分类
				classType:1,
				data: [],
				columns: [
					{
						title: '一级分类',
						key: 'class_text',
					},
					{
						title: '操作',
						slot: 'action',
						align: 'center'
					}
				],
				
				data1: [],
				columns1: [
					{
						title: '二级分类',
						key: 'class_text',
					},
					{
						title: '操作',
						slot: 'action',
						align: 'center'
					}
				],

			}
		},

		mounted() {
			that = this;
			manage.get_fristclass().then(res => {
				if(res.length > 0){
					goods.get_secondclass(res[0].objectId).then(res1 => {
						//console.log(res)
						this.data1 = res1
					})
				}
				that.data = res
			})
		},

		methods: {

			//查看二级分类
			getSecond(row){
				that.select_item =row
				goods.get_secondclass(row.objectId).then(res1 => {
					that.data1 = res1
				})
			},

			//添加一级分类确定
			add_fristclass() {
				that.loading = true;
				manage.add_fristclass(that.frist_classtext).then(res => {
					manage.get_fristclass().then(res => {
						that.$Message.success('添加成功');
						that.data = res
						that.loading = false;
					})
				})
			},

			//添加二级分类点击
			add(row) {
				that.select_item = row;
				that.modal4 = true;
			},

			//添加二级分类确定
			add_secondclass() {
				that.loading = true;
				manage.add_secondclass(that.select_item.objectId, that.second_classtext).then(res => {
					console.log(res)
					if (res) {
						goods.get_secondclass(that.select_item.objectId).then(res1 => {
							console.log(res1)
							that.data1 = res1
							that.loading = false;
							that.$Message.success('添加成功');
						})
					}
				})
			},


			edit(row,type) {
				that.classType = type;
				if(type == 1){
					that.select_item = row;
				}else{
					that.select_item = row.parent;
					that.select_item1 = row;
				}
				that.class_text = row.class_text
				that.modal = true;
			},

			//modal确认点击
			modal_confrim() {
				that.loading = true;
				if(that.classType == 1){
					manage.edit_fristclass(that.select_item.objectId, that.class_text).then(res => {
						manage.get_fristclass().then(res => {
							that.data = res;
							that.loading = false;
							that.$Message.success('修改成功');
						})
					})
				}else{
					manage.edit_secondclass(that.select_item1.objectId, that.class_text).then(res => {
							goods.get_secondclass(that.select_item.objectId).then(res1 => {
								//console.log(res)
								that.data1 = res1
								that.loading = false;
								that.$Message.success('修改成功');
							})
					})
				}
			},

			//删除分类点击
			remove(row,type) {
				that.classType = type;
				that.modal2 = true;
				if(type == 1){
					that.select_item = row;
				}else{
					that.select_item = row.parent;
					that.select_item1 = row;
				}
				
			},

			//确定删除
			del() {
				console.log(that.select_item.objectId)
				that.loading = true;
				if(that.classType == 1){
					manage.delete_class('class_user', that.select_item.objectId).then(res => {
							manage.get_fristclass().then(res => {
								that.data = res;
								that.modal2 = false,
								that.loading = false;
								that.$Message.success('删除成功');
							})
					})
				}else{
					manage.delete_class("second_class",that.select_item1.objectId).then(res => {
						goods.get_secondclass(that.select_item.objectId).then(res1 => {
							that.data1 = res1
							that.loading = false;
							that.modal2 = false,
							that.$Message.success('删除成功');
						})
					})
				}
				
			},
		},
	}
</script>
