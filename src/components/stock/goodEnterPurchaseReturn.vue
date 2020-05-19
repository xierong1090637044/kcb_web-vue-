<template>
  <div>
    <div style="margin-bottom: 10px;">
      <Breadcrumb separator="<b style='color: #999;'>/</b>">
        <BreadcrumbItem to="/">首页</BreadcrumbItem>
        <BreadcrumbItem to="/home/goods">产品采购退货</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div style="background: #FFFFFF;padding: 1.25rem 1.25rem 0;">

      <div class="orderTitle">采购退货单</div>
      <div class="display_flex" style="margin-bottom: 1.875rem;">

        <div class="tableEle">
          <div class="tableRightEle">出库仓库<span style="color: #f30;">*</span></div>
          <Input v-model="formItem.stock.stock_name" placeholder="请选择出库仓库" @on-focus="stockShow = true"></Input>
        </div>

        <div class="tableEle">
          <div class="tableRightEle">退货日期</div>
          <DatePicker type="datetime" placeholder="请选择退货日期" v-model="formItem.date" format="yyyy-MM-dd HH:mm:ss"></DatePicker>
        </div>

        <div class="tableEle">
          <div class="tableRightEle">供应商</div>
          <Input placeholder="选择供货商" :readonly="true" @on-focus="producerShow = true" :value="formItem.producer.producer_name">
          <Icon type="ios-arrow-down" slot="suffix" />
          </Input>
        </div>

        <div class="tableEle">
          <div class="tableRightEle">结算账户</div>
          <Input v-model="formItem.account.name" @on-focus="accountShow = true"></Input>
        </div>
      </div>

      <Table :columns="columns" :data="selectGoods" ref="table" border :height="screenHeight - 540" size="small">
        <template slot-scope="{ row, index }" slot="goodsName">
          <div v-if="row.goodsName">{{row.goodsName}}</div>
          <Input placeholder="点击选择产品" @on-focus="goodsShow = true;selectIndex = index;" v-else>
          <Icon type="ios-arrow-down" slot="suffix" />
          </Input>
        </template>
        <template slot-scope="{ row, index }" slot="reserve">
          <div v-if="row.selected_model">
            <div v-for="(model,key) in row.selected_model" :key="key" class="display_flex" style="margin:0.25rem 0.375rem;">
              <div>{{model.custom1.value + model.custom2.value + model.custom3.value + model.custom4.value}}：</div>
              <InputNumber placeholder="请输入数量" size="small" @on-focus="selectIndex = index" v-if="row.goodsName" :value="key== 0?1:0"
                :min="1" @on-change="handleModelNumChange($event, index,key,model)"></InputNumber>
            </div>
          </div>
          <div v-else>
            <InputNumber placeholder="请输入数量" size="small" @on-focus="selectIndex = index" v-if="row.goodsName" :min="0"
              @on-change="modify_num($event, index)"></InputNumber>
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="modify_retailPrice">
          <InputNumber placeholder="请输入实际退货价" size="small" @on-focus="selectIndex = index" v-if="row.goodsName" :min="0"
            :value="Number(row.modify_retailPrice)" @on-change="modify_price($event, index)" style="margin:0.25rem 0.375rem;"></InputNumber>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <ButtonGroup>
            <Button icon="md-add" @click="addSelectGoods"></Button>
            <Button icon="md-close" @click="reduceSelectGoods(index)"></Button>
          </ButtonGroup>
        </template>
      </Table>

      <div style="padding: 0 0.625rem;">
        <Form :model="formItem" :label-width="100" style="margin-top: 1.875rem;">

          <div style="display: flex;">
            <FormItem label="本次退款">
              <Input placeholder="请输入本次实际退货金额" v-model="formItem.real_money"></Input>
            </FormItem>

            <FormItem label="备注">
              <Input v-model="formItem.beizhu" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
            </FormItem>

            <FormItem label="凭证图">
              <uploadImg @selectImg="selectImg"></uploadImg>
            </FormItem>
          </div>

        </Form>
      </div>

      <div style="text-align: center;padding:1.25rem 0;">
        <Button type="primary" @click="handleSubmit(2)" :disabled="button_disabled">确定采购退货</Button>
      </div>

    </div>

    <!--选择产品模板-->
    <goodsS :show="goodsShow" @cancle="goodsShow = false" @confrimGoods="confrimSelectGoods" type="enter"
      :thisSelectGoods="selectGoods"></goodsS>
    <!--生产商列表-->
    <producerS @cancle="producerShow = false" v-if="producerShow" @select="selectProducter"></producerS>
    <stocksS v-if="stockShow" @confrim="chooseStock" @cancle="stockShow = false"></stocksS>
    <accountsSelect v-if="accountShow" @cancle="accountShow = false" @select="selectAccount"></accountsSelect>

  </div>
