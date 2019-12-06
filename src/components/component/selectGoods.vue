<template>
	<div>
		<Modal title="产品图片" v-model="select_good.show" :styles="{top: '4%'}" width="1000">
			<Table :columns="selectcColumns" :data="goods" :loading="loading" ref="table" border size="small" :height="screenHeight - 240"
			 @on-select="get_select" @on-select-cancel="cancle_select" @on-select-all-cancel="cancle_select" id="print_table">
				<template slot-scope="{ row, index }" slot="action">
					<div style="display: flex;justify-content: center;">
						<div style="margin-right: 10px"><Button type="primary" size="small">库存</Button></div>
						<div><Button type="primary" size="small">删除</Button></div>
						<!--<div><Button type="primary" size="small" v-print="'#printMe'" @click="Print(row)">打印</Button></div>-->
		
					</div>
		
				</template>
			</Table>
		</Modal>
	</div>
</template>

<script>
	
	data(){
		return{
			select_good: {
				show: true,
			}, //选择的产品
			selectcColumns: [{
					width: 60,
					type: 'selection',
					align: 'center',
				},
				{
					width: 180,
					title: '产品名字',
					key: 'goodsName',
					sortable: true,
					align: 'center',
				},
				{
					width: 100,
					align: 'center',
					title: '所属仓库',
					key: 'stocks',
				},
				{
					width: 120,
					align: 'center',
					title: '库存',
					key: 'reserve',
					sortable: true,
				},
				{
					title: '产品二维码',
					width: 100,
					key: 'qrcodeImg',
					render: (h, params) => {
						return h('div', {
							style: {
								"text-align": "center"
							},
						}, [
							h('img', {
								style: {
									width: "65px",
								},
								attrs: {
									src: params.row.qrcodeImg
								}
							})
						]);
					}
				},
				{
					width: 160,
					align: 'center',
					title: '创建时间',
					key: 'createdAt',
					sortable: true,
				},
				{
					width: 260,
					title: '操作',
					slot: 'action',
					align: 'center',
					fixed: 'right',
				}
			],
		}
	}
</script>

<style>
</style>
