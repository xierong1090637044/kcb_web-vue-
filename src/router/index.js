import Vue from 'vue'
import Router from 'vue-router'
import ViewUI from 'view-design';
import Element from 'element-ui';
import http from '@/serve/http.js';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/all.css';
import VCharts from 'v-charts'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)
Vue.use(VCharts)
Vue.use(Element);

// import style
import 'view-design/dist/styles/iview.css';
import common from '@/serve/common.js';
import expandRow from '@/components/component/expandRow.vue';
import Print from 'vue-print-nb'

import landing from '@/components/landing'
import home from '@/components/home'
import index from '@/components/index' //首页
import thanks from '@/components/thanks' // 感谢页面
import test from '@/components/test' //样板页面
import goods from '@/components/goods' //产品添加页面
import operations from '@/components/operations' //操作记录页面
import download from '@/components/download'; // app下载页面
import category from '@/components/manage/category'; // 类别管理页面
import stocks from '@/components/manage/stocks'; // 类别管理页面
import shops from '@/components/manage/shops'; // 门店管理页面
import staffs from '@/components/manage/staffs'; // 员工管理页面
import customs from '@/components/manage/customs'; // 客户管理页面
import producers from '@/components/manage/producers'; // 客户管理页面

import goodEnterPurchase from '@/components/goodEnterPurchase'; // 入库或采购页面
import goodOut from '@/components/goodOut'; // 盘点页面
import goodOutBuy from '@/components/goodOutBuy'; // 盘点页面
import goodCount from '@/components/goodCount'; // 出库或销售页面
import goodAllocation from '@/components/goodAllocation'; // 产品调拨

import updateHistory from '@/components/updateHistroy'; // 出库或销售页面

import admin from '@/components/admin/index'; // 管理员页面

import Bmob from 'hydrogen-js-sdk';
Bmob.initialize("825b954fe97e9186", "109063", "47f76baf4ee4d90630d7b2bc17f7505c");

Vue.use(Bmob)
Vue.use(Router)
Vue.use(ViewUI)
Vue.use(Print);
Vue.prototype.$http = http

export default new Router({
  routes: [{
      path: '/',
      name: 'landing',
      component: landing
    },
    {
      path: '/404',
      name: '404',
      component: () => import('@/components/error'), // vue路由懒加载  异步加载
      meta: {
        title: '404',
        requireAuth: false // 只要此字段为true，必须做鉴权处理
      }
    },

    {
      path: '/home/',
      name: 'home',
      component: home,
      children: [{ //财务模块
          path: 'finance/financeLsit',
          name: 'financeLsit',
          component: () => import('@/components/finance/financeLsit'), //财务列表
        },{ //线上商城
          path: 'onlineShop/goodClass',
          name: 'goodClass',
          component: () => import('@/components/onlineShop/goodClass'),
        },{ //线上商城商品管理
          path: 'onlineShop/goodManage',
          name: 'goodManage',
          component: () => import('@/components/onlineShop/goodManage'),
        }, {//库存相关模块
          path: 'stock/goodEnter',
          name: 'goodEnter',
          component: () => import('@/components/stock/goodEnter'),
        },{
          path: 'goodAllocation',
          name: 'goodAllocation',
          component: goodAllocation
        },
        {
          path: 'goodEnterPurchaseReturn',
          name: 'goodEnterPurchaseReturn',
          component: () => import('@/components/goodEnterPurchaseReturn'), // vue路由懒加载  异步加载
          meta: {
            title: '采购退货',
          }
        },
        {
          path: 'goodOutBuyReturn',
          name: 'goodOutBuyReturn',
          component: () => import('@/components/goodOutBuyReturn'), // vue路由懒加载  异步加载
          meta: {
            title: '销售退货',
          }
        },
        {
          path: 'goodCount',
          name: 'goodCount',
          component: goodCount
        },
        
        {
          path: 'goodEnterPurchase',
          name: 'goodEnterPurchase',
          component: goodEnterPurchase
        },
        {
          path: 'goodOut',
          name: 'goodOut',
          component: goodOut
        },
        {
          path: 'goodOutBuy',
          name: 'goodOutBuy',
          component: goodOutBuy
        },
        {
          path: 'index',
          name: 'index',
          component: index
        },
        {
          path: 'thanks',
          name: 'thanks',
          component: thanks
        },
        {
          path: 'test',
          name: 'test',
          component: test
        },
        {
          path: 'goods',
          name: 'goods',
          component: goods
        },
        {
          path: 'operations',
          name: 'operations',
          component: operations
        },
        {
          path: 'download',
          name: 'download',
          component: download
        },
        {
          path: 'manage/category',
          name: 'category',
          component: category
        },
        {
          path: 'manage/stocks',
          name: 'stocks',
          component: stocks
        },
        {
          path: 'manage/shops',
          name: 'shops',
          component: shops
        },
        {
          path: 'manage/staffs',
          name: 'staffs',
          component: staffs
        },
        {
          path: 'manage/customs',
          name: 'customs',
          component: customs
        },
        {
          path: 'manage/producers',
          name: 'producers',
          component: producers
        },
        {
          path: 'updateHistory',
          name: 'updateHistory',
          component: updateHistory
        },
        {
          path: 'admin',
          name: 'admin',
          component: admin
        }
      ]
    },

  ]
})
