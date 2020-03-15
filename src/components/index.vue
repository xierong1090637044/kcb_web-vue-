<template>
  <div style="position: relative;">
    <Spin size="large" fix v-if="loading"></Spin>

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

    <!--<Row type="flex" justify="start">
      <Col span="12">
      <Card dis-hover>
        <p slot="title">我的常用模块</p>
        <p slot="extra">
          <Icon type="ios-add-circle" size="24" />
        </p>
        <ul>
        </ul>
      </Card>
      </Col>


      <Col span="11" offset="1">
      <Card dis-hover>
        <p slot="title">我的单据</p>
        <p slot="extra">
          <span style="font-size: 1rem;color: #333;">今日</span>
          <span style="font-size: 1rem;color: #333;">本周</span>
          <span style="font-size: 1rem;color: #333;">本月</span>
          <span style="font-size: 1rem;color: #333;">本年</span>
        </p>
        <ul>
        </ul>
      </Card>
      </Col>
    </Row>-->

  </div>
</template>
<script>
  import common from '@/serve/common.js';
  import record from '@/serve/record.js';

  let that;
  export default {
    data() {
      return {
        loading: true,
        total_reserve: 0,
        total_products: 0,
        total_money: 0,
        todayDet: {},
        now_day: common.getDay(0),
        userid: JSON.parse(localStorage.getItem('user')).objectId || '',
        user: JSON.parse(localStorage.getItem('user')),
      };
    },

    mounted() {
      that = this;
      window.onresize = () => {
        return (() => {
          that.screenHeight = window.innerHeight;
        })();
      };
      this.gettoday_detail();
    },

    methods: {

      //得到今日概况
      gettoday_detail: function() {
        let params = {
          funcName: 'recordToday',
          data: {
            uid: that.userid,
            startTime: common.getDay(0) + " 00:00:01",
            endTime: common.getDay(0) + " 23:59:59"
          }
        }
        Bmob.functions(params.funcName, params.data).then(function(res) {
          that.todayDet = res.data
          that.loadallGoods()
        })
      },

      //得到总库存数和总金额
      loadallGoods: function() {
        let params = {
          funcName: 'stockAll',
          data: {
            uid: that.userid
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

          that.loading = false
        });
      }
    }
  };
</script>

<style>
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
