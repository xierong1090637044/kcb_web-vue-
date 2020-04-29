<template>
  <div>
    <div style="margin-bottom: 10px;">
      <Breadcrumb separator="<b style='color: #999;'>/</b>">
        <BreadcrumbItem to="/">首页</BreadcrumbItem>
        <BreadcrumbItem to="/home/finance/financeLsit">应收账款</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <Input search enter-button placeholder="输入客户名" style="width: 25%;margin-bottom: 10px;" @on-search='searchCustom' />

    <Table :columns="columns" :data="data" stripe border :height="screenHeight - 200" size="small">
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="getDetail(row)">查看详情</Button>
      </template>
    </Table>

    <div v-if="selectCustom">
      <Modal :title="selectCustom.custom_name +'客户的应收账款明细'" :value="true" width="80%" @on-ok="selectCustom = ''"
        @on-cancel="selectCustom = ''" footer-hide>
        <div style="display: flex;justify-content: flex-end;margin-bottom: 0.625rem;">
          <Button type="primary" @click="getMoneyOrder">生成收款单</Button>
        </div>
        <Table :columns="columnsDet" :data="DetailData" stripe border size="small"
        @on-select="get_select" @on-select-all="get_select" @on-select-cancel="cancle_select" @on-select-all-cancel="cancle_select">
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="getMoneyOrder">单据详情</Button>
          </template>
        </Table>
      </Modal>
    </div>
  </div>
</template>

<script>
  let that;
  export default {
    components: {

    },
    data() {
      return {
        screenHeight: window.innerHeight,
        DetailData: [],
        data: [],
        selectCustom: '',//选择的客户
        selectOrders:[],//选择的单据
        columns: [{
            title: '客户名字',
            key: 'custom_name',
          },
          {
            title: '联系电话',
            key: 'custom_phone',
          },
          {
            title: '联系地址',
            key: 'custom_address',
          },
          {
            title: '待收款',
            key: '_sumDebt',
          },
          {
            title: '操作',
            slot: 'action',
            align: 'center'
          }
        ],
        columnsDet: [{
            width: 60,
            type: 'selection',
            align: 'center',
          }, {
            title: '客户',
            render: (h, params) => {
              return h('div', params.row.custom.custom_name)
            }
          },
          {
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
            title: '已收',
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
            title: '待收',
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
            title: '操作',
            slot: 'action',
            align: 'center'
          }
        ],
      }
    },


    mounted() {
      that = this;
      that.load_data()
    },

    methods: {
      get_select(selection){
        that.selectOrders = selection
        //console.log(selection)
      },

      cancle_select(selection){
        that.selectOrders = selection
        //console.log(selection)
      },

      getMoneyOrder(){
        if(that.selectOrders.length == 0){
          that.$Message.error('请勾选单据！');
        }else{
          localStorage.setItem("CAPOrder",JSON.stringify(that.selectOrders))
          this.$router.push({
            path: '/home/finance/financeCustomInOrder'
          })
        }
      },

      //查看详情点击
      getDetail(row) {
        that.selectCustom = row
        that.$http.Post("stock_financeCustomInDet", {
          customId: row.custom.objectId
        }).then(res => {
          that.DetailData = res.data
        })
      },

      searchCustom(value) {
        let arr = []
        let keyWord = value
        if (keyWord) {
          for (let i = 0; i < that.data.length; i++) {
            if (that.data[i].custom_name.split(keyWord).length > 1) {
              arr.push(that.data[i]);
            }
          }
          that.data = arr
        } else {
          that.load_data()
        }
      },

      load_data() {
        that.$http.Post("stock_financeCustomIn", {}).then(res => {
          that.data = res.data
        })
      },
    }

  }
</script>

<style>
</style>
