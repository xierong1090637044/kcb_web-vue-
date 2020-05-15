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
import JsonExcel from 'vue-json-excel'

Vue.use(VueQuillEditor)
Vue.use(VCharts)
Vue.use(Element);
Vue.component('JsonExcel', JsonExcel)

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

import download from '@/components/download'; // app下载页面
import category from '@/components/manage/category'; // 类别管理页面
import stocks from '@/components/manage/stocks'; // 类别管理页面
import shops from '@/components/manage/shops'; // 门店管理页面
import staffs from '@/components/manage/staffs'; // 员工管理页面
import customs from '@/components/manage/customs'; // 客户管理页面
import producers from '@/components/manage/producers'; // 客户管理页面

import updateHistory from '@/components/updateHistroy'; // 出库或销售页面

import admin from '@/components/admin/index'; // 管理员页面

import Bmob from 'hydrogen-js-sdk';
//Bmob.initialize("db7d7df44b87bb60", "109063","db1c531222c31c7511629dd458a72436");//测试
Bmob.initialize("825b954fe97e9186", "109063", "47f76baf4ee4d90630d7b2bc17f7505c");//正式

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
			children: [{
					path: 'finance/financeLsit',
					name: 'financeLsit',
					component: () => import('@/components/finance/financeLsit'), //财务列表
				}, {
					path: 'finance/financeOutClass',
					name: 'financeOutClass',
					component: () => import('@/components/finance/financeOutClass'), //财务支出类别
				},
        {
        	path: 'finance/financeInClass',
        	name: 'financeInClass',
        	component: () => import('@/components/finance/financeInClass'), //财务支出类别
        },
        {
        	path: 'finance/financeCustomIn',
        	name: 'financeCustomIn',
        	component: () => import('@/components/finance/financeCustomIn'), //应收账款
        },{
        	path: 'finance/financeCustomInOrder',
        	name: 'financeCustomInOrder',
        	component: () => import('@/components/finance/financeCustomInOrder'), //创建应收账款
        },

        {
					path: 'onlineShop/goodClass',
					name: 'goodClass',
					component: () => import('@/components/onlineShop/goodClass'), //线上商城
				},

        {
					path: 'onlineShop/goodManage',
					name: 'goodManage',
					component: () => import('@/components/onlineShop/goodManage'), //线上商城商品管理
				}, {
					path: 'stock/goodEnter',
					name: 'goodEnter',
					component: () => import('@/components/stock/goodEnter'), //产品入库页面
				}, {
					path: 'stock/goodOut',
					name: 'goodOut',
					component: () => import('@/components/stock/goodOut'), //产品出库页面
				}, {
					path: 'stock/goodAllocation',
					name: 'goodAllocation',
					component: () => import('@/components/stock/goodAllocation'), //产品调拨页面
				}, {
					path: 'stock/goodCount',
					name: 'goodCount',
					component: () => import('@/components/stock/goodCount'), //产品盘点页面
				},
				{
					path: 'stock/goodEnterPurchase',
					name: 'goodEnterPurchase',
					component: () => import('@/components/stock/goodEnterPurchase'), //产品采购页面
				},
				{
					path: 'stock/goodEnterPurchaseReturn',
					name: 'goodEnterPurchaseReturn',
					component: () => import('@/components/stock/goodEnterPurchaseReturn'),
				},
				{
					path: 'stock/goodOutBuy',
					name: 'goodOutBuy',
					component: () => import('@/components/stock/goodOutBuy'), //销售出库
				},
				{
					path: 'stock/goodOutBuyReturn',
					name: 'goodOutBuyReturn',
					component: () => import('@/components/stock/goodOutBuyReturn'), //销售退货
				},

        {
        	path: 'staff/staffManage',
        	name: 'staffManage',
        	component: () => import('@/components/staff/staffManage'), //员工管理页面
        },
        {
        	path: 'staff/staffSalarySet',
        	name: 'staffSalarySet',
        	component: () => import('@/components/staff/staffSalarySet'), //员工薪资设置页面
        },

				{
					path: 'orders/stockOrdersIn',
					name: 'stockOrdersIn',
					component: () => import('@/components/orders/stockOrdersIn'), //入库记录
				},
				{
					path: 'orders/stockOrdersOut',
					name: 'stockOrdersOut',
					component: () => import('@/components/orders/stockOrdersOut'), //出库记录
				},
				{
					path: 'orders/stockOrdersCount',
					name: 'stockOrdersCount',
					component: () => import('@/components/orders/stockOrdersCount'), //盘点记录
				},
				{
					path: 'orders/stockOrdersAllocation',
					name: 'stockOrdersAllocation',
					component: () => import('@/components/orders/stockOrdersAllocation'), //调拨记录
				},
        {
        	path: 'orders/goodPurchaseLaterOrders',
        	name: 'goodPurchaseLaterOrders',
        	component: () => import('@/components/orders/goodPurchaseLaterOrders'), //采购订单记录
        },
				{
					path: 'orders/goodPurchaseOrders',
					name: 'goodPurchaseOrders',
					component: () => import('@/components/orders/goodPurchaseOrders'), //采购记录
				},
				{
					path: 'orders/goodPurchaseReturnOrders',
					name: 'goodPurchaseReturnOrders',
					component: () => import('@/components/orders/goodPurchaseReturnOrders'), //采购退货记录
				},
        {
        	path: 'orders/goodBuyLaterOrders',
        	name: 'goodBuyLaterOrders',
        	component: () => import('@/components/orders/goodBuyLaterOrders'), //销售记录
        },
				{
					path: 'orders/goodBuyOrders',
					name: 'goodBuyOrders',
					component: () => import('@/components/orders/goodBuyOrders'), //销售记录
				},
				{
					path: 'orders/goodBuyOrdersReturn',
					name: 'goodBuyOrdersReturn',
					component: () => import('@/components/orders/goodBuyOrdersReturn'), //销售退货记录
				},

        {
        	path: 'manage/goods',
        	name: 'goods',
        	component: () => import('@/components/manage/goods'), //产品管理页面
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
					path: 'download',
					name: 'download',
					component: download
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