</template>
<script>
  import goodsS from '@/components/component/goodsS.vue';
  import producerS from '@/components/component/producerS.vue';
  import stocksS from '@/components/component/stocksS.vue';
  import uploadImg from '@/components/component/uploadImg.vue';
  import accountsSelect from '@/components/component/accountsSelect.vue';

  import send_temp from '@/serve/send_temp.js';
  import common from '@/serve/common.js';
  import goods from '@/serve/goods.js';

  let that;
  export default {
    components: {
      accountsSelect,
      goodsS,
      producerS,
      stocksS,
      uploadImg
    },
    data() {
      return {
        button_disabled: false,
        stockShow: false,
        shopShow: false,
        producerShow: false,
        goodsShow: false,
        accountShow:false,
        formItem: {
          account: '', //结算账户
          producer: '',
          stock: '',
          all_money: 0,
          real_money: 0,//本次退款
          real_num: 0, //数量
          beizhu: '', //备注
          Images: [],
          date: common.getDay(0, true, true), //采购日期
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
          }, {
            title: '产品图片',
            key: 'goodsIcon',
            width: 100,
            render: (h, params) => {
              return h('div', {
                style: {
                  "text-align": "center"
                },
              }, [
                h('img', {
                  style: {
                    width: '20px',
                  },
                  attrs: {
                    src: params.row.goodsIcon
                  }
                })
              ]);
            }
          },

          {
            align: 'center',
            title: '包装',
            key: 'package',
            width: 100,
          },
          {
            align: 'center',
            title: '规格',
            key: 'packModel',
            width: 100,
          },
          {
            width: 200,
            align: 'center',
            title: '数量',
            key: 'reserve',
            slot: 'reserve',
          },
          {
            width: 160,
            align: 'center',
            title: '退货单价',
            key: 'modify_retailPrice',
            slot: 'modify_retailPrice',
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

      //选择凭证图
      selectImg(value) {
        that.formItem.Images = value
      },

      //选择仓库
      chooseStock(value) {
        that.formItem.stock = value
        that.stockShow = false
      },

      //选择供货商
      selectProducter(value) {
        that.formItem.producer = value;
        that.producerShow = false;
      },

      //选择账户
      selectAccount(value) {
        that.formItem.account = value
        that.accountShow = false
      },


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

        if (selectGoods.length == 0) {
          that.$Message.error('"没有选择采购退货产品');
          that.$Loading.finish();
          that.button_disabled = false;
          return
        }

        if (that.formItem.stock == "" || that.formItem.stock == undefined || that.formItem.stock == null) {
          that.$Message.error('"请选择出库仓库');
          that.$Loading.finish();
          that.button_disabled = false;
          return
        }

        if (that.formItem.producer == "") {
          that.$Message.error('"没有选择供货商');
          that.$Loading.finish();
          that.button_disabled = false;
          return;
        }

        let params = {
          "goods": selectGoods,
          "beizhu": that.formItem.beizhu,
          "real_num": that.formItem.real_num,
          "stockId": that.formItem.stock.objectId,
          "stockName": that.formItem.stock.stock_name,
          "real_money": that.formItem.real_money,
          "all_money": that.formItem.all_money,
          "accountId": that.formItem.account.objectId,
          "producerId": that.formItem.producer.objectId,
          "Images": that.formItem.Images,
          "opreater": JSON.parse(localStorage.getItem("user")).objectId,
          "nowDay": that.formItem.date
        }


        that.$http.Post("stock_goodEnterPurchaseReturn", params).then(res => {
          if (res.code == 1) {
            that.$Loading.finish();
            that.handleData();
            that.button_disabled = false;
          }
        })

      },

      //修改价格
      modify_price($event, index) {
        console.log($event, index, that.selectGoods)
        that.selectGoods[index].modify_retailPrice = Number($event)
        that.selectGoods[index].total_money = that.selectGoods[index].num * Number($event)
        that.selectGoods[index].really_total_money = that.selectGoods[index].num * Number($event)

        console.log(that.selectGoods)
        that.formItem.real_money = 0
        that.formItem.all_money = 0
        that.formItem.real_num = 0
        for (let item of that.selectGoods) {
          that.formItem.real_num += Number(item.num ? item.num : 0)
          that.formItem.all_money += Number(item.total_money ? item.total_money : 0)
          that.formItem.real_money += Number(item.really_total_money ? item.really_total_money : 0)
        }
      },

      //输入数量时触发
      modify_num($event, index) {
        console.log($event, index)
        that.selectGoods[index].num = Number($event)
        that.selectGoods[index].total_money = Number($event) * Number(that.selectGoods[index].modify_retailPrice)
        that.selectGoods[index].really_total_money = Number($event) * Number(that.selectGoods[index].modify_retailPrice)

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
        item.num = Number($event)
        that.selectGoods[index].selected_model[key] = item
        console.log(item, that.selectGoods[index])
        let _sumNum = 0;
        for (let model of that.selectGoods[index].selected_model) {
          _sumNum += model.num
        }

        that.selectGoods[index].models = that.selectGoods[index].selected_model
        that.selectGoods[index].num = _sumNum
        that.selectGoods[index].total_money = _sumNum * Number(this.selectGoods[index].modify_retailPrice)
        that.selectGoods[index].really_total_money = _sumNum * Number(this.selectGoods[index].modify_retailPrice)

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
        that.formItem.real_money = 0;
        that.formItem.all_money = 0;
        that.formItem.real_num = 0;
        that.selectGoods = [];
        that.goodsShow = false;

        let count = 0
        for (let item of goods) {
          that.formItem.real_money += Number(item.num) * Number(item.modify_retailPrice)
          that.formItem.all_money += Number(item.num) * Number(item.modify_retailPrice)
          that.formItem.real_num += Number(item.num) * Number(item.num)
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
        //console.log(goods, that.selectGoods)
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

        that.formItem = {
          account: '', //结算账户
          producer: '',
          stock: '',
          all_money: 0,
          real_money: 0,
          real_num: 0, //数量
          beizhu: '', //备注
          Images: [],
          date: common.getDay(0, true, true), //采购日期
        }
      },

      reduceSelectGoods(index) {
        that.selectGoods.splice(index, 1)

        that.formItem.real_money = 0
        that.formItem.all_money = 0
        that.formItem.real_num = 0
        for (let item of that.selectGoods) {
          that.formItem.real_num += Number(item.num ? item.num : 0)
          that.formItem.all_money += Number(item.total_money ? item.total_money : 0)
          that.formItem.real_money += Number(item.really_total_money ? item.really_total_money : 0)
        }
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
