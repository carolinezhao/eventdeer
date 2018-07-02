import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Dashboard from '@/components/Dashboard'
import Course from '@/components/Course'
import Event from '@/components/Event'

const AV = require('leancloud-storage')

Vue.use(Router)

// 路由实例
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: '/login'
    },
    {
      path: '/Login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true
      },
      children: [ // 嵌套路由
        {
          path: '/home/dashboard',
          component: Dashboard
        },
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

export default router

// 全局前置守卫
router.beforeEach((to, from, next) => {
  let currentUser = AV.User.current()
  console.log(currentUser)
  // console.log(to)
  // console.log(from)

  // 目标路由匹配到的所有路由记录都在 matched 数组中，遍历 meta 字段是否要求权限
  let requiresAuth = to.matched.some(
    record => record.meta.requiresAuth
  )
  if (requiresAuth && !currentUser) { // 要权限，未登录
    next('/login')
  } else {
    next()
  }
})
