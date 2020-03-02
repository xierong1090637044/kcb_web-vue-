<template>
  <div>
    <div style="margin-bottom: 10px;">
      <Breadcrumb separator="<b style='color: #999;'>/</b>">
        <BreadcrumbItem to="/">首页</BreadcrumbItem>
        <BreadcrumbItem to="/home/goods">产品盘点</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div style="background: #FFFFFF;padding-bottom: 1.25rem;">
      <div>
        <div style="text-align: right;padding:0 0 0.625rem;">
          <Button type="primary" @click="handleSubmit(2)" :disabled="button_disabled">确定盘点</Button>
        </div>
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
              <InputNumber placeholder="请输入数量" size="small" @on-focus="selectIndex = index" v-if="row.goodsName" :min="0"
                @on-change="modify_num($event, index)"></InputNumber>
            </div>
          </template>
          <!--<template slot-scope="{ row, index }" slot="modify_retailPrice">
            <InputNumber placeholder="请输入实际成本价" size="small" @on-focus="selectIndex = index" v-if="row.goodsName" :min="0"
              :value="Number(row.modify_retailPrice)" @on-change="modify_price($event, index)"></InputNumber>
          </template>-->
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
            <FormItem label="盘点日期">
              <FormItem prop="producttime">
                <DatePicker type="date" placeholder="请选择盘点日期" v-model="formItem.date" format="yyyy-MM-dd"></DatePicker>
              </FormItem>
            </FormItem>

            <FormItem label="备注" style="width: 25rem;margin-left: 1.875rem;">
              <Input v-model="formItem.beizhu" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
            </FormItem>
          </div>

        </Form>
      </div>

    </div>

    <!--选择产品模板-->
    <goodsS :show="goodsShow" @cancle="goodsShow = false" @confrimGoods="confrimSelectGoods" type="count"
      :thisSelectGoods="selectGoods"></goodsS>

  </div>
