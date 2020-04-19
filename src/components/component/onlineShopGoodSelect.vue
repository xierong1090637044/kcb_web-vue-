<template>
  <div>
    <Modal title="选择产品" width="80%" :value="true" @on-cancel="outData" @on-ok="confrimGoods" :closable="false" :mask-closable="false">

      <div>
        <div class="marginBot5">第一步、选择进销存模块中的商品档案</div>
        <div>
          <div class="display_flex" style="margin-bottom: 10px;">
            <Input search enter-button placeholder="请输入产品名字" style="width: 300px;" @on-search="searchGood" />
          </div>

          <div>
            <Table :columns="columns" :data="goods" :loading="loading" ref="table" border :height="screenHeight - 540"
              size="small" @on-selection-change="changeSelect">
            </Table>

            <div style="margin: 10px;overflow: hidden">
              <div style="float: right;">
                <Page :total="10000" :current="pege_number" @on-change="changePage"></Page>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="marginBot5">第二步、选择关联商城中的分类</div>
        <div>
          <Select v-model="shop_GoodClassSelected" style="width:200px">
            <Option v-for="item in shop_GoodClass" :value="item.objectId" :key="item.objectId">{{ item.content }}</Option>
          </Select>
        </div>
      </div>


      <!--产品图片展示-->
      <Modal title="产品图片" v-model="GoodImg.show" class-name="vertical-center-modal">
        <img :src="GoodImg.attr" style="max-height: 800px;margin: 0 auto;width: 100%;" />
      </Modal>
    </Modal>

  </div>
</template>
<script>
  import producerS from '@/components/component/producerS.vue';
  import shopS from '@/components/component/shopS.vue';

  import common from '@/serve/common.js';
  import goods from '@/serve/goods.js';

  let that;
  export default {
    props: ['show', 'type', 'thisSelectGoods'],
    components: {
      producerS,
      shopS
    },
    data() {
      return {
        shop_GoodClassSelected:'',//选择的产品类别
        shopShow: false,
        producerShow: false, // 控制供应商显示

        GoodImg: {
          show: false,
          attr: ''
        },
        modal2: {
          all_money: 0,
          real_money: 0,
        },

        userid: JSON.parse(localStorage.getItem('user')).objectId || '',
        user: JSON.parse(localStorage.getItem('user')),
        page_size: 50,
        pege_number: 1,
        screenHeight: window.innerHeight,
        loading: true,
        columns: [{
            width: 60,
            type: 'selection',
            align: 'center',
          },
          {
            width: 280,
            title: '产品名字',
            key: 'goodsName',
            sortable: true,
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

            align: 'center',
            title: '库存',
            key: 'reserve',
            sortable: true,
          },
          {

            align: 'center',
            sortable: true,
            title: '成本价',
            key: 'costPrice',
          },
          {

            align: 'center',
            title: '零售价',
            key: 'retailPrice',
            sortable: true,
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
            align: 'center',
            title: '创建时间',
            key: 'createdAt',
            sortable: true,
          }
        ],

        GoodEditShow: false, //产品信息编辑显示控制
        ConfrimClick: true,
        goods: [],
        select_goods: [], //选择模式下选择的产品数据
        customsList: JSON.parse(localStorage.getItem("customs")), //客户列表
        stockList: JSON.parse(localStorage.getItem("stocks")), //仓库列表
        search: {
          searchGoodText: '',
          stockId: ''
        }, //搜索条件
        shop_GoodClass: []
      };
    },

    mounted() {
      that = this;
      this.get_productList();
      that.getShopGoodClass()
      window.onresize = () => {
        return (() => {
          that.screenHeight = window.innerHeight;
        })();
      };
    },

    methods: {
      //取消操作
      outData() {
        this.$emit('cancle', false)
      },

      getShopGoodClass() {
        that.$http.Post("shop_getGoodClass", {}).then(res => {
          that.shop_GoodClass = res.data
        })
      },

      //选择当前操作返回
      confrimGoods() {
        let selected={}
        let selectedGoodsId = []
        for (let item of that.select_goods) {
          selectedGoodsId.push(item.objectId)
        }
        selected.selectedGoodsId = selectedGoodsId
        selected.selectedGoodClass = that.shop_GoodClassSelected

        this.$emit('confrimGoods', selected)
      },

      //选择产品
      changeSelect(e) {
        that.select_goods = e;
        let index = 0;
        if (that.type == "enter") {
          for (let item of that.select_goods) {
            that.select_goods[index].num = 1;
            that.select_goods[index].total_money = 1 * that.select_goods[index].costPrice;
            that.select_goods[index].really_total_money = 1 * that.select_goods[index].costPrice;
            that.select_goods[index].modify_retailPrice = that.select_goods[index].costPrice;
            index += 1;
          }
        } else {
          for (let item of that.select_goods) {
            that.select_goods[index].num = 1;
            that.select_goods[index].total_money = 1 * that.select_goods[index].retailPrice;
            that.select_goods[index].really_total_money = 1 * that.select_goods[index].costPrice;
            that.select_goods[index].modify_retailPrice = that.select_goods[index].retailPrice;
            index += 1;
          }
        }
      },

      //搜索产品
      searchGood(e) {
        that.loading = true;
        that.search.searchGoodText = e
        that.get_productList()
      },

      //选择仓库
      selectStock(e) {
        //console.log(e)
        that.loading = true;
        that.search.stockId = e
        that.get_productList()
      },

      //改变页数
      changePage(pege_number) {
        that.loading = true;
        that.pege_number = pege_number;
        that.get_productList();
      },

      //查询产品列表
      get_productList(stockId) {
        that.select_goods = [];

        let params = {
          funcName: 'Goods',
          data: {
            uid: that.userid,
            content: that.search.searchGoodText,
            pageSize: 200,
            pageNum: that.pege_number,
            order: "-createdAt"
          }
        }
        Bmob.functions(params.funcName, params.data).then(function(res) {
          console.log(res.data)
          for (let item of res.data) {

            for (let selectgGood of that.thisSelectGoods) {
              if (selectgGood.objectId == item.objectId) {
                item._checked = true
                that.select_goods.push(item)
              }
            }

            item.class = (item.goodsClass ? (item.goodsClass.class_text || "") : "") + "    " + (item.second_class ?
              (item.second_class.class_text || "") : "")


            if (item.models) {
              let count = 0
              for (let model of item.models) {
                model.num = count == 0 ? 1 : 0
                count += 1
              }
              item.num = count
              item.selected_model = item.models
            }
          }
          that.goods = res.data;
          that.loading = false;

        })
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
