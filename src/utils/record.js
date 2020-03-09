import Bmob from "hydrogen-js-sdk";
export default {

	//得到记录的总条数
	querycount: function() {
		let uid = JSON.parse(localStorage.getItem('bmob')).objectId

		return new Promise((resolve, reject) => {
			const query = Bmob.Query("NGoods");
			query.equalTo("userId", "==", uid);
			query.count().then(res => {
				resolve(res)
				console.log(`共有${res}条记录`)
			})
		})
	},

	//得到今日概况
	gettoday_detail: function(start_date, end_date) {
		let uid = JSON.parse(localStorage.getItem('bmob')).objectId
		let get_reserve = 0; //入库数量
		let out_reserve = 0; //出库数量
		let get_reserve_real_money = 0;
		let out_reserve_real_money = 0;
		let get_reserve_num = 0;
		let out_reserve_num = 0;
		let params = {};

		return new Promise((resolve, reject) => {
			const query = Bmob.Query("NBills");
			query.equalTo("userId", "==", uid);
			query.equalTo("createdAt", ">=", start_date);
			query.equalTo("createdAt", "<=", end_date);
			query.select("goodsId", "num", "total_money", "type");
			query.limit(1000);
			query.include("goodsId");
			query.find().then(res => {
				//console.log(res)
				for (var i = 0; i < res.length; i++) {
					if (res[i].type == 1) {
						get_reserve += res[i].num;
						get_reserve_real_money += res[i].num * res[i].goodsId.retailPrice;
						get_reserve_num += res[i].total_money;
					} else if (res[i].type == -1) {
						out_reserve += res[i].num;
						out_reserve_real_money += res[i].num * res[i].goodsId.costPrice;
						out_reserve_num += res[i].total_money;
					}
				}


				params.get_reserve = get_reserve.toFixed(0)
				params.out_reserve = out_reserve.toFixed(0)
				params.get_reserve_real_money = get_reserve_real_money.toFixed(0)
				params.out_reserve_real_money = out_reserve_real_money.toFixed(0)
				params.get_reserve_num = get_reserve_num.toFixed(0)
				params.out_reserve_num = out_reserve_num.toFixed(0)
				params.get_reserve_get_num = (get_reserve_num - get_reserve_real_money).toFixed(0)
				params.out_reserve_get_num = (out_reserve_num - out_reserve_real_money).toFixed(0)


				console.log(get_reserve)


				//查询当日应收和实际收款
				let should_get_money = 0;
				let real_get_money = 0;
				const query = Bmob.Query("order_opreations");
				query.equalTo("master", "==", uid);
				query.equalTo("createdAt", ">=", start_date);
				query.equalTo("createdAt", "<=", end_date);
				query.equalTo("type", "==", -1);
				query.find().then(res => {
					//console.log(res);
					for (var i = 0; i < res.length; i++) {
						should_get_money += res[i].all_money;
						real_get_money += res[i].real_money;
					}

					params.should_get_money = should_get_money
					params.real_get_money = real_get_money
				});

				resolve(params);
			});
		})


	},

	//获得库存成本和总库存
	loadallGoods: function() {
		let uid = localStorage.getItem("uid")
		let user = JSON.parse(localStorage.getItem("user")) 
		let setting = JSON.parse(localStorage.getItem("setting")) 
		return new Promise((resolve, reject) => {
			let total_reserve = 0;
			let total_money = 0;
			let length = 0;
			let warn_num = 0;
			let over_num = 0;
			let key = 0; //计数器
			let params = {}
			this.querycount().then(count => {
				params.total_products = count
				for (var i = 0; i < Math.ceil(count / 500); i++) {
					console.log(i)
					const query = Bmob.Query("NGoods");
					query.equalTo("userId", "==", uid);
					query.equalTo("status", "!=", -1);
					query.equalTo("order", "!=", 1);
					query.select("reserve", "costPrice", "stocktype");
					query.limit(500);
					query.skip(500 * i);
					query.find().then(res => {
						for (let item of res) {
							if (item.stocktype == 0) {
								warn_num += 1;
							} else if (item.stocktype == 2) {
								over_num += 1;
							}
							total_reserve += item.reserve;
							total_money += item.reserve * item.costPrice;
						}
	
						key += 1
						//返回数据
						if (key == Math.ceil(count / 500)) {
							if (user.identity != 1 && user.rights && user.rights.othercurrent[0] != '0') {
								total_money = 0
							}
							if (Number(total_reserve) > 1000 && Number(total_reserve) < 10000) {
								total_reserve = Number(total_reserve) / 1000 + "千"
							} else if (Number(total_reserve) >= 10000 && Number(total_money) < 100000) {
								total_reserve = Number(total_reserve) / 10000 + "万"
							} else if (Number(total_reserve) >= 100000) {
								total_reserve = Number(total_reserve) / 10000 + "十万"
							}
	
							if (Number(total_money) > 1000 && Number(total_money) < 10000) {
								total_money = (Number(total_money) / 1000).toFixed(2) + "千"
							} else if (Number(total_money) >= 10000 && Number(total_money) < 100000) {
								total_money = (Number(total_money) / 10000).toFixed(4) + "万"
							} else if (Number(total_money) >= 100000) {
								total_money = (Number(total_money) / 100000).toFixed(4) + "十万"
							}
							params.total_money = total_money,
								params.total_reserve = total_reserve,
								params.warn_num = warn_num
							params.over_num = over_num
							resolve(params)
						}
					});
				}
			})
		})
	},
}
