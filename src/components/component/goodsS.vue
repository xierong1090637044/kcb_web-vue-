<template>
  <div>
    <Modal title="选择产品" :closable="false" width="80%" :value="show" @on-cancel="outData" @on-ok="confrimGoods">
      <div class="display_flex" style="margin-bottom: 20px;">
        <div class="display_flex">
          <div>选择仓库：</div>
          <Select style="width:300px" @on-change='selectStock'>
            <Option v-for="item in stockList" :value="item.objectId" :key="item.objectId">{{ item.stock_name }}</Option>
          </Select>
        </div>

        <Input search enter-button placeholder="请输入产品名字" style="width: 300px;margin-left: 20px;" @on-search="searchGood" />
      </div>

      <div>
        <Table :columns="columns" :data="goods" :loading="loading" ref="table" border :height="screenHeight - 440"
          @on-select="selectGoods" size="small">
        </Table>

        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="10000" :current="pege_number" @on-change="changePage"></Page>
          </div>
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
    props: ['show','type'],
    components: {
      producerS,
      shopS
    },
    data() {
      return {
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
              if(params.row.stocks && params.row.stocks.stock_name){
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

      };
    },

    mounted() {
      that = this;
      window.onresize = () => {
        return (() => {
          that.screenHeight = window.innerHeight;
        })();
      };
    },

    watch: {
      'show': function(newVal) {
        console.log(newVal)
        if(newVal){
          this.get_productList();
        }else{
          that.goods = []
        }
      }
    },

    methods: {
      //取消操作
      outData() {
        this.$emit('cancle', false)
      },

      //选择当前操作返回
      confrimGoods() {
				console.log(that.select_goods)
        this.$emit('confrimGoods', that.select_goods)
      },

      //选择产品
      selectGoods(e) {
        that.select_goods = e
        let index = 0;
        if(that.type == "enter"){
          for (let item of that.select_goods) {
            that.select_goods[index].num = 1;
            that.select_goods[index].total_money = 1 * that.select_goods[index].costPrice;
            that.select_goods[index].really_total_money = 1 * that.select_goods[index].costPrice;
            that.select_goods[index].modify_retailPrice = that.select_goods[index].costPrice;
            index += 1;
          }
        }else{
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
        const query = Bmob.Query('Goods');
        query.equalTo('userId', '==', that.userid);
				query.equalTo("status", "!=", -1);
				query.equalTo("order", "!=", 0);
				if(that.search.stockId)query.equalTo('stocks', '==', that.search.stockId);
        query.include('second_class', 'goodsClass', 'stocks','header')
				const query1 = query.equalTo("goodsName", "==", {
					"$regex": "" + that.search.searchGoodText + ".*"
				});
				const query2 = query.equalTo("packageContent", "==", {
					"$regex": "" + that.search.searchGoodText + ".*"
				});
				query.or(query1, query2);

        query.limit(that.page_size);
        query.skip(that.page_size * (that.pege_number - 1));
        query.order("goodsName"); //按照条件降序
        query.find().then(res => {
          console.log(res);
          for (let item of res) {

            if(that.type !="enter"){
              if (item.reserve <= 0) {
                item._disabled = true
              }
            }

            if(item.order == 1){
              item.packingUnit = item.header.packingUnit || ''
              item.packageContent = item.header.packageContent || ''
            }

            item.class = (item.goodsClass ? (item.goodsClass.class_text || "") : "") + "    " + (item.second_class ?
              (item.second_class.class_text || "") : "")

            /*item.qrcodeImg = jrQrcode.getQrBase64((item.productCode) ? item.productCode : item.objectId + '-' +
              false)
            item.productCode = (item.productCode) ? item.productCode : item.objectId + '-' + false*/

            if (item.models) {
              let count = 0
              for (let model of item.models) {
                model.num = 0
                count += 1
              }
              item.num = count
              item.selected_model = item.models
            }
          }
          this.goods = res;
          this.loading = false;
        });
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
