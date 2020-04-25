<template>
  <div style="position: relative;width: 100%;height: 100%;" class="display_flex_bet">
    <Spin size="large" fix v-if="loading"></Spin>

    <div style="width: 70%;height: 100%;">
      <div style="padding:20px 0;background: #FFFFFF;">
        <div style="padding:0 0 20px 0;font-size: 16px;font-weight: bold;">库存概况：</div>
        <Row>
          <Col span="5">
          <Card shadow style="background: #2db7f5;color: #fff;">
            <p slot="title" style="color:#fff">今日详情</p>
            <p v-if="todayDet.reserveIn">今日入库：{{todayDet.reserveIn.num}}</p>
            <p v-if="todayDet.reserveOut">今日出库：{{todayDet.reserveOut.num}}</p>
          </Card>
          </Col>
          <Col span="5" offset="2">
          <Card shadow style="background: #ed4014;color: #fff;">
            <p slot="title" style="color:#fff">库存详情</p>
            <p>库存总量：{{total_reserve}}</p>
            <p>库存成本：{{total_money}}</p>
            <p>库存种类：{{total_products}}</p>
          </Card>
          </Col>
        </Row>
      </div>
      <Row type="flex" justify="start">
        <Col span="12">
        <Card dis-hover>
          <p slot="title">当月出入库</p>
          <ve-line :data="chartData" :settings="chartSettings" :judge-width="true"></ve-line>
        </Card>
        </Col>


        <Col span="11" offset="1">
        <Card dis-hover>
          <p slot="title">当月出入库金额</p>
          <ve-line :data="chartData1" :settings="chartSettings" :judge-width="true"></ve-line>
        </Card>
        </Col>
      </Row>
    </div>

    <!--右边部分-->
    <div style="width: 25%;height: 100%;">
      <!--公告部分-->
      <Card>
        <div class="display_flex_bet border_bottom" style="padding-bottom: 0.3125rem;">
          <div slot="title" class="display_flex">
            <img src="@/assets/gonggao.png" style="width: 1.25rem;height: 1.25rem;" />
            <span style="margin-left: 0.3125rem;">公告</span>
          </div>
          <div slot="title" class="display_flex">
            <Icon type="ios-arrow-back" @click="noticeBack" />
            <Icon type="ios-arrow-forward" @click="noticeNext" />
          </div>
        </div>

        <ul style="padding:0.625rem 0.625rem 0;height: 15.625rem;overflow-y: scroll;" class="noticeContent">
          <li v-for="(item,index) in noticeList" :key="index" style="margin-bottom: 0.3125rem;">
            {{index+1}}、{{item.content}}
          </li>
        </ul>
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
      this.chartSettings = {
        xAxisType: 'time'
      }
      return {
        loading: true,
        total_reserve: 0,
        total_products: 0,
        total_money: 0,
        todayDet: {},
        now_day: common.getDay(0),
        userid: JSON.parse(localStorage.getItem('user')).objectId || '',
        user: JSON.parse(localStorage.getItem('user')),
        chartData: {
          columns: ['日期', '出库数量', '入库数量'],
          rows: []
        },
        chartData1: {
          columns: ['日期', '出库金额', '入库金额'],
          rows: []
        },
        noticeList: [],
        noticePageNum: 1,
      };
    },

    mounted() {
      that = this;
      that.$store.state.userid = JSON.parse(localStorage.getItem('user')).objectId;
      this.gettoday_detail();

    },

    methods: {

      //得到今日概况
      gettoday_detail: function() {
        that.$http.Post("recordToday", {
          startTime: common.getDay(0) + " 00:00:01",
          endTime: common.getDay(0) + " 23:59:59"
        }).then(res => {
          console.log(res)
          that.todayDet = res.data
          that.loadallGoods()
        })
      },

      //得到总库存数和总金额
      loadallGoods: function() {
        let params = {
          funcName: 'stockAll',
          data: {
            uid: that.$store.state.userid,
          }
        }
        Bmob.functions(params.funcName, params.data).then(function(res) {
          let result = res.data
          if (that.user.rights && that.user.rights.othercurrent[0] != '0') {
            that.total_money = 0
          } else {
            that.total_money = result.total_money
          }
          that.total_reserve = result.total_reserve
          that.total_products = result.length
          that.loadReserveChart()

          that.loading = false
        });
      },

      loadReserveChart() {
        let Day = new Date()
        let now_month = Day.getMonth() + 1 < 10 ? '0' + (Day.getMonth() + 1) : Day.getMonth() + 1
        let now_year = Day.getFullYear();
        let params = {
          funcName: 'chartOutIn',
          data: {
            uid: that.$store.state.userid,
            year: now_year,
            month: now_month
          }
        }
        Bmob.functions(params.funcName, params.data).then(function(res) {
          let result = res.data.outChart
          that.chartData.rows = result
          that.chartData1.rows = result

          that.getNoticeList()
        });
      },

      noticeBack() {
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
      },

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
