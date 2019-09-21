import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'


import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import 'font-awesome/scss/font-awesome.scss';

import * as Api from './api' 
import i18n from './lang'
import * as perm from './permission'
import './utils/constant'
import Icon from 'vue2-svg-icon/Icon.vue'



Vue.config.productionTip = false


Vue.use(ElementUI,{
  i18n: (key, value) => i18n.t(key, value)
});
Vue.component('icon', Icon);


//const router = new VueRouter({mode: 'history',routes: routes});
Vue.prototype.Api = Api;
Vue.prototype.hasPermission = params => perm.hasPermission(params) 

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
});