</template>
<script>
  import goodsS from '@/components/component/goodsS.vue';
  import producerS from '@/components/component/producerS.vue';
  import shopS from '@/components/component/shopS.vue';
  import stocksS from '@/components/component/stocksS.vue';

  import send_temp from '@/serve/send_temp.js';
  import common from '@/serve/common.js';
  import goods from '@/serve/goods.js';

  let that;
  export default {
    components: {
      goodsS,
      producerS,
      stocksS,
      shopS
    },
    data() {
      return {
        button_disabled: false,
        stockShow: false,
        shopShow: false,
        producerShow: false,
        goodsShow: false,
        formItem: {
          shop: '',
          producer: '',
          stock: '',
          all_money: 0,
          real_money: 0,
          real_num: 0, //数量
          beizhu: '', //备注
          Images: [],
          date: common.getDay(0), //入库日期
        },
        selectIndex: 0,
        selectGoods: [],
        userid: JSON.parse(localStorage.getItem('user')).objectId || '',
        user: JSON.parse(localStorage.getItem('user')),
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
            render: (h, params) => {
              if (params.row.stocks && params.row.stocks.stock_name) {
                return h('div', [params.row.stocks.stock_name])
              }

            }
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
      that.handleData()
    },

    methods: {
      //提交表单
      handleSubmit(type) {

        that.$Loading.start();
        that.button_disabled = true;
        let selectGoods = []
        let uid = localStorage.getItem('uid')
        let thisUser = JSON.parse(localStorage.getItem('user'))
        for (let item of that.selectGoods) {
          if (item.goodsName) {
            selectGoods.push(item)
          }
        }

        console.log(selectGoods)
        if (selectGoods.length == 0) {
          that.$Message["error"]({
            background: true,
            content: '没有选择出库产品'
          });

          return
        }

        let billsObj = new Array();
        let detailObj = [];
        let stockIds = [];
        let stockNames = []
        for (let i = 0; i < selectGoods.length; i++) {
          let num = Number(selectGoods[i].reserve) - selectGoods[i].num;

          //单据
          let detailBills = {}
          let tempBills = Bmob.Query('NBills');

          let pointer = Bmob.Pointer('_User')
          let user = pointer.set(uid)
          let pointer1 = Bmob.Pointer('NGoods')
          let tempGoods_id = pointer1.set(selectGoods[i].objectId);

          let masterId = localStorage.getItem('masterId');
          let pointer2 = Bmob.Pointer('_User')
          let poiID2 = pointer2.set(masterId);

          tempBills.set('goodsName', selectGoods[i].goodsName);
          tempBills.set('retailPrice', Number(selectGoods[i].modify_retailPrice));
          tempBills.set('num', Number(selectGoods[i].num));
          tempBills.set('reserve', Number(selectGoods[i].reserve));
          tempBills.set('now_reserve', selectGoods[i].num.toString());
          tempBills.set('total_money', selectGoods[i].total_money);
          tempBills.set('opreater', poiID2);
          tempBills.set('goodsId', tempGoods_id);
          tempBills.set('userId', user);
          tempBills.set('type', 3);
          tempBills.set("createdTime", {
            "__type": "Date",
            "iso": that.formItem.date
          }); // 操作单详情
          if (selectGoods[i].stocks && selectGoods[i].stocks.objectId) {
            let pointer3 = Bmob.Pointer('stocks')
            let poiID3 = pointer3.set(selectGoods[i].stocks.objectId);

            tempBills.set('stock', poiID3);
            stockIds.push(selectGoods[i].stocks.objectId);
            stockNames.push(selectGoods[i].stocks.stock_name);
            detailBills.stock = selectGoods[i].stocks.stock_name;
          }

          let goodsId = {}
          if (selectGoods[i].selectd_model) {
            goodsId.selected_model = selectGoods[i].selected_model
            goodsId.models = selectGoods[i].models
            detailBills.goodsId = goodsId
          }
          detailBills.goodsName = selectGoods[i].goodsName
          detailBills.reserve = selectGoods[i].reserve
          detailBills.now_reserve = selectGoods[i].num.toString()
          detailBills.packingUnit = selectGoods[i].packingUnit

          billsObj.push(tempBills)
          detailObj.push(detailBills)

        }
        //插入单据
        Bmob.Query('NBills').saveAll(billsObj).then(function(res) {
            //console.log("批量新增单据成功", res);
            let bills = []
            for (let i = 0; i < res.length; i++) {
              bills.push(res[i].success.objectId)
            }

            let pointer = Bmob.Pointer('_User')
            let poiID = pointer.set(uid);

            let masterId = localStorage.getItem('masterId');
            let pointer1 = Bmob.Pointer('_User')
            let poiID1 = pointer1.set(masterId);

            let query = Bmob.Query('order_opreations');
            query.set("beizhu", that.formItem.beizhu);
            query.set("detail", detailObj);
            query.set("type", 3);
            query.set("opreater", poiID1);
            query.set("master", poiID);
            query.set('goodsName', selectGoods[0].goodsName);
            query.set("stockIds", stockIds);
            query.set("stockNames", stockNames);
            query.set("createdTime", {
              "__type": "Date",
              "iso": that.formItem.date
            }); // 操作单详情
            query.save().then(res => {
              let operationId = res.objectId;

              for (let i = 0; i < selectGoods.length; i++) {
                let num = 0;
                const query = Bmob.Query('NGoods');
                query.get(selectGoods[i].objectId).then(res => {
                  //console.log(res)
                  if (selectGoods[i].selectd_model) {
                    for (let item of selectGoods[i].selected_model) {
                      delete item.num // 清除没用的属行
                    }
                    res.set('models', selectGoods[i].selected_model)
                    num = Number(selectGoods[i].num);
                  } else {
                    num = Number(selectGoods[i].num);
                  }

                  res.set('reserve', num)
                  //res.set('stocktype', (num > selectGoods[i].warning_num) ? 1 : 0)
                  res.save()

                  if (selectGoods[i].header) {
                    const query1 = Bmob.Query("NGoods");
                    query1.equalTo("header", "==", selectGoods[i].header.objectId);
                    query1.equalTo("order", "==", 1);
                    query1.statTo("sum", "reserve");
                    query1.find().then(res => {
                      //console.log("dasds", res)
                      let now_reserve = res[0]._sumReserve
                      const query = Bmob.Query('NGoods');
                      query.get(selectGoods[i].header.objectId).then(res => {
                        res.set('reserve', now_reserve)
                        res.save()

                        common.modifyStockType(selectGoods[i].header.objectId)

                        if(i == selectGoods.length- 1){
                          that.button_disabled = false;
                          that.$Loading.finish();
                          that.$Message.success('盘点成功');
                          that.handleData();
                        }

                      })
                    })
                  } else {
                    common.modifyStockType(selectGoods[i].objectId)

                    if(i == selectGoods.length- 1){
                      that.button_disabled = false;
                      that.$Loading.finish();
                      that.$Message.success('盘点成功');
                      that.handleData();
                    }
                  }

                }).catch(err => {
                  console.log(err)
                })
              }



            })

          },
          function(error) {
            // 批量新增异常处理
            console.log("异常处理");
          });

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
          that.formItem.real_num += Number(item.num ? item.num : 0)
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
          that.formItem.real_num += Number(item.num ? item.num : 0)
          that.formItem.all_money += Number(item.total_money ? item.total_money : 0)
          that.formItem.real_money += Number(item.total_money ? item.total_money : 0)
        }
      },

      confrimSelectGoods(goods) {
        that.selectGoods = [];
        that.goodsShow = false;
        let count = 0;

        for (let item of goods) {
          that.formItem.real_num += Number(item.num)
          that.formItem.real_money += Number(item.retailPrice)
          that.selectGoods.push(item)
          count += 1

          if (count == goods.length) {
            for (let i = 0; i <= 4; i++) {
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
          }
        }
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

      handleData() {
        that.selectGoods = []
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
