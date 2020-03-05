import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/welcome/login/index'),
    hidden: true
  },

  {
    path: '/register',
    component: () => import('@/views/welcome/register/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/customer',
    component: Layout,
    redirect: '/customer/table',
    name: 'Customer',
    meta: { title: '客户管理', icon: 'user' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/customer/table/index'),
        meta: { title: '客户列表', icon: 'table' }
      },
      {
        path: 'contact',
        name: 'Contact',
        component: () => import('@/views/customer/contact/index'),
        meta: { title: '联系人列表', icon: 'peoples' }
      },
      {
        path: 'follow',
        name: 'Follow',
        component: () => import('@/views/customer/follow/index'),
        meta: { title: '跟进列表', icon: 'guide' }
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('@/views/customer/orderForm/index'),
        meta: { title: '订单列表', icon: 'form' }
      }
    ]
  },
  {
    path: '/customer',
    component: Layout,
    redirect: '/customer/table',
    name: 'Customer',
    meta: { title: '商业分析', icon: 'user' },
    children: [
      {
        path: 'MixChart',
        name: 'MixChart',
        component: () => import('@/views/analyze/charts/mix-chart'),
        meta: { title: '业绩图表', icon: 'chart' }
      },
      {
        path: 'CustomerMap',
        name: 'MixChart',
        component: () => import('@/views/analyze/bmap/customerMap'),
        meta: { title: '客户地图', icon: 'chart' }
      }
    ]
  },
  {
    path: 'github-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/ChongqingWangYu',
        meta: { title: 'GitHub Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
