<template>
  <div style="position: relative;width: 100%;height: 100%;" class="display_flex_bet">
    <div style="width: 78%;height: 100%;">
      <div style="padding:20px;background: #FFFFFF;border-radius: 8px;">
        <div style="padding:0 0 20px 0;font-size: 16px;font-weight: bold;">库存概况：</div>
        <Row>
          <Col span="7">
          <Card shadow style="background: #4264b3;color: #fff;">
            <p slot="title" style="color:#fff;font-weight: bold;">今日销售详情</p>
            <p>销售笔数：{{todaySellDet.num}}</p>
            <p>销售数量：{{todaySellDet.sellNum}}</p>
            <p>销售额：{{todaySellDet.realMoney}}</p>
            <p>销售毛利：{{todaySellDet.profit}}</p>
          </Card>
          </Col>
          <Col span="7" offset="1">
          <Card shadow style="background: #5fb342;color: #fff;">
            <p slot="title" style="color:#fff;font-weight: bold;">今日采购详情</p>
            <p>采购笔数：{{todayPurchaseDet.num}}</p>
            <p>采购数量：{{todayPurchaseDet.purchaseNum}}</p>
            <p>采购额：{{todayPurchaseDet.realMoney}}</p>
            <p></p>
          </Card>
          </Col>
          <Col span="7" offset="1">
          <Card shadow style="background: #b34262;color: #fff;">
            <p slot="title" style="color:#fff;font-weight: bold;">库存详情</p>
            <p>库存总量：{{stockDet.total_reserve}}</p>
            <p>库存成本：{{stockDet.total_money}}</p>
            <p>库存种类：{{stockDet.length}}</p>
          </Card>
          </Col>
        </Row>
      </div>

      <div style="margin-top: 10px;">
        <Row type="flex" justify="start">
          <Col span="11">
          <Card dis-hover style="border-radius: 8px;">
            <p slot="title" style="font-weight: bold;">资产情况</p>
            <div>
              <ve-ring :series="chartSeries" height="300px" :judgeWidth="true"></ve-ring>
            </div>
          </Card>
          </Col>

          <Col span="12" offset="1">
          <Card dis-hover>
            <p slot="title" style="font-weight: bold;">现金流趋势</p>
            <div>
              <ve-line :data="moneyLineChartData" :extend="extend" height="300px" :judgeWidth="true"></ve-line>
            </div>
          </Card>
          </Col>
        </Row>
      </div>

      <div style="margin-top: 10px;">
        <Row type="flex" justify="start">
          <Col span="11">
          <Card dis-hover style="border-radius: 8px;">
            <p slot="title" style="font-weight: bold;">客户欠款</p>
            <div>
              <ve-bar :data="CustomBarChartData"height="200px" :judgeWidth="true"></ve-bar>
            </div>
          </Card>
          </Col>
          <Col span="12" offset="1">
          <Card dis-hover>
            <p slot="title" style="font-weight: bold;">库存分布</p>
            <div>
              <!--<ve-ring :series="chartSeries" height="300px" :judgeWidth="true"></ve-ring>-->
              <div>敬请期待</div>
            </div>
          </Card>
          </Col>
        </Row>
      </div>

      <div style="margin-top: 10px;">
        <Row type="flex" justify="start">
          <Col span="11">
          <Card dis-hover style="border-radius: 8px;">
            <p slot="title" style="font-weight: bold;">员工业绩</p>
            <div>
              <ve-bar :data="StaffBarChartData" height="200px" :judgeWidth="true"></ve-bar>
            </div>
          </Card>
          </Col>
          <Col span="12" offset="1">
          <Card dis-hover>
            <p slot="title" style="font-weight: bold;">商品分析</p>
            <div class="display_flex_bet" style="text-align: center;height: 200px;">
              <div style="width: 50%;border-right: 1px solid#ddd;height: 100%;display: flex;flex-flow: column;align-items: flex-start;justify-content: center;">
                <div style="width: 100%;font-size: 18px;font-weight: bold;">全部商品</div>
                <div style="width: 100%;font-size: 24px;font-weight: bold;color: #cb321a;">{{stockCountDet.totalNum}}</div>
              </div>
              <div style="width: 50%;height: 100%;">
                <div style="height: 50%;display: flex;flex-flow: column;align-items: flex-start;justify-content: center;border-bottom: 1px solid#ddd;">
                  <div style="width: 100%;font-size: 18px;font-weight: bold;">预警产品</div>
                  <div style="width: 100%;font-size: 24px;font-weight: bold;color: #cb321a;">{{stockCountDet.warnNum}}</div>
                </div>
                <div style="height: 50%;display: flex;flex-flow: column;align-items: flex-start;justify-content: center;">
                  <div style="width: 100%;font-size: 18px;font-weight: bold;">超储产品</div>
                  <div style="width: 100%;font-size: 24px;font-weight: bold;color: #cb321a;">{{stockCountDet.overNum}}</div>
                </div>
              </div>
            </div>
          </Card>
          </Col>
        </Row>
      </div>


    </div>

    <!--右边部分-->
    <div style="width: 20%;height: 100%;">
      <!--公告部分-->
      <Card>
        <p slot="title" style="font-weight: bold;">微信提醒服务</p>
        <div class="display_flex_bet">
          <div>微信扫码关注公众号，可获得消息通知功能以及线上订货服务</div>
          <img src="../assets/qrcode_for_gh_6beb4a0c5d00_258.jpg" style="width: 100px;height: 100px;"/>
        </div>
      </Card>
    </div>


  </div>
