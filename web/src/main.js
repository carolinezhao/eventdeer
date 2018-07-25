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

// 全局
Vue.prototype.$AV = AV

// dialog
class Dialog {
  constructor () {
    this.util = {}
  }
  confirm (util = {}) {
    return new Promise((resolve, reject) => {
      // util.id = 'dialog.' + Date.now()
      util.promiseResolver = resolve
      util.promiseRejecter = reject
      this.util = util
      // console.log(util)
    })
  }
}

Vue.dialog = new Dialog(Vue, {})

Object.defineProperties(Vue.prototype, {
  $dialog: {
    get () {
      return Vue.dialog
    }
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
