// table-expand.vue
<style scoped>
	.expand-row {
		margin-bottom: 16px;
	}
</style>
<template>
	<div style="position: relative;">
		<Spin size="large" fix v-if="loading"></Spin>
		<div v-if="all_secondclass.length >0">
			<Row class="expand-row" v-for="(item,index) in all_secondclass" :key="index">
				<Col span="5">
				<span class="expand-key">二级分类Id： </span>
				<span class="expand-value">{{ item.objectId }}</span>
				</Col>
				<Col span="5">
				<span class="expand-key">二级分类名字: </span>
				<span class="expand-value">{{ item.class_text }}</span>
				</Col>
			</Row>
		</div>
		<div v-else>暂无二级分类</div>
		
	</div>
</template>
<script>
	import goods from '@/serve/goods.js';
	export default {
		props: {
			row: Object,
		},

		data() {
			return {
				all_secondclass: [],
				loading: true,
			}
		},

		mounted() {
			//获得二级分类

			goods.get_secondclass(this.row.objectId).then(res => {
				//console.log(res)
				this.all_secondclass = res
				this.loading = false;
			})

		},
	};
</script>
