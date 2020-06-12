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
    component: () => import('@/views/login/index'),
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
      meta: { title: '主页', icon: 'dashboard' }
    }]
  },
  {
    path: '/product',
    component: Layout,
    redirect: '/product/list',
    name: 'product',
    meta: { title: '商品管理', icon: 'product' },
    children: [
      {
        path: 'list',
        name: 'productList',
        component: () => import('@/views/product/index'),
        meta: { title: '商品列表', icon: 'product-list' }
      },
      {
        path: 'edit/:id',
        name: 'productEdit',
        component: () => import('@/views/product/detail/index'),
        meta: { title: '商品编辑', icon: 'table' },
        hidden: true
      },
      {
        path: 'add',
        name: 'productAdd',
        component: () => import('@/views/product/detail/index'),
        meta: { title: '商品添加', icon: 'product-add' }
      },
      {
        path: 'kind',
        name: 'productKind',
        component: () => import('@/views/product/kind/index'),
        meta: { title: '分类管理', icon: 'kind' }
      },
      {
        path: 'brand',
        name: 'productBrand',
        component: () => import('@/views/product/brand/index'),
        meta: { title: '品牌管理', icon: 'brand' }
      },
      {
        path: 'series',
        name: 'series',
        component: () => import('@/views/product/series/index'),
        meta: { title: '系列管理', icon: 'tree' }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/list',
    name: 'order',
    meta: { title: '订单管理', icon: 'order' },
    children: [
      {
        path: 'list',
        name: 'orderList',
        component: () => import('@/views/order/index'),
        meta: { title: '订单管理', icon: 'order-list' }
      },
      {
        path: 'detail/:orderId',
        name: 'orderDetail',
        component: () => import('@/views/order/detail/index'),
        meta: { title: '订单详情', icon: 'table' },
        hidden: true
      },
      {
        path: 'orderBack',
        name: 'orderBack',
        component: () => import('@/views/order/orderBack/index'),
        meta: { title: '退单管理', icon: 'order-back' }
      },
      {
        path: 'orderBack/:backId',
        name: 'orderBackDetail',
        component: () => import('@/views/order/orderBack/detail/index'),
        meta: { title: '退单明细', icon: 'tree' },
        hidden: true
      }
    ]
  },
  {
    path: '/content',
    component: Layout,
    redirect: '/content/img',
    name: 'content',
    meta: { title: '内容管理', icon: 'example' },
    children: [
      {
        path: 'img',
        name: 'contentImg',
        component: () => import('@/views/content/img/index'),
        meta: { title: '素材管理', icon: 'table' }
      },
      {
        path: 'article',
        name: 'article',
        component: () => import('@/views/content/article/index'),
        meta: { title: '文章管理', icon: 'tree' }
      }
    ]
  },
  {
    path: '/saleInfo',
    component: Layout,
    redirect: '/saleInfo/banner',
    name: 'saleInfo',
    meta: { title: '活动管理', icon: 'example' },
    children: [
      {
        path: 'banner',
        name: 'bannerManage',
        component: () => import('@/views/saleInfo/banner/index'),
        meta: { title: 'banner轮播', icon: 'table' }
      },

      {
        path: 'hot',
        name: 'hotManage',
        component: () => import('@/views/saleInfo/hot/index'),
        meta: { title: '最热产品', icon: 'table' }
      },
      {
        path: 'coupon',
        name: 'couponManage',
        component: () => import('@/views/saleInfo/coupon/index'),
        meta: { title: '优惠券', icon: 'table' }
      }
    ]
  },
  {
    path: '/client',
    component: Layout,
    redirect: '/client/clientList',
    name: 'client',
    meta: { title: '客户管理', icon: 'example' },
    children: [
      {
        path: 'clientList',
        name: 'clientList',
        component: () => import('@/views/client/index'),
        meta: { title: '客户列表', icon: 'table' }
      }
    ]
  },
  {
    path: '/auth',
    component: Layout,
    redirect: '/auth/user',
    name: 'auth',
    meta: { title: '权限管理', icon: 'auth' },
    children: [
      {
        path: 'user',
        name: 'authUser',
        component: () => import('@/views/auth/user/index'),
        meta: { title: '账号管理', icon: 'account' }
      },
      {
        path: 'role',
        name: 'authRole',
        component: () => import('@/views/auth/role/index'),
        meta: { title: '角色管理', icon: 'role' }
      },
      {
        path: 'menu',
        name: 'authMenu',
        component: () => import('@/views/auth/menu/index'),
        meta: { title: '菜单管理', icon: 'menu' }
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
