export default {
	
	//得到员工列表
	get_stafflist(disabled,search_text) {
		return new Promise((resolve, reject) => {
			let userid = JSON.parse(localStorage.getItem('user')).objectId;
			const query = Bmob.Query("_User");
			query.order("num");
			query.equalTo("masterId", "==", userid);
			query.equalTo("disabled", "==",disabled);
			query.include("shop")
			if (search_text) {
				query.equalTo("name", "==", {
					"$regex": "" + search_text + ".*"
				});
			}
			query.find().then(res => {
				localStorage.setItem("staffs",JSON.stringify(res))
				resolve(res)
			});
		})
		
	},
	
	
	//增加数据操作
	add_staff(params) {
		let userid = JSON.parse(localStorage.getItem('user')).objectId;
		
		return new Promise((resolve, reject) => {
			const pointer = Bmob.Pointer('_User');
			let poiID = pointer.set(userid);
			
			if (params.objectId) {//修改操作				
				const pointer = Bmob.Pointer('_User');
				let poiID = pointer.set(userid);
				
				const query = Bmob.Query('_User');
				query.set("username", params.mobilePhoneNumber);
				query.set("nickName", params.name);
				query.set("password", params.password);
				query.set("pwd", params.password);
				query.set("mobilePhoneNumber", params.mobilePhoneNumber);
				query.set("rights", params.rights);
				query.set("address", params.address);
				query.set("avatarUrl", "http://www.shoujixungeng.com/2019/12/12/7c908b5c406d1e7d80ba0253903681ae.jpg");
				query.set("masterId", poiID);
				query.set("disabled", !params.disabled);
				query.set("shop",shopId);
				query.set("stocks", params.selectStock);
				query.set("id", params.objectId);
				query.save().then(res => {
					console.log(res)
					resolve(res)
				}).catch(err => {
					console.log(err)
				
				})
			} else {
				
				const query = Bmob.Query("_User");
				query.equalTo("mobilePhoneNumber", "==", params.mobilePhoneNumber);
				query.find().then(res => {
					console.log(res)
					if (res.length == 0) {
				
						const query = Bmob.Query('_User');
						query.set("username", params.mobilePhoneNumber);
						query.set("nickName", params.name);
						query.set("password", params.password);
						query.set("pwd", params.password);
						query.set("mobilePhoneNumber", params.mobilePhoneNumber);
						query.set("rights", params.rights);
						query.set("address", params.address);
						query.set("avatarUrl", "http://www.shoujixungeng.com/2019/12/12/7c908b5c406d1e7d80ba0253903681ae.jpg");
						query.set("masterId", poiID);
						query.set("stocks", params.selectStock);
						query.set("have_out", 0);
						query.set("disabled", !params.disabled);
						query.save().then(res => {
							console.log(res)
							resolve(res)
						}).catch(err => {
							console.log(err)
							
							if(err.code ==209){
								resolve(false,"已存在此账号")
							}
				
						})
					} else {
						resolve(false,"已存在此账号")
					}
				
				});
				
			}
				
		})
	},
	
	//删除门店
	delete_staff(id) {
		return new Promise((resolve, reject) => {
			const query = Bmob.Query("_User");
			query.destroy(id).then(res => {
				resolve(res)
			}).catch(err => {
				console.log(err)
			})
		})
		
	},
	

}
