<template>
  <div>
    <Modal title="添加产品" :closable="false" width="80%" :value="true" @on-ok="handleSubmit(formValidate)" @on-cancel="cancle"
      style="max-height: 60%;overflow-y: scroll;">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <Tabs value="name1">
          <TabPane label="基本信息" name="name1">
            <div style="text-align: left;">
              <div style="font-size: 16px;color: #333333;font-weight: bold;">产品图</div>
              <div class="control-form" style="margin-left: 1.25rem;">
                <ul class="upload-imgs">
                  <li v-if="imgLen>=1 ? false : true">
                    <input type="file" class="upload" @change="addImg" ref="inputer" multiple accept="image/png,image/jpeg,image/gif,image/jpg"
                      v-show="false" />
                    <a class="add" @click="upload"><i class="iconfont icon-plus"></i>
                      <p>点击上传</p>
                    </a>
                  </li>
                  <li v-for='(value, key) in imgs' :key="key">
                    <p class="img"><img :src="formValidate.goodsIcon" style="width: 100%;"><a class="close" @click="delImg(key)">×</a></p>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <div style="padding: 0.625rem 0;">
                <div class="display_flex_bet">
                  <FormItem label="产品名字" prop="goodsName" style="width: 25%;">
                    <Input v-model="formValidate.goodsName" placeholder="请输入产品名字"></Input>
                  </FormItem>

                  <div class="display_flex" style="width: 25%;">
                    <div style="color: #f30;margin-bottom: 24px;margin-right: -10px;margin-left: 10px;">*</div>
                    <FormItem label="产品类别">
                      <Input v-model="formValidate.goodsClass.class_text" placeholder="请选择产品分类" @on-focus="chooseClassClick = true"></Input>
                    </FormItem>
                  </div>

                  <FormItem label="成本价" prop="costPrice" style="width: 25%;">
                    <Input v-model="formValidate.costPrice" placeholder="请输入成本价"></Input>
                  </FormItem>
                  <FormItem label="零售价格" prop="retailPrice" style="width: 25%;">
                    <Input v-model="formValidate.retailPrice" placeholder="请输入零售价格"></Input>
                  </FormItem>
                </div>

                <div class="display_flex">
                  <FormItem label="包装单位" prop="packingUnit" style="width: 25%;">
                    <Input v-model="formValidate.packingUnit" placeholder="请输入包装单位"></Input>
                  </FormItem>

                  <FormItem label="包装含量" prop="packageContent" style="width: 25%;">
                    <Input v-model="formValidate.packageContent" placeholder="请输入包装含量"></Input>
                  </FormItem>

                  <FormItem label="产品条码" prop="productCode" style="width: 25%;">
                    <Input v-model="formValidate.productCode" placeholder="请输入与产品条码"></Input>
                  </FormItem>
                </div>

                <div class="display_flex">
                  <FormItem label="预警库存" style="width: 25%;">
                    <Input v-model="formValidate.warning_num" placeholder="预警库存" type="number"></Input>
                  </FormItem>
                  <FormItem label="最大库存" style="width: 25%;">
                    <Input v-model="formValidate.max_num" placeholder="最大库存" type="number"></Input>
                  </FormItem>
                </div>

              </div>

            </div>
          </TabPane>
          <TabPane label="库存信息" name="name2" v-if="type =='add'">
            <div style="max-height: 37.5rem;overflow-y: scroll;height: 100%;">
              <div style="padding: 0.625rem 0;">
                <FormItem label="多规格" style="width: 25%;text-align: left;" v-if='type !="edit"'>
                  <el-switch v-model="formValidate.productMoreG"></el-switch>
                </FormItem>
                <div class="display_flex_bet" v-for="(item,index) in formValidate.stockReserve" style="margin-right: 0.625rem;">

                  <div class="display_flex" style="width: 80%;">
                    <FormItem label="存放仓库" style="width: 25%;">
                      <!--<Select v-model="item.stocks" placeholder="请选择存放仓库" style="width: 11.625rem;">
                        <Option v-for="(value,index) in all_stocks" :value="value.objectId" :key="index">{{value.stock_name}}</Option>
                      </Select>-->
                      <Input v-model="item.stocks.stock_name" placeholder="请选择存放仓库" @on-focus="StockClick(index)"></Input>
                    </FormItem>
                    <FormItem label="库存" style="width: 25%;">
                      <Input v-model="item.reserve" placeholder="对应的库存" type="number" v-if="formValidate.productMoreG"
                        @on-focus="showModal(index)"></Input>
                      <Input v-model="item.reserve" placeholder="对应的库存" type="number" v-else></Input>
                    </FormItem>
                  </div>


                  <FormItem>
                    <div style="display: flex;">
                      <Button type="success" shape="circle" icon="md-add" @click="addReserve"></Button>
                      <Button type="error" shape="circle" icon="md-close" @click="reduceReserve(index)" style="margin:0 0.625rem;"></Button>
                    </div>
                  </FormItem>
                </div>
              </div>

            </div>

          </TabPane>
          <TabPane label="更多信息" name="name3">
            <div>

              <div style="padding: 0.625rem 0;">
                <div class="display_flex_bet">
                  <FormItem label="生产日期">
                    <FormItem prop="producttime">
                      <DatePicker type="date" placeholder="请选择生产日期" v-model="formValidate.producttime" format="yyyy-MM-dd HH:mm:ss"></DatePicker>
                    </FormItem>
                  </FormItem>
                  <FormItem label="生产厂家" prop="producer">
                    <Input v-model="formValidate.producer" placeholder="请输入生产厂家"></Input>
                  </FormItem>
                  <FormItem label="货架位置" prop="position">
                    <Input v-model="formValidate.position" placeholder="请输入货架位置"></Input>
                  </FormItem>
                  <FormItem label="货号" prop="regNumber">
                    <Input v-model="formValidate.regNumber" placeholder="货号"></Input>
                  </FormItem>
                </div>

                <div>
                  <FormItem label="产品简介" prop="product_info">
                    <Input v-model="formValidate.product_info" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                      placeholder="请输入产品简介"></Input>
                  </FormItem>

                </div>
              </div>

            </div>
          </TabPane>
        </Tabs>
      </Form>

      <!--规格设置-->
      <Modal title="多规格设置" v-model="productMoreG.show" :styles="{top: '4%'}" width="70%" @on-ok="changeReserve"
        @on-cancel="changeReserve">
        <Form :label-width="80">
          <div v-for="(item,index) in formValidate.stockReserve[stockIndex].models" :key="index">

            <div style="padding:0.625rem 0;font-size: 1rem;font-weight: bold;">规格{{index+1}}</div>
            <div class="display_flex_bet">
              <FormItem label="颜色" :prop="item.custom1.value">
                <Input v-model="item.custom1.value" placeholder="请输入颜色"></Input>
              </FormItem>
              <FormItem label="尺寸" :prop="item.custom2.value">
                <Input v-model="item.custom2.value" placeholder="请输入尺寸"></Input>
              </FormItem>
              <FormItem label="自定义1" :prop="item.custom3.value">
                <Input v-model="item.custom3.value" placeholder="请输入自定义规格1的值"></Input>
              </FormItem>
              <FormItem label="自定义2" :prop="item.custom4.value">
                <Input v-model="item.custom4.value" placeholder="请输入自定义规格2的值"></Input>
              </FormItem>

              <FormItem label="库存" :prop="item.custom4.value">
                <Input v-model="item.reserve" placeholder="请输入库存数量" type="number"></Input>
              </FormItem>

              <Button type="error" shape="circle" icon="md-close" v-if="index >=1" style="margin-bottom: 24px;margin-left: 10px;"
                @click="reduceModel(index)"></Button>


            </div>

          </div>
        </Form>

        <Button style="height:2.5rem;color: #42b394;font-weight: bold;text-align: center;background: #CCCCCC;" long
          @click="addModel">
          <Icon type="md-add" />
          <span>增加规格</span>
        </Button>
      </Modal>

      <classSelect @cancle="chooseClassClick = false" @confrim="selectClass" v-if="chooseClassClick"></classSelect>
      <stocksS @cancle="chooseStockClick = false" @confrim="selectStcok" v-if="chooseStockClick"></stocksS>
    </Modal>
  </div>


