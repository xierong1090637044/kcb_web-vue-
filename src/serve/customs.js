let userid = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).objectId : "";
let uid = localStorage.getItem('uid');
export default {
	//得到客户列表
	get_customList(disabled,search_text) {
		return new Promise((resolve, reject) => {

			const query = Bmob.Query("customs");
			query.order("num");
			query.equalTo("parent", "==", userid);
      if(disabled ==true ||disabled ==false){
        query.equalTo("disabled", "==",disabled);
      }
			if (search_text) {
				query.equalTo("custom_name", "==", {
					"$regex": "" + search_text + ".*"
				});
			}
			query.find().then(res => {
				resolve(res)
			});
		})
	},

  //得到客户的销售记录
  getCustomSellList(params){
    return new Promise((resolve, reject) => {
      const query = Bmob.Query("order_opreations");
      query.equalTo("master", "==", uid);
      query.equalTo("type", '==', -1);
      query.equalTo("extra_type", "==", 1);
      query.equalTo("extra_type", "==", 1);
      query.equalTo("custom", "==", params.customId);
      query.equalTo("status", "==", true);
      query.equalTo("createdAt", ">=", params.startDate);
      query.equalTo("createdAt", "<=", params.endDate);
      query.limit(50);
      query.skip(50 * (params.pageNum - 1));
      query.include("opreater","custom","stock");
      query.order("-createdAt");
      query.find().then(res => {
      	resolve(res)
      });
    })
  },

  //得到所有的客户销售列表
  getAllCustomSellList(params) {
    return new Promise((resolve, reject) => {
      const query = Bmob.Query("order_opreations");
      query.equalTo("master", "==", uid);
      query.equalTo("type", '==', -1);
      query.equalTo("extra_type", "==", 1);
      query.equalTo("custom", "==", params.customId);
      query.equalTo("status", "==", true);
      query.equalTo("createdAt", ">=", params.startDate);
      query.equalTo("createdAt", "<=", params.endDate);
      query.count().then(res => {
        let count = res;
        let countIndex = 0;
        let allList = [];

        for (var i = 0; i < Math.ceil(count / 500); i++) {
          query.equalTo("master", "==", uid);
          query.equalTo("type", '==', -1);
          query.equalTo("extra_type", "==", 1);
          query.equalTo("custom", "==", params.customId);
          query.equalTo("status", "==", true);
          query.limit(500);
          query.skip(500 * i);
          query.include("opreater","custom","stock");
          query.order("-createdAt");
          query.equalTo("createdAt", ">=", params.startDate);
          query.equalTo("createdAt", "<=", params.endDate);
          query.find().then(res => {
            for (let item of res) {
              if (item.stockNames && item.stockNames.length > 0) {
                item.stock = item.stockNames.join("，")
              } else {
                item.stock = item.stock ? item.stock.stock_name : ""
              }

              item.opreater = item.opreater.nickName
              countIndex += 1;
            }
            allList = allList.concat(res);
            if (countIndex == count) {
              resolve(allList)
            }
          });
        }
      })
    })
  },

	//增加数据操作
	add_custom(params) {

		console.log(params)
		let userid = JSON.parse(localStorage.getItem('user')).objectId;

		return new Promise((resolve, reject) => {
			const pointer = Bmob.Pointer('_User');
			let poiID = pointer.set(userid);

			if (params.objectId) {//修改操作
				const query = Bmob.Query('customs');
				query.set("custom_name", params.custom_name);
				query.set("debt", Number(params.debt));
				query.set("custom_address", params.custom_address);
				query.set("custom_phone", params.custom_phone);
				query.set("parent", poiID);
				query.set("disabled", !params.disabled);
				query.set("id", params.objectId);
				query.save().then(res => {
					resolve(res)
				}).catch(err => {
					console.log(err)

				})
			} else {

				const query = Bmob.Query("customs");
				query.equalTo("parent", "==", userid);
				query.equalTo("name", "==",params.custom_name);
				query.find().then(res => {
					console.log(res)
					if (res.length == 0) {
						const query = Bmob.Query('customs');
						query.set("custom_name", params.custom_name);
						query.set("debt", Number(params.debt));
						query.set("custom_address",params.custom_address);
						query.set("custom_phone",params.custom_phone);
						query.set("have_out", 0);
						query.set("disabled", !params.disabled);
						query.set("parent", poiID);
						query.save().then(res => {
							resolve(res)
						}).catch(err => {
							console.log(err)
						})
					} else {
						resolve(false)
					}

				});

			}

		})
	},

	//删除门店
	delete_custom(id) {
		return new Promise((resolve, reject) => {
			const query = Bmob.Query("customs");
			query.destroy(id).then(res => {
				resolve(res)
			}).catch(err => {
				console.log(err)
			})
		})

	},


}
