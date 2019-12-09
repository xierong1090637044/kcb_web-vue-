export default {
	//批量删除功能
	delete_goods(goods) {
		return new Promise((resolve, reject) => {
			let count = 0;
			for (let good of goods) {
				const query = Bmob.Query('Goods');
				query.destroy(good.objectId).then(res => {

					if (good.order == 0) {
						query.equalTo("header", "==", good.objectId);
						query.equalTo("userId", "==", uid);
						query.find().then(todos => {
							todos.destroyAll().then(res => {
								// 成功批量修改
								console.log(res, 'ok')
							}).catch(err => {
								console.log(err)
							});
						})
					}

					count += 1;
					if (count == goods.length) {
						//console.log(res,count)
						resolve(true)
					}
				}).catch(err => {
					console.log(err)
				})
			}
		})
	},

	//上传商品
	upload_good(good) {
		return new Promise((resolve, reject) => {
			let uid = JSON.parse(localStorage.getItem('bmob')).objectId;

			const pointer = Bmob.Pointer('_User')
			const userid = pointer.set(uid)

			let pointer2 = Bmob.Pointer('class_user')
			let p_class_user_id = pointer2.set(good.goodsClass) //一级分类id关联

			let pointer3 = Bmob.Pointer('second_class')
			let p_second_class_id = pointer3.set(good.second_class) //仓库的id关联

			const query = Bmob.Query("Goods");
			query.equalTo("userId", "==", uid);
			query.equalTo("goodsName", "==", good.goodsName);
			query.equalTo("position", "==", good.position);
			query.find().then(res => {
				console.log(res)
				if (res.length >= 1) {
					resolve([false, res])
				} else {
					let reserve = good.reserve

					const query = Bmob.Query('Goods');
					query.set("goodsName", good.goodsName)
					query.set("goodsIcon", good.goodsIcon)
					query.set("costPrice", good.costPrice)
					query.set("retailPrice", good.retailPrice)
					if (good.nousetime) {
						let time = good.nousetime.replace(new RegExp('-', 'g'), "/")
						time = new Date(time).getTime()
						query.set("nousetime", time)
					}
					query.set("regNumber", good.regNumber)
					query.set("reserve", Number(good.reserve))
					query.set("productCode", good.productCode)
					//query.set("stocks", p_stock_id)
					query.set("product_info", good.product_info)
					query.set("producer", good.producer)
					query.set("packingUnit", good.packingUnit)
					query.set("packageContent", good.packageContent)
					query.set("warning_num", Number(good.warning_num))
					query.set("max_num", Number(good.max_num))
					query.set("stocktype", (Number(good.warning_num) >= Number(reserve)) ? 0 : 1) //库存数量类型 0代表库存不足 1代表库存充足
					query.set("second_class", p_second_class_id)
					query.set("goodsClass", p_class_user_id)

					query.set("userId", userid)
					if (good.stockReserve.length > 0) {
						query.set("order", 0)
					}
					query.save().then(res => {
						console.log(res)
						let this_result = res

						const queryArray = new Array();
						// 构造含有50个对象的数组
						for (var i = 0; i < good.stockReserve.length; i++) {
							const pointer1 = Bmob.Pointer('stocks')
							const p_stock_id = pointer1.set(good.stockReserve[i].stocks) //仓库的id关联

							const pointer2 = Bmob.Pointer('Goods')
							const p_good_id = pointer2.set(this_result.objectId) //仓库的id关联

							var queryObj = Bmob.Query('Goods');
							queryObj.set("order", 1)
							queryObj.set("goodsIcon", good.goodsIcon ? good.goodsIcon : '')
							queryObj.set("goodsName", good.goodsName)
							queryObj.set("costPrice", good.costPrice ? good.costPrice.toString() : '0')
							queryObj.set("retailPrice", good.retailPrice ? good.retailPrice.toString() : '0')
							queryObj.set("header", p_good_id)
							queryObj.set("userId", userid)
							queryObj.set("stocks", p_stock_id)
							queryObj.set("reserve", Number(good.stockReserve[i].reserve))
							queryObj.set("warning_num", Number(good.warning_num))
							queryObj.set("max_num", Number(good.max_num))
							good.productMoreG ? queryObj.set("models", good.stockReserve[i].models) : ''
							queryArray.push(queryObj);
						}

						// 传入刚刚构造的数组
						Bmob.Query('Goods').saveAll(queryArray).then(result => {
							console.log(result);
							/*uni.hideLoading();
							common.log(uni.getStorageSync("user").nickName + "增加了产品'" + good.goodsName + "'", 5, this_result.objectId);
							uni.showToast({
								title: "上传成功"
							})
	
							uni.setStorageSync("is_add", true)*/
						}).catch(err => {
							console.log(err);
						});

						///resolve([true, res])
					}).catch(err => {
						console.log(err)
					})
				}
			});
		})

	},


	//获得产品一级分类
	get_fristclass() {
		let userid = JSON.parse(localStorage.getItem('bmob')).objectId;
		return new Promise((resolve, reject) => {

			const query = Bmob.Query("class_user");
			query.equalTo("parent", "==", userid);
			query.find().then(res => {
				//console.log(res)
				localStorage.setItem("frist_class", JSON.stringify(res))
				resolve(res)
			});

		})
	},

	//获得产品的二级分类
	get_secondclass(frist_classid) {
		return new Promise((resolve, reject) => {

			const query = Bmob.Query('class_user')
			query.field('second', frist_classid)
			query.relation('second_class').then(res => {
				//console.log(res);
				resolve(res.results)
			})
		})
	},

	//得到仓库列表
	getstock_list: function(search_text) {
		let userid = JSON.parse(localStorage.getItem('bmob')).objectId;
		return new Promise((resolve, reject) => {
			const query = Bmob.Query("stocks");
			query.order("-num");
			query.include("charge", "shop")
			query.equalTo("parent", "==", userid);
			//query.equalTo("disabled", "==", that.disabled);
			if (search_text) {
				query.equalTo("stock_name", "==", {
					"$regex": "" + search_text + ".*"
				});

			}
			query.find().then(res => {
				//console.log(res)
				localStorage.setItem("stocks", JSON.stringify(res))
				resolve(res)
			});
		})
	},

}
