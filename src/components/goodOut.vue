<template>
  <div>
    <div style="margin-bottom: 10px;">
      <Breadcrumb separator="<b style='color: #999;'>/</b>">
        <BreadcrumbItem to="/">首页</BreadcrumbItem>
        <BreadcrumbItem to="/home/goods">销售或出库</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div style="background: #FFFFFF;padding-bottom: 1.25rem;">
      <div>
        <Table :columns="columns" :data="selectGoods" ref="table" border :height="screenHeight - 440" size="small">
          <template slot-scope="{ row, index }" slot="goodsName">
            <div v-if="row.goodsName">{{row.goodsName}}</div>
            <Input placeholder="点击选择产品" @on-focus="goodsShow = true;selectIndex = index" v-else>
            <Icon type="ios-arrow-down" slot="suffix" />
            </Input>
          </template>
          <template slot-scope="{ row, index }" slot="reserve">
            <div v-if="row.selected_model">
              <div v-for="(model,key) in row.selected_model" :key="key" class="display_flex" style="margin:0.25rem 0.375rem;">
                <div>{{model.custom1.value + model.custom2.value + model.custom3.value + model.custom4.value}}：</div>
                <InputNumber placeholder="请输入数量" size="small" @on-focus="selectIndex = index" v-if="row.goodsName"
                  :value="model.num" :min="0" @on-change="handleModelNumChange($event, index,key,model)"></InputNumber>
              </div>
            </div>
            <div v-else>
              <InputNumber placeholder="请输入数量" size="small" @on-focus="selectIndex = index" v-if="row.goodsName" :min="0" @on-change="modify_num($event, index)"></InputNumber>
            </div>
          </template>
          <template slot-scope="{ row, index }" slot="modify_retailPrice">
            <InputNumber placeholder="请输入实际成本价" size="small" @on-focus="selectIndex = index" v-if="row.goodsName" :min="0"
              :value="Number(row.modify_retailPrice)" @on-change="modify_price($event, index)"></InputNumber>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <ButtonGroup>
              <Button icon="md-add" @click="addSelectGoods"></Button>
              <Button icon="md-close" @click="reduceSelectGoods(index)"></Button>
            </ButtonGroup>
          </template>
        </Table>
      </div>

      <div style="padding: 0 0.625rem;">
        <Form :model="formItem" :label-width="100" style="margin-top: 1.875rem;">
          <div class="display_flex">

            <FormItem label="门店" style="width: 15.625rem;">
              <Input placeholder="选择门店" :readonly="true" @on-focus="shopShow = true" :value="formItem.shop.name">
              <Icon type="ios-arrow-down" slot="suffix" />
              </Input>
            </FormItem>

            <FormItem label="客户" style="margin-left: 1.875rem;">
              <Input placeholder="选择客户" :readonly="true" @on-focus="customShow = true" :value="formItem.custom.custom_name">
              <Icon type="ios-arrow-down" slot="suffix" />
              </Input>
            </FormItem>

            <FormItem label="发货方式" style="margin-left: 1.875rem;width: 15.625rem;">
              <Select v-model="formItem.outType">
                <Option v-for="item in pickerTypes" :value="item.desc" :key="item.type">{{ item.desc }}</Option>
              </Select>
            </FormItem>

            <FormItem label="快递单号" style="margin-left: 1.875rem;" v-if="formItem.outType=='物流'||formItem.outType=='快递'">
              <Input placeholder="快递单号" v-model="formItem.expressNum"></Input>
            </FormItem>
          </div>

          <div class="display_flex">
            <FormItem label="本次付款" style="width: 15.625rem;">
              <Input placeholder="请输入本次实际付款金额" v-model="formItem.real_money"></Input>
            </FormItem>
            <FormItem label="备注" style="width: 25rem;margin-left: 1.875rem;">
              <Input v-model="formItem.beizhu" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
            </FormItem>
          </div>

          <FormItem style="text-align: center;">
            <Button type="primary" size="large" style="margin-right: 3.125rem;" @click="handleSubmit(1)" :disabled="button_disabled">销售</Button>
            <Button type="success" size="large" @click="handleSubmit(2)" :disabled="button_disabled">出库</Button>
          </FormItem>
        </Form>

      </div>

    </div>

    <!--选择产品模板-->
    <goodsS :show="goodsShow" @cancle="goodsShow = false" @confrimGoods="confrimSelectGoods" type="enter"></goodsS>
    <!--生产商列表-->
    <customS @cancle="customShow = false" :show="customShow" @select="selectProducter"></customS>
    <!--门店列表-->
    <shopS @cancle="shopShow = false" :show="shopShow" @select="selectShop"></shopS>

    <!--仓库列表-->
    <!--<stocksS @cancle="stockShow = false" :show="stockShow" @select="selectStock"></stocksS>-->
  </div>
