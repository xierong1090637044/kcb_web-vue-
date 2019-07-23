import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import common from '@/serve/common.js';

import landing from '@/components/landing'
import home from '@/components/home'
import index from '@/components/index'
import test from '@/components/test'
import goods from '@/components/goods'
import add_good from '@/components/goods/addgood'
import operations from '@/components/operations'


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
				  path: 'add_good',
				  name: 'add_good',
				  component: add_good
				}
      ]
		}
    
  ]
})