</template>
<script>
  import common from '@/serve/common.js';
  import record from '@/serve/record.js';

  let that;
  export default {

    data() {

      this.extend = {
        'xAxis.0.axisLabel.rotate': 45
      }
      return {
        loading: true,
        todaySellDet: {},//今日销售详情
        todayPurchaseDet: {},//今日采购详情
        stockDet: {}, //库存详情
        stockCountDet:{},//库存分布
        moneyLineChartData: {
          columns: ['日期', '收入金额', '支出金额'],
          rows: []
        }, //现金流趋势
        CustomBarChartData:{
          columns: ['客户', '欠款金额'],
          rows: []
        },
        StaffBarChartData:{
          columns: ['员工', '销售额'],
          rows: []
        },

        chartSeries: {
          type: "pie",
          radius: ['30%', '65%'],
          label: {
            formatter: '{b|{b}}\n  {c}  {per|{d}%}  ',
            backgroundColor: '#fafafa',
            borderColor: '#fafafa',
            borderWidth: 1,
            borderRadius: 4,
            rich: {
              b: {
                fontSize: 12,
                lineHeight: 33,
                align: 'center'
              },
              per: {
                color: '#eee',
                backgroundColor: '#334455',
                padding: [2, 4],
                lineHeight: 33,
                borderRadius: 2
              }
            }
          },
          data: ''
        },
        noticeList: [],
        noticePageNum: 1,
      };
    },

    mounted() {
      that = this;
      that.$store.state.userid = JSON.parse(localStorage.getItem('user')).objectId;
      that.$store.state.user = JSON.parse(localStorage.getItem('user'));
      that.getTodaySellDetail();
    },

    methods: {

      //得到今日销售概况
      getTodaySellDetail: function() {
        that.$http.Post("record_todaySellNew", {
          startTime: common.getDay(0) + " 00:00:01",
          endTime: common.getDay(0) + " 23:59:59"
        }).then(res => {
          that.todaySellDet = res.data
          that.loadallGoods()
          that.getTodayPurchaseDetail()
          that.getCustomDetBarChartl()
          //that.getStockPieChart()
          that.getStaffDetBarChart()
          that.getStockDet()
        })
      },

      //得到今日采购概况
      getTodayPurchaseDetail: function() {
        that.$http.Post("record_todayPurchaseNew", {
          startTime: common.getDay(0) + " 00:00:01",
          endTime: common.getDay(0) + " 23:59:59"
        }).then(res => {
          that.todayPurchaseDet = res.data
        })
      },

      //得到商品分析
      getStockDet: function() {
        that.$http.Post("record_goodStockDet", {}).then(res => {
          that.stockCountDet = res.data
          //that.StaffBarChartData.rows = res.data
          //console.log(res)
        })
      },

      //得到员工销售数据
      getStaffDetBarChart: function() {
        let Day = new Date()
        let now_month = Day.getMonth() + 1 < 10 ? '0' + (Day.getMonth() + 1) : Day.getMonth() + 1
        let now_year = Day.getFullYear();
        that.$http.Post("record_staffPieChart", {
          year: now_year,
          month: now_month
        }).then(res => {
          that.StaffBarChartData.rows = res.data
          //console.log(res)
        })
      },

      //得到客户欠款数据
      getCustomDetBarChartl: function() {
        that.$http.Post("record_customDetBarChart", {}).then(res => {
          that.CustomBarChartData.rows = res.data
          //console.log(res)
        })
      },

      //得到库存分布数据
      /*getStockPieChart: function() {
        that.$http.Post("record_stockPieChart", {}).then(res => {
          //that.CustomBarChartData.rows = res.data
          //console.log(res)
        })
      },*/

      //得到资产详情
      getMoneyDesc() {
        that.$http.Post("record_moneyDesc", {}).then(res => {
          let array = []

          if (res.data.accountMoney >= 0) {
            let arrayItem = {}
            arrayItem.name = "账户余额"
            arrayItem.value = res.data.accountMoney
            array.push(arrayItem)
          }
          if (res.data.stockMoney >= 0) {
            let arrayItem = {}
            arrayItem.name = "库存余额"
            arrayItem.value = res.data.stockMoney
            array.push(arrayItem)
          }
          if (res.data.shouldHaveMoney >= 0) {
            let arrayItem = {}
            arrayItem.name = "应收账款"
            arrayItem.value = res.data.shouldHaveMoney
            array.push(arrayItem)
          }
          if (res.data.shouldOutMoney >= 0) {
            let arrayItem = {}
            arrayItem.name = "应付账款"
            arrayItem.value = res.data.shouldOutMoney
            array.push(arrayItem)
          }

          console.log(array)
          that.chartSeries.data = array
        })
      },

      //得到总库存数和总金额
      loadallGoods: function() {
        that.$http.Post("stockAll", {}).then(res => {
          let result = res.data
          if (that.$store.state.user.rights && that.$store.state.user.rights.othercurrent[0] != '0') {
            result.total_money = 0
          }
          that.stockDet = result
          that.getMoneyDesc()
          that.loadMoneyLineChart()
          //that.loadReserveChart()
          //that.loading = false
        })
      },

      //得到现金趋势
      loadMoneyLineChart: function() {
        let Day = new Date()
        let now_month = Day.getMonth() + 1 < 10 ? '0' + (Day.getMonth() + 1) : Day.getMonth() + 1
        let now_year = Day.getFullYear();
        that.$http.Post("record_moneyLineChart", {
          year: now_year,
          month: now_month
        }).then(res => {
          that.moneyLineChartData.rows = res.data.outChart
        })
      },

      /*noticeBack() {
        if (that.noticePageNum == 1) {
          return
        } else {
          that.noticePageNum -= 1
          that.getNoticeList()
        }
      },

      noticeNext() {
        that.noticePageNum += 1
        that.getNoticeList()
      },

      //得到公告列表
      getNoticeList() {
        let params = {
          funcName: 'indexNotice',
          data: {
            pageNum: that.noticePageNum
          }
        }
        Bmob.functions(params.funcName, params.data).then(function(res) {
          that.noticeList = res
          console.log("公告列表", that.noticeList)
        })
      },*/

    }
  };
</script>

<style>
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }


  .custom-tooltip {
    width: 100% !important;
    height: 10% !important;
    position: absolute;
    top: 0px;
    left: 0px
  }

  .custom-tooltip-item {
    width: 150px;
    height: 50px;
    position: relative;
    float: left;
    margin-left: 20px;
    border-left-style: solid;
    border-left-width: 5px
  }

  .custom-tooltip-item:first-child {
    margin-left: 0
  }

  .custom-tooltip-item-name {
    width: 80%;
    height: 20px;
    position: absolute;
    top: 0px;
    left: 10px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px
  }

  .custom-tooltip-item-value {
    width: 80%;
    height: 30px;
    position: absolute;
    bottom: 0px;
    left: 10px;
    color: #262626;
    font-size: 22px;
    /*font-weight: bold*/
  }
</style>
