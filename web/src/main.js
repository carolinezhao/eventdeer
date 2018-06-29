// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {
  APP_ID,
  APP_KEY
} from './config.js'

// LeanCloud SDK
const AV = require('leancloud-storage')

// 初始化
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
})

Vue.config.productionTip = false
// 全局
Vue.prototype.$AV = AV

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
