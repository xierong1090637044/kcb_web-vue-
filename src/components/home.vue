<template>
  <div class="layout" :style="{height:screenHeight+'px'}">
    <Layout>
      <Header>
        <div class="display_flex_bet">
          <div class="display_flex">
            <img src="@/assets/logo.png" class="headerIcon" />
            <div class="layout-logo">库存管理V 1.0.0</div>
          </div>
          <div class="display_flex" style="color: #fff;">
            <MenuItem name="5" to='/home/updateHistory' style="margin-right: 1.875rem;">
            <Icon type="md-color-palette" size="24" />历史更新
            </MenuItem>

            <div style="margin-right: 1.875rem;"  @click="loginOut">
             <a style="color: #fff;">
               <Icon type="ios-log-out" size="24" />退出登录
             </a>

            </div>

            <MenuItem name="4">
            <Avatar :src="user.avatarUrl" />
            <span>{{user.nickName}}</span>
            </MenuItem>
          </div>
        </div>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{height:screenHeight - 64+'px'}" style="overflow-y: scroll;">
          <Menu theme="light" width="auto">

            <MenuItem name="1" to='/home/index'>
            <div class="display_flex">
              <Icon type="ios-home" style="font-size: 20px;" />
              <div style="margin-left: 10px;margin-top: 4px;">首页</div>
            </div>
            </MenuItem>

            <Submenu name="6">
              <template slot="title">
                <i class="iconfont  icon-fq_zhibaoshu" style="font-size: 20px;"></i>
                资料
              </template>
               <MenuItem name="2-7" to='/home/manage/goods'>产品管理</MenuItem>
              <MenuItem name="2-1" to='/home/manage/category'>产品类别管理</MenuItem>
              <MenuItem name="2-2" to='/home/manage/stocks'>仓库管理</MenuItem>
              <!--<MenuItem name="2-3" to='/home/manage/shops'>门店管理</MenuItem>-->
              <MenuItem name="2-4" to='/home/manage/staffs'>员工管理</MenuItem>
              <MenuItem name="2-5" to='/home/manage/customs'>客户管理</MenuItem>
              <MenuItem name="2-6" to='/home/manage/producers'>供应商管理</MenuItem>
            </Submenu>

            <Submenu name="7">
              <template slot="title">
                <i class="iconfont  icon-pandian" style="font-size: 18px;"></i>
                库存
              </template>
              <MenuItem name="7-1" to='/home/stock/goodEnter'>产品入库</MenuItem>
              <MenuItem name="7-2" to='/home/stock/goodOut'>产品出库</MenuItem>
              <MenuItem name="7-3" to='/home/stock/goodAllocation'>产品调拨</MenuItem>
              <MenuItem name="7-4" to='/home/stock/goodCount'>产品盘点</MenuItem>
            </Submenu>

            <Submenu name="2">
              <template slot="title">
                <i class="iconfont  icon-navicon-cgdd" style="font-size: 20px;"></i>
                采购
              </template>
              <MenuItem name="2-1" to='/home/stock/goodEnterPurchase'>采购入库</MenuItem>
							<MenuItem name="2-2" to='/home/stock/goodEnterPurchaseReturn'>采购退货</MenuItem>
            </Submenu>

            <Submenu name="3">
              <template slot="title">
                <i class="iconfont  icon-navicon-xsckd" style="font-size: 20px;"></i>
                销售
              </template>
              <MenuItem name="3-1" to='/home/stock/goodOutBuy'>销售出库</MenuItem>
							<MenuItem name="3-2" to='/home/stock/goodOutBuyReturn'>销售退货</MenuItem>
            </Submenu>

            <Submenu name="8">
              <template slot="title">
                <i class="iconfont  icon-zijinzhanghu" style="font-size: 20px;"></i>财务
              </template>
              <!--<MenuItem name="8-4" to='/home/finance/financeCustomIn'>应收账款</MenuItem>-->
              <MenuItem name="8-1" to='/home/finance/financeLsit'>我的账户</MenuItem>
            	<MenuItem name="8-2" to='/home/finance/financeInClass'>收入类别</MenuItem>
              <MenuItem name="8-3" to='/home/finance/financeOutClass'>支出类别</MenuItem>
            </Submenu>
            <Submenu name="10">
              <template slot="title">
                <i class="iconfont  icon-yuangong" style="font-size: 20px;"></i>人事
              </template>
              <MenuItem name="10-1" to='/home/staff/staffManage'>员工管理</MenuItem>
              <!--<MenuItem name="10-1" to='/home/staff/staffManage'>员工薪资设置</MenuItem>-->
            </Submenu>

            <Submenu name="9">
              <template slot="title">
                <i class="iconfont  icon-fq_kucunfeiyong" style="font-size: 20px;"></i>订货
              </template>
              <MenuItem name="9-1" to='/home/onlineShop/goodClass'>线上展示类别</MenuItem>
              <MenuItem name="9-2" to='/home/onlineShop/goodManage'>商品管理</MenuItem>
            </Submenu>

						<Submenu name="5">
						  <template slot="title">
						    <i class="iconfont  icon-riqi" style="font-size: 20px;"></i>
						    记录
						  </template>
						  <MenuItem name="5-1" to='/home/orders/stockOrdersIn?type=1&extra_type=2'>入库记录</MenuItem>
							<MenuItem name="5-2" to='/home/orders/stockOrdersOut?type=-1&extra_type=2'>出库记录</MenuItem>
							<MenuItem name="5-3" to='/home/orders/stockOrdersAllocation?type=-2'>调拨记录</MenuItem>
							<MenuItem name="5-4" to='/home/orders/stockOrdersCount?type=3'>盘点记录</MenuItem>
              <MenuItem name="5-5" to='/home/orders/goodPurchaseLaterOrders'>采购订单记录</MenuItem>
							<MenuItem name="5-6" to='/home/orders/goodPurchaseOrders'>采购记录</MenuItem>
							<MenuItem name="5-7" to='/home/orders/goodPurchaseReturnOrders'>采购退货记录</MenuItem>
              <MenuItem name="5-8" to='/home/orders/goodBuyLaterOrders'>销售订单记录</MenuItem>
							<MenuItem name="5-9" to='/home/orders/goodBuyOrders'>销售记录</MenuItem>
							<MenuItem name="5-10" to='/home/orders/goodBuyOrdersReturn'>销售退货记录</MenuItem>
						</Submenu>


          </Menu>
        </Sider>
        <Layout :style="{height:screenHeight - 64+'px',background:'#f3f3f4'}">
          <Content style="padding: 20px 20px 20px 0;">
            <router-view></router-view>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>
<script>
  export default {


    data() {
      return {
        user: JSON.parse(localStorage.getItem('user')),
        screenHeight: window.innerHeight,
      }
    },

    mounted() {
      const that = this;
      window.onresize = () => {
        return (() => {
          that.screenHeight = window.innerHeight
        })()
      }
    },

    methods: {

      loginOut(){
        localStorage.removeItem('bmob')
        localStorage.removeItem('stocks')
        localStorage.removeItem('frist_class')
        this.$router.push({
          path: '/'
        })
      },
    },

  }
</script>
<style>
  .layout-nav {
    width: 600px !important;
    text-align: right !important;
  }

  .ivu-layout-sider {
    background: #426ab3 !important;
  }

  .ivu-menu {
    background: #426ab3 !important;
    color: #fff !important;
  }

  .ivu-layout-header {
    background: #426ab3 !important;
  }

  .layout {
    border: 1px solid #d7dde4;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }

  .layout-logo {
    color: #fff;
    font-weight: bold;
    font-size: 0.875rem;
  }

  .headerIcon {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    margin-right: 1.25rem;
  }

  .layout-nav {
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
  }

  .display_flex {
    display: flex;
    align-items: center;
  }
</style>
