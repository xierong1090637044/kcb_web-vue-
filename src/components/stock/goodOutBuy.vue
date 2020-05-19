<template>
  <div>
    <div style="margin-bottom: 10px;">
      <Breadcrumb separator="<b style='color: #999;'>/</b>">
        <BreadcrumbItem to="/">首页</BreadcrumbItem>
        <BreadcrumbItem to="/home/goods">产品销售</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div style="background: #FFFFFF;padding: 1.25rem 1.25rem 0;">

      <div class="orderTitle">销售单</div>
      <div class="display_flex" style="margin-bottom: 1.875rem;">

        <div class="tableEle">
          <div class="tableRightEle">出库仓库<span style="color: #f30;">*</span></div>
          <Input v-model="formItem.stock.stock_name" placeholder="请选择出库仓库" @on-focus="stockShow = true"></Input>
        </div>

        <div class="tableEle">
          <div class="tableRightEle">销售日期<span style="color: #f30;">*</span></div>
          <DatePicker type="datetime" placeholder="请选择销售日期" v-model="formItem.date" format="yyyy-MM-dd HH:mm:ss"></DatePicker>
        </div>

        <div class="tableEle">
          <div class="tableRightEle">客户<span style="color: #f30;">*</span></div>
          <Input placeholder="选择客户" :readonly="true" @on-focus="customShow = true" :value="formItem.custom.custom_name">
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
          <InputNumber placeholder="请输入实际成本价" size="small" @on-focus="selectIndex = index" v-if="row.goodsName" :min="0"
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

          <div class="display_flex">
            <FormItem label="商品总价">
              <Input v-model="formItem.all_money" :disabled="true"></Input>
            </FormItem>

            <FormItem label="其他费用">
              <Input v-model="formItem.otherMoney" type="number" placeholder="请输入其他费用"></Input>
            </FormItem>

            <FormItem label="优惠金额">
              <Input v-model="formItem.discountMoney" type="number" placeholder="请输入优惠金额"></Input>
            </FormItem>

            <FormItem label="现结(预付)款">
              <Input v-model="formItem.haveGetMoney" type="number" placeholder="请输入其他费用"></Input>
            </FormItem>

            <FormItem label="现结(预付)后欠款" :label-width="140">
              <Input :value="Number(formItem.real_money) - Number(formItem.haveGetMoney) - Number(formItem.discountMoney) +Number(formItem.otherMoney)"
                :disabled="true"></Input>
            </FormItem>
          </div>

          <div style="display: flex;">

            <FormItem label="备注">
              <Input v-model="formItem.beizhu" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
            </FormItem>

            <FormItem label="凭证图">
              <uploadImg @selectImg="selectImg"></uploadImg>
            </FormItem>
          </div>

          <div style="text-align: center;padding:1.25rem 0;">
            <Button type="primary" @click="handleSubmit(2)" :disabled="button_disabled">确定销售</Button>
          </div>

        </Form>
      </div>

    </div>

    <!--选择产品模板-->
    <goodsS :show="goodsShow" @cancle="goodsShow = false" @confrimGoods="confrimSelectGoods" type="out"
      :thisSelectGoods="selectGoods"></goodsS>
    <!--生产商列表-->
    <customS @cancle="customShow = false" v-if="customShow" @select="selectProducter"></customS>
    <stocksS v-if="stockShow" @confrim="chooseStock" @cancle="stockShow = false"></stocksS>
    <accountsSelect v-if="accountShow" @cancle="accountShow = false" @select="selectAccount"></accountsSelect>

  </div>
