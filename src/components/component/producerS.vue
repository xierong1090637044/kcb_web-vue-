<template>
	<div>
		<Modal title="Title" v-model="modal7" :closable="false" width="80%">

			<Table :columns="columns" :data="data" stripe border :height="screenHeight - 250">
				<template slot-scope="{ row, index }" slot="action">
					<Button type="primary" size="small" style="margin-right: 5px" @click="choose(row)">选择</Button>
				</template>
			</Table>
		</Modal>
	</div>
</template>

<script>
	import customs from '@/serve/customs.js';
	let that;
	export default {
		props: {
			modal7: Boolean,
		},

		data() {
			return {
				screenHeight: window.innerHeight,
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
						title: '客户Id',
						key: 'objectId',
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
					{
						title: '是否已启用',
						key: 'disabled',
						render: (h, params) => {
							return h('div', [(params.row.disabled) ? "未启用" : "已启用"])
						}
					},
					{
						title: '欠款金额',
						key: 'debt',
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
			customs.get_customList().then(res => {
				console.log(res)
				this.$Loading.finish();
				that.data = res;
			})
		},
	};
</script>

<style>
</style>