</template>
<script>
  let that;
  import goods from '@/serve/goods.js';

  import classSelect from '@/components/component/classSelect.vue'; //产品分类组件
  import stocksS from '@/components/component/stocksS.vue'; //产品详情组件

  export default {
    props: ['show', 'goodItem'],
    name: 'addgood',
    components: {
      classSelect,
      stocksS
    },
    data() {
      return {
        chooseClassClick: false, //控制类别选择
        chooseStockClick: false,
        chooseStockIndex: 0,
        all_fristclass: [], //所有的一级分类
        all_secondclass: [], //所有的二级分类
        all_stocks: [], //所有的仓库
        formData: new FormData(),
        imgs: [],
        imgLen: 0,
        productMoreG: {
          show: false
        },
        stockIndex: 0,
        formValidate: {
          goodsName: '', //产品名字
          productCode: '', //条形码
          costPrice: "0", //进货价格
          retailPrice: '0', //零售价
          position: '', //货架位置
          goodsClass: {
            class_text: ""
          }, //一级分类
          second_class: '', //二级分类
          reserve: '', //库存数量
          packingUnit: '', //包装单位
          packageContent: '', //包装含量
          goodsIcon: '', //产品图片
          product_info: '', //产品简介
          regNumber: '',
          producer: '', //生产厂家
          productMoreG: false, //是否多规格
          warning_num: 0, //预警库存
          max_num: 0, //最大库存
          stockReserve: [{
            models: [{
              id: 0,
              custom1: {
                "name": "颜色",
                value: ""
              },
              custom2: {
                "name": "尺寸",
                value: ""
              },
              custom3: {
                "name": "",
                value: ""
              },
              custom4: {
                "name": "",
                value: ""
              },
              reserve: 0,
            }],
            stocks: "", // 存放仓库
            reserve: '', //库存数量
          }],
        },
        ruleValidate: {
          goodsName: [{
            required: true,
            message: '产品名字必填',
            trigger: 'blur'
          }],
        },
        type: 'add', //操作类型
      }
    },
    watch: {
      goodItem(n, o) {
        console.log(n, o, that.show)
        if (n && n != o) {
          let editGood = n


        } else {
          console.log("add")
        }
      }
    },

    mounted() {
      that = this

      // that.type = that.getParameterByName("type")

      if (that.goodItem) {
        that.type = "edit"
        let editGood = that.goodItem

        that.formValidate.goodsName = editGood.goodsName
        that.formValidate.productCode = editGood.productCode.split("-")[0]
        that.formValidate.costPrice = editGood.costPrice
        that.formValidate.retailPrice = editGood.retailPrice
        that.formValidate.position = editGood.position
        that.formValidate.reserve = editGood.reserve
        that.formValidate.packingUnit = editGood.packingUnit
        that.formValidate.packageContent = editGood.packageContent
        that.formValidate.goodsIcon = editGood.goodsIcon
        that.formValidate.product_info = editGood.product_info
        that.formValidate.regNumber = editGood.regNumber
        that.formValidate.producer = editGood.producer
        that.formValidate.warning_num = editGood.warning_num //预警数量
        that.formValidate.max_num = editGood.max_num //最大库存数量
        that.formValidate.objectId = editGood.objectId

        if (editGood.second_class && editGood.second_class.objectId) {
          that.formValidate.goodsClass = editGood.second_class
          that.formValidate.goodsClass.objectId = editGood.second_class.parent.objectId
          that.formValidate.second_class = editGood.second_class.objectId
        } else if (editGood.goodsClass) {
          that.formValidate.goodsClass = editGood.goodsClass
        }

        if (editGood.goodsIcon != "") {
          that.imgLen = 1
          that.imgs.push(editGood.goodsIcon)
          that.formValidate.goodsIcon = editGood.goodsIcon
        }

        //得到库存详情
        const query = Bmob.Query('Goods');
        //query.equalTo("userId", "==", uid);
        query.equalTo("order", "==", 1);
        query.equalTo("header", "==", editGood.objectId);
        query.include("stocks", "header");
        query.find().then(res => {
          that.formValidate.stockReserve = res
        });

      } else {
        //得到仓库列表
        goods.getstock_list().then(res => {
          console.log("仓库列表", res)
          that.all_stocks = res
          that.formValidate.stockReserve[that.chooseStockIndex].stocks = res[0]
          //that.all_fristclass = res
        });
      }
    },

    methods: {
      selectClass(value) {
        if (value.type == 1) {
          that.formValidate.goodsClass = value
        } else if (value.type == 2) {
          that.formValidate.goodsClass = value
          that.formValidate.goodsClass.objectId = value.parent.objectId
          that.formValidate.second_class = value.objectId
        }

        that.chooseClassClick = false
      },

      StockClick(index) {
        that.chooseStockClick = true
        that.chooseStockIndex = index
      },

      selectStcok(value) {
        console.log("选择的仓库", value)
        that.formValidate.stockReserve[that.chooseStockIndex].stocks = value
        that.chooseStockClick = false
      },

      cancle() {
        this.$emit('cancle', false)
      },

      getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
          results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
      },

      showModal(index) {
        that.productMoreG.show = true;
        that.stockIndex = index
      },

      //多规格弹窗关闭或确定时的操作
      changeReserve() {
        console.log(that.stockIndex)
        let thisStockReserve = 0
        let totalReserve = 0
        for (let item of that.formValidate.stockReserve[that.stockIndex].models) {
          thisStockReserve += Number(item.reserve)
        }
        that.formValidate.stockReserve[that.stockIndex].reserve = thisStockReserve

        for (let item of that.formValidate.stockReserve) {
          totalReserve += Number(item.reserve)
        }

        that.formValidate.reserve = totalReserve
      },

      //增加规格数量
      addModel() {
        let model = {
          custom1: {
            "name": "颜色",
            value: ""
          },
          custom2: {
            "name": "尺寸",
            value: ""
          },
          custom3: {
            "name": "",
            value: ""
          },
          custom4: {
            "name": "",
            value: ""
          },
          reserve: 0,
        }
        model.id = that.formValidate.stockReserve[that.stockIndex].models.length
        that.formValidate.stockReserve[that.stockIndex].models.push(model)
      },

      //添加一行记录
      addReserve() {
        let item = {
          stocks: "", // 存放仓库
          warning_num: '', //预警库存
          max_num: '', //最大库存
          reserve: '', //库存数量
          models: [{
            id: 0,
            custom1: {
              "name": "颜色",
              value: ""
            },
            custom2: {
              "name": "尺寸",
              value: ""
            },
            custom3: {
              "name": "",
              value: ""
            },
            custom4: {
              "name": "",
              value: ""
            },
            reserve: 0,
          }],
        }
        that.formValidate.stockReserve.push(item)
      },

      reduceReserve(index) {
        if (that.formValidate.stockReserve.length == 1) {
          this.$Message['warning']({
            background: 'warning',
            content: '至少保留一个'
          });

          return
        }
        that.formValidate.stockReserve.splice(index, 1)
      },

      reduceModel(index) {
        that.formValidate.stockReserve[that.stockIndex].models.splice(index, 1)
      },

      //上传产品
      handleSubmit(formValidate) {
        if (formValidate.goodsName && formValidate.goodsClass.class_text) {
          for (let item of formValidate.stockReserve) {
            formValidate.reserve += Number(item.reserve)
          }

          goods.upload_good(formValidate).then(res => {
            if (res[0]) {
              this.$Message.success('上传成功');
              this.$emit('confrim', true)
            } else {
              this.$Message.error('已存在产品');
              this.$emit('confrim', false)
            }
          })
        } else if (formValidate.goodsName == "") {
          this.$emit('confrim', false)
          this.$Message.error('请填写产品名字');

        } else if (formValidate.goodsClass.class_text == "") {
          this.$emit('confrim', false)
          this.$Message.error('请选择产品类别');
        }

      },

      upload() {
        document.querySelector('.upload').click();
      },
      addImg(event) {
        let inputDOM = this.$refs.inputer;
        // 通过DOM取文件数据
        this.fil = inputDOM.files;
        if (this.fil) {
          let file
          for (let item of this.fil) {
            file = Bmob.File(item.name, item);
          }
          file.save().then(res => {
            console.log(res[0].url);
            that.imgLen = 1
            that.imgs.push(res[0].url)
            that.formValidate.goodsIcon = res[0].url
          })
        }

        let oldLen = this.imgLen;
        let len = this.fil.length + oldLen;
        if (len > 1) {
          return false;
        }
        for (let i = 0; i < this.fil.length; i++) {
          let size = Math.floor(this.fil[i].size / 1024);
          if (size > 5 * 1024 * 1024) {
            alert('请选择5M以内的图片！');
            return false
          }
          this.imgLen++;
          this.$set(this.imgs, this.fil[i].name + '?' + new Date().getTime() + i, this.fil[i]);
        }
      },

      getObjectURL(file) {
        var url = null;
        if (window.createObjectURL != undefined) { // basic
          url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
          url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
          url = window.webkitURL.createObjectURL(file);
        }


        return url;
      },

      delImg(key) {
        this.$delete(this.imgs, key);
        this.imgLen--;
      },

      handleReset(name) {
        this.$refs[name].resetFields();
      }
    }
  }
