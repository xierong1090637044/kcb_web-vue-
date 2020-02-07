<template>
  <div>
    <Modal title="选择产品分类" :closable="false" width="60%" :value="true" :footer-hide="true"	 @on-cancel="cancle">
      <div class='page'>
        <div class="content">
          <div class="left_content">
            <div style="height: 25rem;overflow-y: scroll;">
              <div v-for="(item,index) in frist_class" :key="index" :class="selected_id===item.objectId?'selectd_item':''"
                class="class_item" style="font-weight: bold;">
                <div class="class_texxt_div" @click="get_second_category(item.objectId)">{{item.class_text}}</div>
                <div class="display_flex" style="justify-content: flex-end;width: 100%;" v-if="is_choose" @click="select_this(item,1)">选择</div>
              </div>
            </div>
          </div>
          <div class="right_content">
            <div style="height: 25rem;overflow-y: scroll;">
              <div v-for="(item,index) in second_class" :key="index" class="class_item" style="color: #333333;">
                <div class="class_texxt_div">{{item.class_text}}</div>
                <div class="display_flex" style="justify-content: flex-end;width: 100%;" v-if="is_choose" @click="select_this(item,2)">选择</div>
              </div>
            </div>
          </div>
        </div>
    
      </div>
    </Modal>
  </div>
  
</template>

<script>
  import Bmob from "hydrogen-js-sdk";

  let that;
  let user;
  let uid;
  export default {
    props: ['show'],
    components: {

    },
    data() {
      return {
        is_choose: false,
        loading: true,
        frist_class: null, //一级分类
        second_class: null, //二级分类
        selected_id: null, //选择的id
        class_text: null, //分类的输入内容
        input_class_text: null, //已经输入的内容
        middle: false,
        popup_editshow: false,
        Popup_title: "一级分类",
      }
    },
    mounted() {
      that = this;
      uid = JSON.parse(localStorage.getItem('user')).objectId;
      user = JSON.parse(localStorage.getItem('user'));
      that.is_choose = true;
      that.get_category();
    },

    methods: {

      //选择分类的情况下选择分类
      select_this(item, type) {
        item.type = type
        this.$emit('confrim', item)
      },

      cancle() {
        this.$emit('cancle', false)
      },

      //得到一级分类
      get_category() {
        const query = Bmob.Query("class_user");
        query.equalTo("parent", "==", uid);
        query.find().then(res => {
          console.log(res)
          that.frist_class = res;

          if (res.length == 0) {
            that.loading = false;
          } else {
            that.get_second_category(res[0].objectId)
          }


        });
      },

      //得到二级分类
      get_second_category(id) {
        that.selected_id = id;
        const query = Bmob.Query('class_user')
        query.field('second', id)
        query.relation('second_class').then(res => {
          console.log(res);
          that.loading = false;
          that.second_class = res.results;
        })
      },

      //点击编辑图标
      showoption(id, type, value) {
        console.log(id, type, value)
        uni.showActionSheet({
          itemList: ['删除', '编辑'],
          success: function(res) {
            console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
            if (res.tapIndex == 0) {
              if (type === 1) {
                that.delete(id, "class_user")
              } else {
                that.delete(id, "second_class")
              }

            } else {
              that.input_class_text = value
              that.selected_id = id
              if (type === 1) {
                that.Popup_title = "一级分类"
                that.popup_editshow = true;
              } else {
                that.Popup_title = "二级分类"
                that.popup_editshow = true;
              }
            }
          },
          fail: function(res) {
            console.log(res.errMsg);
          }
        });
      },

      //点击一级分类事件
      add_fristclass() {
        this.Popup_title = "一级分类";
        that.middle = true;
      },

      //点击一级分类事件
      add_secondclass() {
        this.Popup_title = "二级分类";
        that.middle = true;
      },

      hidePopup() {
        this.middle = false;
        this.popup_editshow = false;
      },

      //编辑分类内容
      edit() {
        let dbname;
        if (that.Popup_title === "一级分类") {
          dbname = "class_user";
        } else {
          dbname = "second_class";
        }
        console.log(that.selected_id, dbname)
        const query = Bmob.Query(dbname);
        query.set('id', that.selected_id); //需要修改的objectId
        query.set('class_text', that.input_class_text);
        query.save().then(res => {
          console.log(res);
          uni.showToast({
            title: '修改成功'
          });
          that.get_category();

          that.middle = false;
          that.popup_editshow = false;
        }).catch(err => {
          console.log(err)
        })
      },

      //删除分类
      delete(id, dbname) {
        uni.showModal({
          title: '提示',
          content: '是否删除此分类',
          success(res) {
            if (res.confirm) {
              const query = Bmob.Query(dbname);
              query.destroy(id).then(res => {
                console.log(res)
                uni.showToast({
                  title: '删除成功',
                  duration: 1000
                });
                that.get_category();
              }).catch(err => {
                console.log(err)
              })
            }
          }
        })
      },

      //popup确定点击
      confrim() {
        const class_text = that.class_text;

        if (this.Popup_title === "一级分类") {
          if (class_text == null) {
            uni.showToast({
              icon: "none",
              title: '请输入类别',
            })
          } else {
            const pointer = Bmob.Pointer('_User')
            const poiID = pointer.set(uid);

            const query = Bmob.Query('class_user');
            query.set("parent", poiID)
            query.set("class_text", class_text);
            query.save().then(res => {
              that.get_category();
              this.middle = false;
              this.class_text = null;
            }).catch(err => {
              console.log(err)
            })
          }
        } else {
          //console.log(that.selected_id)
          const selected_id = that.selected_id

          const pointer = Bmob.Pointer('class_user')
          const poiID = pointer.set(selected_id)

          const query = Bmob.Query('second_class');
          query.set("class_text", class_text)
          query.set("parent", poiID)
          query.save().then(res => {
            //console.log(res)
            const relation = Bmob.Relation('class_user') // 需要关联的表
            const relID = relation.add([res.objectId]) //关联表中需要关联的objectId, 返回一个Relation对象, add方法接受string和array的类型参数
            const query = Bmob.Query('class_user')
            query.get(selected_id).then(res => {
              res.set('second', relID); // 将Relation对象保存到two字段中，即实现了一对多的关联
              res.save()

              that.get_second_category(selected_id)
              this.middle = false;
              this.class_text = null;
            })
          }).catch(err => {
            console.log(err)
          })

        }

      },

    }
  }
