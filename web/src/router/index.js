import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Home from '@/components/Home'
import Course from '@/components/Course'
import Event from '@/components/Event'

Vue.use(Router)

// 路由实例
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children: [ // 嵌套路由
        {
          path: '/home/course',
          component: Course
        },
        {
          path: '/home/event',
          component: Event
        }
      ]
    },
    { // 找不到路径时跳转
      path: '*',
      redirect: '/'
    }
  ]
})