</template>
<script>
  import goodsS from '@/components/component/goodsS.vue';
  import customS from '@/components/component/customS.vue';
  import shopS from '@/components/component/shopS.vue';
  import stocksS from '@/components/component/stocksS.vue';

  import send_temp from '@/serve/send_temp.js';
  import common from '@/serve/common.js';
  import goods from '@/serve/goods.js';

  let that;
  export default {
    components: {
      goodsS,
      customS,
      stocksS,
      shopS
    },
    data() {
      return {
        button_disabled: false,
        stockShow: false,
        shopShow: false,
        customShow: false,
        goodsShow: false,
        formItem: {
          shop: '',
          custom: '',
          stock: '',
          outType: '', //发货方式
          expressNum: '', //快递单号
          all_money: 0,
          real_money: 0,
          real_num: 0, //数量
          beizhu: '', //备注
          Images: []
        },
        pickerTypes: [{
            desc: "自提",
            type: 1
          },
          {
            desc: "快递",
            type: 2
          },
          {
            desc: "物流",
            type: 3
          },
          {
            desc: "送货上门",
            type: 4
          },
        ],
        selectIndex: 0,
        selectGoods: [],
        userid: JSON.parse(localStorage.getItem('bmob')).objectId || '',
        user: JSON.parse(localStorage.getItem('bmob')),
        screenHeight: window.innerHeight,
        loading: true,
        columns: [{
            type: 'index',
            width: 60,
            align: 'center'
          }, {
            width: 200,
            title: '产品名字',
            key: 'goodsName',
            slot: 'goodsName',
            align: 'center',
          },
          {

            align: 'center',
            title: '所属仓库',
            key: 'stocks',
          },
          {

            align: 'center',
            title: '所属分类',
            key: 'class',
          },
          {
            width: 200,
            align: 'center',
            title: '库存',
            key: 'reserve',
            slot: 'reserve',
          },
          {
            width: 100,
            align: 'center',
            title: '成本价',
            key: 'costPrice',
          },
          {
            width: 200,
            align: 'center',
            title: '实际价格',
            key: 'modify_retailPrice',
            slot: 'modify_retailPrice',
          },
          {
            align: 'center',
            title: '规格',
            key: 'packageContent',
          },
          {
            align: 'center',
            title: '单位',
            key: 'packingUnit',
          },
          {
            width: 120,
            title: '操作',
            slot: 'action',
            align: 'center'
          }
        ],

      };
    },

    mounted() {
      that = this;
      for (let i = 0; i <= 8; i++) {
        let good = {}
        good.goodsName = ''
        good.stocks = ''
        good.class = ''
        good.reserve = ''
        good.costPrice = ''
        good.modify_retailPrice = ''
        good.retailPrice = ''
        good.packageContent = ''
        good.packingUnit = ''
        good.createdAt = ''
        that.selectGoods.push(good)
      }
    },

    methods: {
      //提交表单
      handleSubmit(type) {
        that.$Loading.start();
        let selectGoods = []
        let uid = localStorage.getItem('uid')
        let thisUser = JSON.parse(localStorage.getItem('bmob'))
        for (let item of that.selectGoods) {
          if (item.goodsName) {
            selectGoods.push(item)
          }
        }

        if (selectGoods.length == 0) {
          that.$Message["error"]({
            background: true,
            content: '没有选择入库产品'
          });

          return
        }
        console.log(uid,type, that.formItem, selectGoods)

        let identity =localStorage.getItem('identity') // 身份识别标志

        //console.log(e)
        that.button_disabled = true;
        let extraType = type // 判断是采购还是入库  2是入库  1是采购

        const pointer1 = Bmob.Pointer('shops');
        let shopId = pointer1.set(that.formItem.shop ? that.formItem.shop.objectId : '');

        let billsObj = new Array();
        let detailObj = [];
        for (let i = 0; i < selectGoods.length; i++) {
          let num = Number(selectGoods[i].reserve) + selectGoods[i].num;

          //单据
          let detailBills = {}
          let tempBills = Bmob.Query('Bills');

          let pointer = Bmob.Pointer('_User')
          let user = pointer.set(uid)
          let pointer1 = Bmob.Pointer('Goods')
          let tempGoods_id = pointer1.set(selectGoods[i].objectId);

          let masterId = localStorage.getItem('masterId');
          let pointer2 = Bmob.Pointer('_User')
          let poiID2 = pointer2.set(masterId);

          tempBills.set('goodsName', selectGoods[i].goodsName);
          tempBills.set('retailPrice', (selectGoods[i].modify_retailPrice).toString());
          tempBills.set('num', Number(selectGoods[i].num));
          tempBills.set('total_money', selectGoods[i].total_money);
          tempBills.set('really_total_money', selectGoods[i].really_total_money);
          tempBills.set('goodsId', tempGoods_id);
          tempBills.set('userId', user);
          tempBills.set("opreater", poiID2);
          tempBills.set('type', 1);
          tempBills.set('extra_type', extraType);
          (that.formItem.shop) ? tempBills.set("shop", shopId): '';
          if (identity == 1) {
            tempBills.set("status", true); // 操作单详情
          } else if (identity == 2) {
            tempBills.set("status", (extraType == 2) ? true : false); // 操作单详情
          }

          let goodsId = {}
          if (selectGoods.stocks && selectGoods.stocks.objectId) {
            const pointer = Bmob.Pointer('stocks');
            let stockId = pointer.set(selectGoods.stocks.objectId);
            tempBills.set("stock", stockId);
            detailBills.stock = selectGoods.stocks.stock_name
          }
          detailBills.goodsName = selectGoods[i].goodsName
          detailBills.modify_retailPrice = (selectGoods[i].modify_retailPrice).toString()
          detailBills.retailPrice = selectGoods[i].retailPrice
          detailBills.total_money = selectGoods[i].total_money
          goodsId.costPrice = selectGoods[i].costPrice
          goodsId.retailPrice = selectGoods[i].retailPrice
          goodsId.objectId = selectGoods[i].objectId
          goodsId.reserve = num
          if (selectGoods[i].selected_model) {
            goodsId.selected_model = selectGoods[i].selected_model
            goodsId.models = selectGoods[i].models
          }
          detailBills.goodsId = goodsId
          detailBills.num = selectGoods[i].num
          detailBills.type = 1

          billsObj.push(tempBills)
          detailObj.push(detailBills)

        }
        //插入单据
        Bmob.Query('Bills').saveAll(billsObj).then(function(res) {
            //console.log("批量新增单据成功", res);
            let bills = []
            for (let i = 0; i < res.length; i++) {
              bills.push(res[i].success.objectId)
            }


            let pointer = Bmob.Pointer('_User')
            let poiID = pointer.set(uid);

            let masterId =localStorage.getItem('masterId');
            let pointer1 = Bmob.Pointer('_User')
            let poiID1 = pointer1.set(masterId);

            let query = Bmob.Query('order_opreations');
            //query.set("relations", relID);
            query.set("beizhu", that.formItem.beizhu);
            query.set("detail", detailObj);
            query.set("real_num", that.formItem.real_num);
            query.set("type", 1);
            query.set("extra_type", extraType);
            query.set("bills", bills);
            query.set("opreater", poiID1);
            query.set("master", poiID);
            query.set('goodsName', selectGoods[0].goodsName);
            query.set('real_money', Number(that.formItem.real_money));
            query.set('debt', that.formItem.all_money - that.formItem.real_money);

            if (that.formItem.custom) {
              let custom = Bmob.Pointer('producers');
              let producerID = producer.set(that.formItem.producer.objectId);
              query.set("producer", producerID);

              //如果客户有欠款
              if ((that.formItem.all_money - that.formItem.real_money) > 0) {
                let query = Bmob.Query('producers');
                query.get(that.producer.objectId).then(res => {
                  var debt = (res.debt == null) ? 0 : res.debt;
                  debt = debt + (that.formItem.all_money - that.formItem.real_money);
                  //console.log(debt);
                  let query = Bmob.Query('producers');
                  query.get(that.producer.objectId).then(res => {
                    res.set('debt', debt)
                    res.save()
                  })
                })
              }
            }

            if (that.formItem.outType) {
              query.set("typeDesc", that.formItem.outType);
              query.set("expressNum", that.formItem.expressNum);
            }
            query.set("all_money", that.formItem.all_money);
            query.set("Images", that.formItem.Images);
            if (identity == 1) {
              query.set("status", true); // 操作单详情
            } else if (identity == 2) {
              query.set("status", (extraType == 2) ? true : false); // 操作单详情
            }
            query.save().then(res => {
              let operationId = res.objectId
              //console.log("添加操作历史记录成功", res);
              if (extraType == 2) { // 执行入库操作
                common.enterAddGoodNum(selectGoods).then(result => { //添加产品数量
                  setTimeout(() => {

                    common.log(thisUser.nickName + "入库了'" + selectGoods[0].goodsName +
                      "'等" +
                      selectGoods
                      .length + "商品", 1, operationId);

                    let params = {
                      "frist": thisUser.nickName + "入库了'" + selectGoods[0]
                        .goodsName + "'等" +
                        selectGoods
                        .length + "商品",
                      "data1": res.createdAt,
                      "data2": "未填写",
                      "remark": that.formItem.beizhu ? that.formItem.beizhu : "未填写",
                      "url": "https://www.jimuzhou.com/h5/pages/report/EnteringHistory/detail/detail?id=" +
                        operationId,
                    };
                    send_temp.send_in(params);

                    //自动打印
                    if (JSON.parse(localStorage.getItem('setting')).auto_print) {
                      print.autoPrint(operationId);
                    }
                  }, 500)

                  that.button_disabled = false;
                  that.$Loading.finish();
                  that.$Message.success('入库成功');
                })
              } else if (extraType == 1) { // 执行采购操作

                //common.enterAddGoodNum(selectGoods) //添加产品数量
                if (identity == 1) {
                  common.enterAddGoodNum(selectGoods).then(result => { //添加产品数量
                    setTimeout(() => {

                      common.log(thisUser.nickName + "销售了'" + selectGoods[0]
                        .goodsName + "'等" +
                        selectGoods
                        .length + "商品", 1, operationId);

                      //自动打印
                      /*if (uni.getStorageSync("setting").auto_print) {
                      	print.autoPrint(operationId);
                      }*/

                      that.button_disabled = false;
                      that.$Loading.finish();
                      that.$Message.success('采购成功');
                    }, 500)

                  })
                } else {
                  setTimeout(() => {
                    common.log(thisUser.nickName + "采购了'" + selectGoods[0].goodsName +
                      "'等" + that
                      .products
                      .length + "商品", 1, operationId);

                    let params = {
                      "frist": thisUser.nickName + "采购了'" + selectGoods[0].goodsName +
                        "'等" + that
                        .products
                        .length + "商品",
                      "data1": operationId,
                      "data2": thisUser.nickName,
                      "data3": "未审核",
                      "data4": res.createdAt,
                      "remark": that.formItem.beizhu ? that.formItem.beizhu : "未填写",
                      "url": "https://www.jimuzhou.com/h5/pages/report/EnteringHistory/detail/detail?id=" +
                        operationId,
                    };
                    send_temp.send_in_noconfrim(params);

                    that.button_disabled = false;
                    that.$Loading.finish();
                    that.$Message.success('采购成功');
                  }, 500)
                }
              }
            })

          },
          function(error) {
            // 批量新增异常处理
            console.log("异常处理");
          });

      },

      //选择供应商
      selectProducter(row) {
        that.customShow = false
        that.formItem.custom = row
      },

      selectShop(row) {
        that.shopShow = false
        that.formItem.shop = row
      },

      selectStock(row) {
        that.stockShow = false
        that.formItem.stock = row
      },

      //输入实际的出入库的价格
      modify_price($event, index) {
        //console.log(that.selectGoods[index].modify_retailPrice,$event)
        that.selectGoods[index].modify_retailPrice = Number($event)
        that.selectGoods[index].total_money = that.selectGoods[index].num * Number($event)

        that.formItem.real_money = 0
        that.formItem.all_money = 0
        that.formItem.real_num = 0
        for (let item of that.selectGoods) {
          that.formItem.all_money += Number(item.total_money ? item.total_money : 0)
          that.formItem.real_money += Number(item.total_money ? item.total_money : 0)
        }
      },


      //输入数量时触发
      modify_num($event, index) {
        console.log($event, index)
        that.selectGoods[index].num = Number($event)
        that.selectGoods[index].total_money = Number($event) * Number(that.selectGoods[index].modify_retailPrice)
        that.selectGoods[index].really_total_money = Number($event) * Number(that.selectGoods[index].costPrice)

        that.formItem.real_money = 0
        that.formItem.all_money = 0
        that.formItem.real_num = 0
        for (let item of that.selectGoods) {
          that.formItem.real_num += Number(item.num?item.num:0)
          that.formItem.all_money += Number(item.total_money ? item.total_money : 0)
          that.formItem.real_money += Number(item.really_total_money ? item.really_total_money : 0)
        }
      },

      //多类型产品数量改变
      handleModelNumChange($event, index, key, item) {
        //console.log(that.selectGoods)
        item.num = Number($event)
        that.selectGoods[index].selected_model[key] = item
        let _sumNum = 0;
        for (let model of that.selectGoods[index].selected_model) {
          _sumNum += model.num
        }

        that.selectGoods[index].num = _sumNum
        that.selectGoods[index].total_money = _sumNum * Number(this.selectGoods[index].modify_retailPrice)
        that.selectGoods[index].really_total_money = _sumNum * Number(this.selectGoods[index].costPrice)

        that.formItem.real_money = 0
        that.formItem.all_money = 0
        that.formItem.real_num = 0
        for (let item of that.selectGoods) {
          that.formItem.real_num += Number(item.num?item.num:0)
          that.formItem.all_money += Number(item.total_money ? item.total_money : 0)
          that.formItem.real_money += Number(item.total_money ? item.total_money : 0)
        }
      },

      confrimSelectGoods(goods) {
        that.goodsShow = false
        let count = 0
        for (let item of goods) {
          that.formItem.real_money += Number(item.retailPrice)
          that.selectGoods.splice((that.selectIndex + count), 1, item)
          count += 1
        }
        console.log(goods, that.selectGoods)
      },

      //增加选择的产品数目
      addSelectGoods() {
        let good = {}
        good.goodsName = ''
        good.stocks = ''
        good.class = ''
        good.reserve = ''
        good.costPrice = ''
        good.modify_retailPrice = ''
        good.retailPrice = ''
        good.packageContent = ''
        good.packingUnit = ''
        good.createdAt = ''
        that.selectGoods.push(good)
      },

      reduceSelectGoods(index) {
        console.log(index)
        that.selectGoods.splice(index, 1)
      },
    }
  };
</script>

<style>
  @media only screen {
    .print {
      display: none
    }
  }

  .ivu-scroll-wrapper {
    background: #f7f7f7;
  }

  .demo-drawer-footer {
    padding: 20px 0;
    text-align: right;
  }

  .display_flex {
    display: flex;
    align-items: center;
  }

  .display_flex_bet {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    .ivu-modal {
      top: 0;
    }
  }

  .pro_list {
    display: flex;
    justify-content: space-between;
  }

  .pro_listitem {
    background-color: #fff;
    padding: 10px 20px;
    border-bottom: 1px solid#ddd;
  }

  .pro_allmoney {
    background-color: #fff;
    padding: 10px 20px;
    text-align: right;
    font-size: 32px;
    color: #f30
  }

  .confrim_button {
    background: #1651aa;
    color: #fff;
    font-weight: bold;
    font-size: 32px;
    border-radius: unset;
    padding: 0 10px;
  }
</style>