</script>

<style>
  .page {
    background: #fff;
  }

  .content {
    display: flex;
  }

  .left_content {
    width: 50%;
    border-right: 0.0625rem solid#ddd;
  }

  .right_content {
    width: 50%;
  }

  .class_item {
    padding-left: 0.3125rem;
    padding-right: 0.3125rem;
    line-height: 2.5rem;
    border-bottom: 0.0625rem solid#ddd;
    font-size: 0.8125rem;
    color: #3D3D3D;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .selectd_item {
    background: #df9464 !important;
    color: #fff !important;
  }

  .class_item_bottom {
    padding-left: 0.3125rem;
    line-height: 2.5rem;
    border-bottom: 0.0625rem solid#ddd;
    font-size: 0.625rem;
    color: #3D3D3D;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .class_texxt_div {
    padding: 0.3125rem 0;
    width: calc(100% - 0.9375rem);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }

  .popup {
    text-align: center;
    color: #3D3D3D;
  }

  .popup_content {
    width: 15.625rem;
  }

  .popup_title {
    margin-bottom: 1.25rem;
    font-size: 1rem;
    font-weight: bold;
  }

  .popup_input {
    border: 0.0625rem solid#ddd;
    margin-bottom: 1.25rem;
    line-height: 2.8125rem;
    height: 2.8125rem;
    border-radius: 0.25rem;
    font-size: 0.8125rem;
  }

  .popup_button {
    background: #426ab3;
    color: #fff;
  }
</style>
