import Vue from 'vue'
import Router from 'vue-router'
import ViewUI from 'view-design';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/all.css';
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
import test from '@/components/test'  //样板页面
import goods from '@/components/goods' //产品添加页面
import operations from '@/components/operations' //操作记录页面
import download from '@/components/download'; // app下载页面
import category from '@/components/manage/category'; // 类别管理页面
import stocks from '@/components/manage/stocks'; // 类别管理页面
import shops from '@/components/manage/shops'; // 门店管理页面
import staffs from '@/components/manage/staffs'; // 员工管理页面
import customs from '@/components/manage/customs'; // 客户管理页面
import producers from '@/components/manage/producers'; // 客户管理页面
import goodEnter from '@/components/goodEnter'; // 入库或采购页面
import goodOut from '@/components/goodOut'; // 出库或销售页面
import updateHistory from '@/components/updateHistroy'; // 出库或销售页面
import Bmob from 'hydrogen-js-sdk'

Bmob.initialize("825b954fe97e9186", "109063","47f76baf4ee4d90630d7b2bc17f7505c");

Vue.use(Bmob)
Vue.use(Router)
Vue.use(ViewUI)
Vue.use(Print);

export default new Router({
  routes: [
		{
		  path: '/',
		  name: 'landing',
		  component: landing
		},
		{
		  path: '/home/',
		  name: 'home',
		  component: home,
			children: [
        {
          path: 'goodEnter',
          name: 'goodEnter',
          component: goodEnter
        },
        {
          path: 'goodOut',
          name: 'goodOut',
          component: goodOut
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
        }
      ]
		}

  ]
})
