export default {
  //添加一级分类
  add_fristclass(class_text,type) {
    let userid = JSON.parse(localStorage.getItem('user')).objectId;
    return new Promise((resolve, reject) => {
      const pointer = Bmob.Pointer('_User')
      const poiID = pointer.set(userid);

      const query = Bmob.Query('financeFristClass');
      query.set("parent", poiID);
      query.set("type", type);
      query.set("class_text", class_text);
      query.save().then(res => {
        resolve(true)
      }).catch(err => {
        console.log(err)
      })
    })

  },

  //添加二级分类
  add_secondclass(selected_id, class_text,type) {
    let userid = JSON.parse(localStorage.getItem('user')).objectId;
    return new Promise((resolve, reject) => {

      const pointer = Bmob.Pointer('financeFristClass')
      const poiID = pointer.set(selected_id)

      const query = Bmob.Query('financeSecondClass');
      query.set("class_text", class_text)
      query.set("parent", poiID)
      query.set("type", type)
      query.save().then(res => {
        //console.log(res)
        const relation = Bmob.Relation('financeFristClass') // 需要关联的表
        const relID = relation.add([res.objectId]) //关联表中需要关联的objectId, 返回一个Relation对象, add方法接受string和array的类型参数
        const query = Bmob.Query('financeFristClass')
        query.get(selected_id).then(res => {
          res.set('second', relID); // 将Relation对象保存到two字段中，即实现了一对多的关联
          res.save()

          resolve(true)
        })
      }).catch(err => {
        console.log(err)
      })
    })

  },

  //修改分类信息
  edit_secondclass(selected_id, class_text) {
    return new Promise((resolve, reject) => {
      const query = Bmob.Query("financeSecondClass");
      query.set('id', selected_id); //需要修改的objectId
      query.set('class_text', class_text);
      query.save().then(res => {
        console.log(res);
        resolve(res)
      }).catch(err => {
        console.log(err)
      })
    })

  },

  //获得产品一级分类
  edit_fristclass(id, class_text) {
    let userid = JSON.parse(localStorage.getItem('user')).objectId;
    return new Promise((resolve, reject) => {

      const query = Bmob.Query("financeFristClass");
      query.get(id).then(res => {
        resolve(res)
        res.set('class_text', class_text)
        res.save()
      }).catch(err => {
        console.log(err)
      })

    })
  },

  //删除分类
  delete_class(dbname, id) {
    return new Promise((resolve, reject) => {
      const query = Bmob.Query(dbname);
      query.destroy(id).then(res => {

        resolve(true)
      }).catch(err => {
        console.log(err)
      })
    })
  },

  //获得产品一级分类
  get_fristclass(type) {
  	let userid = JSON.parse(localStorage.getItem('user')).objectId;
  	return new Promise((resolve, reject) => {

  		const query = Bmob.Query("financeFristClass");
  		query.equalTo("parent", "==", userid);
      query.equalTo("type", "==", type);
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

  		const query = Bmob.Query('financeFristClass')
  		query.field('second', frist_classid)
  		query.relation('financeSecondClass').then(res => {
  			//console.log(res);
  			resolve(res.results)
  		})
  	})
  },
}
