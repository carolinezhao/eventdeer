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
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: (to, from, next) => { // 路由独享守卫
        let currentUser = AV.User.current()
        if (currentUser) { // 已登录后再去登录页，跳转至首页
          console.log('已登录，不能跳转 login')
          next('/home')
        } else {
          next()
        }
      }
    },
    {
      path: '/home',
      component: Home,
      meta: {
        requiresAuth: true
      },
      children: [ // 嵌套路由
        { // default child route
          path: '',
          name: 'dashboard',
          component: Dashboard
        },
        {
          path: 'course', // 相对路径
          component: Course
        },
        {
          path: 'event',
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
  // console.log(to)
  // console.log(from)

  // 目标路由匹配到的所有路由记录都在 matched 数组中，遍历 meta 字段是否要求权限
  let requiresAuth = to.matched.some(
    record => record.meta.requiresAuth
  )
  if (requiresAuth && !currentUser) { // 要权限，未登录
    next('/login')
  } else {
    if (currentUser) {
      console.log('已登录: ' + currentUser.attributes.username)
    }
    next()
  }
})