</script>

<style scoped>
  .form-group {
    margin-left: 20px;
  }

  .upload-imgs {
    margin: 0.625rem 0;
    overflow: hidden;
    font-size: 0;
  }

  .upload-imgs li {
    position: relative;
    width: 118px;
    height: 118px;
    font-size: 14px;
    display: inline-block;
    padding: 10px;
    border: 2px dashed #ccc;
    text-align: center;
    vertical-align: middle;
  }

  .upload-imgs li:hover {
    border-color: $them-color;
  }

  .upload-imgs .add {
    display: block;
    background-color: #ccc;
    color: #ffffff;
    height: 94px;
    padding: 8px 0;
  }

  .upload-imgs .add .iconfont {
    padding: 10px 0;
    font-size: 40px;
  }

  .upload-imgs li:hover .add {
    background-color: $them-color;
  }

  .upload-imgs li .upload {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 118px;
    height: 118px;
  }

  .upload-imgs .img {
    position: relative;
    width: 94px;
    height: 94px;
    line-height: 94px;
  }

  .upload-imgs .img img {
    vertical-align: middle;
  }

  .upload-imgs .img .close {
    display: none;
  }

  .upload-imgs li:hover .img .close {
    display: block;
    position: absolute;
    right: -6px;
    top: -10px;
    line-height: 1;
    font-size: 22px;
    color: #aaa;
  }
</style>
