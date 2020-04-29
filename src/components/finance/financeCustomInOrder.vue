<template>
  <div>
    <div style="margin-bottom: 10px;">
      <Breadcrumb separator="<b style='color: #999;'>/</b>">
        <BreadcrumbItem to="/">首页</BreadcrumbItem>
        <BreadcrumbItem to="/home/goods">创建收款单</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div style="background: #FFFFFF;padding: 1.25rem 1.25rem 0;">
      <div>
        <div class="display_flex_bet">
          <div></div>
          <div style="text-align: right;margin-bottom: 1.5rem;">
            <Button type="primary" @click="handleSubmit()" :disabled="button_disabled">确定收款</Button>
          </div>
        </div>

        <div style="display: flex;">
          <Form :model="formItem" :label-width="80" style="margin-top: 1.875rem;">
            <div class="display_flex">
              <FormItem label="客户" :label-width="40">
                <Input placeholder="选择客户" :readonly="true" @on-focus="customShow = true" :value="formItem.custom.custom_name">
                <Icon type="ios-arrow-down" slot="suffix" />
                </Input>
              </FormItem>
              <FormItem label="销售日期">
                <FormItem prop="producttime">
                  <DatePicker type="datetime" placeholder="请选择销售日期" v-model="formItem.date" format="yyyy-MM-dd HH:mm:ss"></DatePicker>
                </FormItem>
              </FormItem>
            </div>
          </Form>
        </div>


        <Table :columns="columns" :data="selectOrders" ref="table" border :height="screenHeight - 440" size="small">
          <template slot-scope="{ row, index }" slot="shouldGetMoney">
            <InputNumber placeholder="请输入本次实际收款" size="small" :max="row.shouldGetMoney" style="margin:0.25rem 0.375rem;"
              :min="0.01" @on-change="modifyShouldGetMoney($event, index)" :value="row.shouldGetMoney"></InputNumber>
          </template>
        </Table>
      </div>

      <div style="padding: 0 0.625rem;">
        <Form :model="formItem" :label-width="100" style="margin-top: 1.875rem;">
          <div class="display_flex">
            <FormItem label="结算账户">
              <Input v-model="formItem.account.name" @on-focus="accountShow = true"></Input>
            </FormItem>
            
            <FormItem label="结算账户">
              <Input v-model="formItem.account.name" @on-focus="accountShow = true"></Input>
            </FormItem>
            
          </div>

          <div style="display: flex;">
            

            <FormItem label="备注">
              <Input v-model="formItem.beizhu" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
            </FormItem>
          </div>

        </Form>
      </div>

    </div>

    <!--生产商列表-->
    <customS @cancle="customShow = false" v-if="customShow" @select="selectProducter"></customS>
    <accountsSelect v-if="accountShow" @cancle="accountShow = false" @select="selectAccount"></accountsSelect>

  </div>
</template>
<script>
  import customS from '@/components/component/customS.vue';
  import accountsSelect from '@/components/component/accountsSelect.vue';

  import common from '@/serve/common.js';
  import goods from '@/serve/goods.js';

  let that;
  export default {
    components: {
      accountsSelect,
      customS
    },
    data() {
      return {
        button_disabled: false,
        accountShow: false,
        customShow: false,
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
        selectOrders: [],
        userid: JSON.parse(localStorage.getItem('user')).objectId || '',
        user: JSON.parse(localStorage.getItem('user')),
        screenHeight: window.innerHeight,
        loading: true,
        columns: [{
            title: '单据编号',
            key: 'objectId',
          },
          {
            title: '单据日期',
            key: 'createdAt',
          },
          {
            title: '应收金额',
            key: 'real_money',
            render: (h, params) => {
              return h('div', {
                style: {
                  "color": "#f30"
                },
              }, ["￥" + params.row.real_money])
            }
          },
          {
            title: '已收款',
            key: 'haveGetMoney',
            render: (h, params) => {
              return h('div', {
                style: {
                  "color": "#f30"
                },
              }, [params.row.haveGetMoney ? "￥" + params.row.haveGetMoney : "￥" + (params.row.real_money -
                params.row.debt)])
            }
          },
          {
            title: '待收款',
            key: 'debt',
            render: (h, params) => {
              return h('div', {
                style: {
                  "color": "#f30"
                },
              }, ["￥" + params.row.debt])
            }
          },
          {
            title: '本次收款',
            key: 'shouldGetMoney',
            slot: 'shouldGetMoney',
          }
        ],

      };
    },

    mounted() {
      that = this;
      that.selectOrders = JSON.parse(localStorage.getItem("CAPOrder"))
      for (let item of that.selectOrders) {
        item.shouldGetMoney = item.debt
      }
    },

    methods: {
      modifyShouldGetMoney($event, index) {
        that.selectOrders[index].shouldGetMoney = Number($event)
      },

      //选择账户
      selectAccount(value) {
        that.formItem.account = value
        that.accountShow = false
      },

      //选择客户
      selectProducter(value) {
        that.formItem.custom = value;
        that.customShow = false;
      },
      //提交表单
      handleSubmit() {
        console.log(that.selectOrders)
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