</template>
<script>
  import goodsS from '@/components/component/goodsS.vue';
  import customS from '@/components/component/customS.vue';
  import stocksS from '@/components/component/stocksS.vue';
  import uploadImg from '@/components/component/uploadImg.vue';
  import accountsSelect from '@/components/component/accountsSelect.vue';

  import common from '@/serve/common.js';
  import goods from '@/serve/goods.js';

  let that;
  export default {
    components: {
      accountsSelect,
      goodsS,
      customS,
      stocksS,
      uploadImg
    },
    data() {
      return {
        button_disabled: false,
        stockShow: false,
        accountShow: false,
        customShow: false,
        goodsShow: false,
        formItem: {
          account: '', //结算账户
          custom: '',
          stock: '',
          allCostPrice: 0, //总成本额
          all_money: 0,
          real_money: 0,
          real_num: 0, //数量
          otherMoney: 0, //其他金额 +
          discountMoney: 0, //优惠金额 -
          haveGetMoney: 0, //预付款 -
          beizhu: '', //备注
          Images: [],
          date: common.getDay(0, true, true), //销售日期
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
            title: '销售单价',
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

      //选择账户
      selectAccount(value) {
        that.formItem.account = value
        that.accountShow = false
      },

      //选择仓库
      chooseStock(value) {
        that.formItem.stock = value
        that.stockShow = false
      },

      //选择客户
      selectProducter(value) {
        that.formItem.custom = value;
        that.customShow = false;
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
          that.$Message.error('"没有选择销售产品');
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

        if (that.formItem.custom == "") {
          that.$Message.error('"没有选择客户');
          that.$Loading.finish();
          that.button_disabled = false;
          return;
        }

        that.$http.Post("stock_goodOutBuy", {
          "goods": selectGoods,
          "beizhu": that.formItem.beizhu,
          "real_num": that.formItem.real_num,
          "stockId": that.formItem.stock.objectId,
          "stockName": that.formItem.stock.stock_name,
          "allCostPrice": that.formItem.allCostPrice,
          "otherMoney": that.formItem.otherMoney, //其他金额 +
          "discountMoney": that.formItem.discountMoney, //优惠金额 -
          "haveGetMoney": that.formItem.haveGetMoney, //预付款
          "real_money": that.formItem.real_money,
          "all_money": that.formItem.all_money,
          "accountId": that.formItem.account.objectId,
          "customId": that.formItem.custom.objectId,
          "Images": that.formItem.Images,
          "opreater": JSON.parse(localStorage.getItem("user")).objectId,
          "nowDay": that.formItem.date
        }).then(res => {
          if (res.code) {
            that.button_disabled = false;
            that.$Loading.finish();
            that.handleData();
          }
        })

      },

      //修改价格
      modify_price($event, index) {
        console.log($event, index, that.selectGoods)
        that.selectGoods[index].modify_retailPrice = Number($event)
        that.selectGoods[index].total_money = that.selectGoods[index].num * Number($event)
        that.selectGoods[index].really_total_money = that.selectGoods[index].num * Number($event)

        that.formItem.real_money = 0
        that.formItem.all_money = 0
        that.formItem.real_num = 0
        that.formItem.allCostPrice = 0
        for (let item of that.selectGoods) {
          that.formItem.real_num += Number(item.num ? item.num : 0)
          that.formItem.all_money += Number(item.total_money ? item.total_money : 0)
          that.formItem.real_money += Number(item.really_total_money ? item.really_total_money : 0)
          that.formItem.allCostPrice += Number(item.num) * Number(item.costPrice)
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
        that.formItem.allCostPrice = 0
        for (let item of that.selectGoods) {
          that.formItem.real_num += Number(item.num ? item.num : 0)
          that.formItem.all_money += Number(item.total_money ? item.total_money : 0)
          that.formItem.real_money += Number(item.really_total_money ? item.really_total_money : 0)
          that.formItem.allCostPrice += Number(item.num) * Number(item.costPrice)
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

        console.log(_sumNum)

        that.selectGoods[index].models = that.selectGoods[index].selected_model
        that.selectGoods[index].num = _sumNum
        that.selectGoods[index].total_money = _sumNum * Number(this.selectGoods[index].modify_retailPrice)
        that.selectGoods[index].really_total_money = _sumNum * Number(this.selectGoods[index].modify_retailPrice)

        that.formItem.real_money = 0
        that.formItem.all_money = 0
        that.formItem.real_num = 0
        that.formItem.allCostPrice = 0
        for (let item of that.selectGoods) {
          that.formItem.real_num += Number(item.num ? item.num : 0)
          that.formItem.all_money += Number(item.total_money ? item.total_money : 0)
          that.formItem.real_money += Number(item.total_money ? item.total_money : 0)
          that.formItem.allCostPrice += Number(item.num) * Number(item.costPrice)
        }
      },

      confrimSelectGoods(goods) {
        that.formItem.real_money = 0;
        that.formItem.all_money = 0;
        that.formItem.real_num = 0;
        that.formItem.allCostPrice = 0;
        that.selectGoods = [];
        that.goodsShow = false;

        let count = 0
        for (let item of goods) {
          that.formItem.real_money += Number(item.num) * Number(item.modify_retailPrice)
          that.formItem.all_money += Number(item.num) * Number(item.modify_retailPrice)
          that.formItem.real_num += Number(item.num) * Number(item.num)
          that.formItem.allCostPrice += Number(item.num) * Number(item.costPrice)
          that.selectGoods.push(item)
          count += 1
          if (count == goods.length) {
            for (let i = 0; i <= 4; i++) {
              let good = {}
              good.goodsName = ''
              good.stocks = ''
              good.class = ''
              good.reserve = ''
              good.retailPrice = ''
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
        good.retailPrice = ''
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
          good.retailPrice = ''
          good.modify_retailPrice = ''
          good.retailPrice = ''
          good.packageContent = ''
          good.packingUnit = ''
          good.createdAt = ''
          that.selectGoods.push(good)
        }

        that.formItem = {
          account: '', //结算账户
          custom: '',
          stock: '',
          all_money: 0,
          allCostPrice: 0,
          real_money: 0,
          real_num: 0, //数量
          otherMoney: 0, //其他金额 +
          discountMoney: 0, //优惠金额 -
          haveGetMoney: 0, //预付款 -
          beizhu: '', //备注
          Images: [],
          date: common.getDay(0, true, true), //销售日期
        }
      },

      reduceSelectGoods(index) {
        that.selectGoods.splice(index, 1)

        that.formItem.real_money = 0
        that.formItem.all_money = 0
        that.formItem.real_num = 0
        that.formItem.allCostPrice = 0
        for (let item of that.selectGoods) {
          that.formItem.real_num += Number(item.num ? item.num : 0)
          that.formItem.all_money += Number(item.total_money ? item.total_money : 0)
          that.formItem.real_money += Number(item.really_total_money ? item.really_total_money : 0)
          that.formItem.allCostPrice += Number(item.num) * Number(item.costPrice)
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
