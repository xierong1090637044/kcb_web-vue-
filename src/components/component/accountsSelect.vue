<template>
	<div>
		<Modal title="选择结算账户" :closable="false" width="80%" :value="true" @on-cancel="outData">
			<Table :columns="columns" :data="data" stripe border :height="screenHeight - 350">
				<template slot-scope="{ row, index }" slot="action">
					<Button type="primary" size="small" style="margin-right: 5px" @click="select(row)">选择</Button>
				</template>
			</Table>
		</Modal>
	</div>
</template>

<script>
	let that;
	export default {
		components: {

		},
		data() {
			return {
				screenHeight: window.innerHeight,
				account: {
					name: "",
					number: "",
					type: "",
					money: 0,
					beizhu: '',
					objectId: "",
				}, //添加供货商的对象
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
						title: '账户类型',
						key: 'type',
					},
					{
						title: '账号',
						key: 'name',
					},
					{
						title: '账号余额',
						key: 'money',
					},
					{
						title: '期初金额',
						key: 'originalMoney',
					},
					{
						title: '备注',
						key: 'beizhu',
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
			that.getAccountList()
		},

		methods: {
			
			select(row){
				this.$emit('select',row)
			},
			
			//取消操作
			outData(){
			  this.$emit('cancle',false)
			},

			//得到账户列表
			getAccountList() {
				that.$Loading.start();
				that.$http.Post("financeList", {}).then(res => {
					that.$Loading.finish();
					that.data = res.data
				})
			}

		},
	}
</script>

<style>
</style>
