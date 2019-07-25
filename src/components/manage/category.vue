// table.vue
<template>
	<Table :columns="columns" :data="data"></Table>
</template>
<script>
	import expandRow from '@/components/component/category_expand.vue';
	
	let that;
	export default {
		components: {
			expandRow
		},
		data() {
			return {
				data:[],
				columns: [{
						type: 'expand',
						width: 50,
						render: (h, params) => {
							return h(expandRow, {
								props: {
									row: params.row
								}
							})
						}
					},
					{
						title: '类别Id',
						key: 'objectId',
					},
					{
						title: '类别名字',
						key: 'class_text',
					},
				]
			}
		},
		
		mounted() {
			that = this;
			that.data = JSON.parse(localStorage.getItem("frist_class"))
		},
	}
</script>
