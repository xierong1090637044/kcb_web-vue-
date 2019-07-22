<template>
	<div>
		<div style="margin-bottom: 10px;display: flex;align-items: center;justify-content: space-between;">
			
			<div  style="display: flex;align-items: center;">
				<router-link to="/home/add_good">
					<Button type="success" style="margin-right: 10px;" icon="md-add">添加产品</Button>
				</router-link>
				
				<Button type="warning" @click="delete_good()" icon="ios-trash-outline">删除</Button>
			</div>
			
			<div style="display: flex;align-items: center;">
				<Button type="primary" @click="exportData()" icon="ios-download-outline"> 导出产品数据</Button>
				
				<div style="margin-left:10px">
					<input
						class="input-file"
						type="file"
						@change="importfile"
						accept=".csv,.excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
						style="display: none;"
					/>
					<Button type="primary" @click="btnClick" icon="ios-cloud-upload-outline">上传Excel表格数据</Button>
				</div>
			</div>
		</div>

		<Table :columns="columns" :data="goods" :loading="loading" ref="table" border size="small" :height="screenHeight - 200" @on-select="get_select" @on-select-cancel="cancle_select" @on-selection-change="get_select" @on-select-all-cancel="cancle_select"></Table>

		<div style="margin: 10px;overflow: hidden">
			<div style="float: right;"><Page :total="100" :current="pege_number" @on-change="changePage"></Page></div>
		</div>
	</div>
</template>
<script>
import common from '@/serve/common.js';
import goods from '@/serve/goods.js';
import XLSX from 'xlsx';

//let userid = JSON.parse(localStorage.getItem('bmob')).objectId;
let that;
export default {
	data() {
		return {
			userid:JSON.parse(localStorage.getItem('bmob')).objectId || '',
			page_size: 100,
			pege_number: 1,
			screenHeight: window.innerHeight,
			loading: true,
			columns: [
				{
					type: 'selection',
					width: 60,
					align: 'center'
				},
				{
					title: '产品名字',
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
					key: 'address'
				},
				{
					title: '登记编号',
					key: 'address'
				},
				{
					title: '单位',
					key: 'packingUnit'
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
			goods: [],
			select_goods:[]//选择模式下选择的产品数据
		};
	},

	mounted() {
		that = this;
		window.onresize = () => {
			return (() => {
				that.screenHeight = window.innerHeight;
			})();
		};
		this.get_productList();
	},

	methods: {
		
		//选择某一项时事件
		get_select(selection){
			that.select_goods = selection
		},
		
		//取消某一项时的事件
		cancle_select(selection){
			that.select_goods = selection
		},
		
		delete_good(){
			if(that.select_goods.length == 0){
				this.$Message.error('当前没有选择产品');
			}else{
				goods.delete_goods(that.select_goods).then(res=>{
					this.$Message.success('删除成功');
					that.get_productList();
				});

			}
		},
		
		btnClick() {
			document.querySelector('.input-file').click();
		},

		importfile(event) {
			if (!event.currentTarget.files.length) {
				return;
			}
			const that = this;
			// 拿取文件对象
			var f = event.currentTarget.files[0];
			// 用FileReader来读取
			var reader = new FileReader();
			// 重写FileReader上的readAsBinaryString方法
			FileReader.prototype.readAsBinaryString = function(f) {
				var binary = '';
				var wb; // 读取完成的数据
				var outdata; // 你需要的数据
				var reader = new FileReader();
				reader.onload = function(e) {
					// 读取成Uint8Array，再转换为Unicode编码（Unicode占两个字节）
					var bytes = new Uint8Array(reader.result);
					var length = bytes.byteLength;
					for (var i = 0; i < length; i++) {
						binary += String.fromCharCode(bytes[i]);
					}
					// 接下来就是xlsx了，具体可看api
					wb = XLSX.read(binary, {
						type: 'binary'
					});
					outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
					// 自定义方法向父组件传递数据
					that.add_all(outdata)
				};
				reader.readAsArrayBuffer(f);
			};
			reader.readAsBinaryString(f);
		},

		//导出数据表格点击
		exportData(type) {
			this.$refs.table.exportCsv({
				filename: '产品数据',
				original: false
			});
		},

		//改变页数
		changePage(pege_number) {
			that.pege_number = pege_number;

			that.get_productList();
		},

		//批量增加
		add_all(goods) {
			const queryArray = new Array();
			const pointer = Bmob.Pointer('_User')
			const poiID = pointer.set(that.userid)
			// 构造含有50个对象的数组
			for (let good of goods) {
				var queryObj = Bmob.Query('Goods');
				queryObj.set('goodsName', ""+good.商品名字);
				queryObj.set('costPrice', ""+good.成本价);
				queryObj.set('retailPrice', ""+good.零售价);
				queryObj.set('packingUnit', good.单位);
				queryObj.set('userId', poiID);
				queryArray.push(queryObj);
			}

			// 传入刚刚构造的数组
			Bmob.Query('Goods')
				.saveAll(queryArray)
				.then(result => {
					console.log(result);
					this.$Message.success('导入成功');
					that.get_productList()
				})
				.catch(err => {
					console.log(err);
				});
		},

		//查询产品列表
		get_productList() {
			const query = Bmob.Query('Goods');
			query.equalTo('userId', '==', that.userid);
			////query.equalTo("stocks", "==", that.stock.objectId);
			//query.equalTo("status", "!=", -1);
			//query.equalTo("second_class", "==", that.category.objectId);
			//query.equalTo("goodsName", "==", {
			//	"$regex": "" + search_text + ".*"
			//});
			query.limit(that.page_size);
			query.skip(that.page_size * (that.pege_number - 1));
			query.order("-createdAt"); //按照条件降序
			query.include('userId');
			query.include('goodsClass');
			query.include('stocks');
			query.find().then(res => {
				console.log(res);
				this.goods = res;
				this.loading = false;
			});
		}
	}
};
</script>
