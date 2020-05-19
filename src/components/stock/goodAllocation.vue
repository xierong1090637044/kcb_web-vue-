<template>
  <div>
    <div style="margin-bottom: 10px;">
      <Breadcrumb separator="<b style='color: #999;'>/</b>">
        <BreadcrumbItem to="/">首页</BreadcrumbItem>
        <BreadcrumbItem to="/home/goods">产品调拨</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div style="background: #FFFFFF;padding: 1.25rem 1.25rem 0;">

      <div class="orderTitle">调拨单</div>
      <div class="display_flex" style="margin-bottom: 1.875rem;">

        <div class="tableEle">
          <div class="tableRightEle">调入仓库<span style="color: #f30;">*</span></div>
          <Input v-model="formItem.inStock.stock_name" placeholder="请选择调入仓库" @on-focus="chooseStockClick = true;stockType='in'"></Input>
        </div>

        <div class="tableEle">
          <div class="tableRightEle">调出仓库<span style="color: #f30;">*</span></div>
          <Input v-model="formItem.outStock.stock_name" placeholder="请选择调出仓库" @on-focus="chooseStockClick = true;stockType='out'"></Input>
        </div>

        <div class="tableEle">
          <div class="tableRightEle">调拨日期</div>
          <DatePicker type="datetime" placeholder="请选择入库日期" v-model="formItem.date" format="yyyy-MM-dd HH:mm:ss"></DatePicker>
        </div>
      </div>

      <Table :columns="columns" :data="selectGoods" ref="table" border :height="screenHeight - 540" size="small">
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
              <InputNumber placeholder="请输入数量" size="small" @on-focus="selectIndex = index" v-if="row.goodsName" :value="key== 0?1:0"
                :min="1" @on-change="handleModelNumChange($event, index,key,model)"></InputNumber>
            </div>
          </div>
          <div v-else>
            <InputNumber placeholder="请输入数量" size="small" @on-focus="selectIndex = index" v-if="row.goodsName" :min="1"
              @on-change="modify_num($event, index)"></InputNumber>
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <ButtonGroup>
            <Button icon="md-add" @click="addSelectGoods"></Button>
            <Button icon="md-close" @click="reduceSelectGoods(index)"></Button>
          </ButtonGroup>
        </template>
      </Table>

      <div style="display: flex;margin-top: 1.875rem;">
        <div style="display: flex;margin-right: 1.25rem;">
          <div class="tableRightEle">备注</div>
          <Input v-model="formItem.beizhu" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </div>

        <div style="display: flex;">
          <div class="tableRightEle">凭证图</div>
          <uploadImg @selectImg="selectImg"></uploadImg>
        </div>
      </div>

      <div style="text-align: center;padding:1.25rem 0;">
        <Button type="primary" @click="handleSubmit(2)" :disabled="button_disabled">确定调拨</Button>
      </div>

    </div>

    <!--选择产品模板-->
    <goodsS :show="goodsShow" @cancle="goodsShow = false" @confrimGoods="confrimSelectGoods" type="allocation"
      :thisSelectGoods="selectGoods"></goodsS>
    <stocksS @cancle="chooseStockClick = false" @confrim="selectStcok" v-if="chooseStockClick"></stocksS>
  </div>
</template>
<script>
  import goodsS from '@/components/component/goodsS.vue';
  import stocksS from '@/components/component/stocksS.vue';
  import uploadImg from '@/components/component/uploadImg.vue';

  import send_temp from '@/serve/send_temp.js';
  import common from '@/serve/common.js';
  import goods from '@/serve/goods.js';

  let that;
  let shouldProducts = [];
  export default {
    components: {
      uploadImg,
      goodsS,
      stocksS,
    },
    data() {
      return {
        chooseStockClick: false, //选择仓库点击
        button_disabled: false,
        stockShow: false,
        goodsShow: false,
        stockType: '',
        formItem: {
          all_money: 0,
          real_money: 0,
          real_num: 0, //数量
          beizhu: '', //备注
          Images: [],
          date: common.getDay(0, true, true), //入库日期
          inStock: "",
          outStock: "",
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

      selectStcok(value) {
        if (that.stockType == "in") {
          that.formItem.inStock = value
        } else if (that.stockType == "out") {
          that.formItem.outStock = value
        }
        that.chooseStockClick = false
      },

      showHideFunction() {
        that.button_disabled = false;
        that.$Loading.finish();
        that.$Message.success('调拨成功');
        that.handleData();
      },

      //提交表单
      handleSubmit(type) {

        that.$Loading.start();
        that.button_disabled = true;
        let uid = localStorage.getItem('uid')
        let selectGoods = []
        for (let item of that.selectGoods) {
          if (item.goodsName) {
            selectGoods.push(item)
          }
        }
        if (selectGoods.length == 0) {
          that.$Message.error('没有选择入库产品');
          that.button_disabled = false;
          that.$Loading.finish();
          return
        } else if (that.formItem.inStock == "") {
          that.$Message.error('没有选择调入仓库');
          that.button_disabled = false;
          that.$Loading.finish();
          return
        } else {
          that.$http.Post("stock_goodAllocation", {
          	"goods": selectGoods,
          	"beizhu": that.formItem.beizhu,
          	"stockId": that.formItem.inStock.objectId,
          	"stockName": that.formItem.inStock.stock_name,
          	"out_stockId": that.formItem.outStock.objectId,
          	"out_stockName": that.formItem.outStock.stock_name,
          	"Images": that.formItem.Images,
          	"opreater": JSON.parse(localStorage.getItem("user")).objectId,
          	"nowDay": that.formItem.date
          }).then(res => {
          	if (res) {
          		that.button_disabled = false;
          		that.$Loading.finish();
          		that.handleData();

          	}
          })
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
        that.goodsShow = false;
        that.selectGoods = [];
        let count = 0
        for (let item of goods) {
          that.formItem.real_money += Number(item.retailPrice)
          that.formItem.real_num += Number(item.num)
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
          all_money: 0,
          real_money: 0,
          real_num: 0, //数量
          beizhu: '', //备注
          Images: [],
          date: common.getDay(0, true, true), //入库日期
          inStock: "",
          outStock: "",
        }
      },

      reduceSelectGoods(index) {
        console.log(index)
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
