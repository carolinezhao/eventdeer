import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Create from '@/components/Create'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/create',
      name: 'Create',
      component: Create
    }
  ]
})
