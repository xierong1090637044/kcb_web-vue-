import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import common from '@/serve/common.js';
import expandRow from '@/components/component/expandRow.vue';

import landing from '@/components/landing'
import home from '@/components/home'
import index from '@/components/index' //首页
import test from '@/components/test'  //样板页面
import goods from '@/components/goods' //产品添加页面
import add_good from '@/components/goods/addgood'//添加产品页面
import operations from '@/components/operations' //操作记录页面
import download from '@/components/download'; // app下载页面
import category from '@/components/manage/category'; // 类别管理页面


Bmob.initialize("afaa8342776ad99ff0d49bca224de9b2", "9eed865dc5914f2ecedcd63be31e33e9","47f76baf4ee4d90630d7b2bc17f7505c");

Vue.use(Router)
Vue.use(iView)

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
          path: 'index',
          name: 'index',
          component: index
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
				  path: 'add_good',
				  name: 'add_good',
				  component: add_good
				},
				{
				  path: 'manage/category',
				  name: 'category',
				  component: category
				}
      ]
		}
    
  ]
})
