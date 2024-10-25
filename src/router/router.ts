// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

// declare module 'vue-router' {
//   interface _RouteRecordBase {
//     hidden?: boolean | string | number
//   }
// }

const routes: RouteRecordRaw[] = [
  // {
  //   path: '/',
  //   redirect: 'home'
  // },
  /* 登陆页面 */
  // {
  //   path: '/login',
  //   name: 'login',
  //   meta: {
  //     hidden: true
  //   },
  //   component: () => import('@/views/login/index.vue')
  // },
  // {
  //   path: '/register',
  //   name: 'register',
  //   meta: {
  //     hidden: true
  //   },
  //   component: () => import('@/views/login/register.vue')
  // },
  // {
  //   path: '/password',
  //   name: 'resetpassword',
  //   meta: {
  //     hidden: true
  //   },
  //   component: () => import('@/views/login/resetPassword.vue')
  // },
  /* layout 页面 */
  {
    path: '/home/index',
    redirect: '/'
  },
  {
    path: '/',
    name: 'Home',
    component: Layout,
    // redirect: '/home/index',
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          icon: 'House'
        }
      }
    ]
  },
  // 产品详情页面
  {
    path: '/productDetail/:id(\\d+)',
    name: 'ProductDetail',
    component: Layout,
    redirect: '/productDetail/:id(\\d+)',
    children: [
      {
        path: '',
        name: 'ProductDetailIndex',
        component: () => import('@/views/productDetail/index.vue'),
        meta: {
          title: '产品详情页',
          icon: 'House'
        }
      }
    ]
  },
  // 产品详情页面v2
  {
    path: '/productDetail/v2/:gid',
    name: 'ProductDetailV2',
    component: Layout,
    redirect: '/productDetail/v2/:gid',
    children: [
      {
        path: '',
        name: 'ProductDetailIndexV2',
        component: () => import('@/views/productDetail/indexV2.vue'),
        meta: {
          title: '产品详情页',
          icon: 'House'
        }
      }
    ]
  },
  // 搜索详情页面
  {
    path: '/searchDetail',
    name: 'SearchDetail',
    component: Layout,
    redirect: '/searchDetail/index',
    children: [
      {
        path: 'index',
        name: 'SearchDetail',
        component: () => import('@/views/searchDetail/index.vue'),
        meta: {
          title: '搜索详情页',
          icon: 'House'
        }
      }
    ]
  },
  // 热搜详情页
  {
    path: '/hotProducts',
    name: 'HotProducts',
    component: Layout,
    redirect: '/hotProducts/index',
    children: [
      {
        path: 'index',
        name: 'HotProducts',
        component: () => import('@/views/hotProducts/index.vue'),
        meta: {
          title: '爆款详情页',
          icon: 'House'
        }
      }
    ]
  },
  // pod产品列表
  {
    path: '/podlist',
    name: 'podlist',
    redirect: '/podlist/index',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'podIndex',
        component: () => import('@/views/pod/podProduct/index.vue'),
        meta: {
          title: 'pod产品页面',
          icon: 'House'
        }
      }
    ]
  },
  {
    path: '/podlist2',
    name: 'podlist2',
    redirect: '/podlist2/index',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'podIndex2',
        component: () => import('@/views/pod/podProduct/index.vue'),
        meta: {
          title: 'pod产品测试页面',
          icon: 'House'
        }
      }
    ]
  },
  {
    path: '/preview',
    name: 'previewPod',
    component: () => import('@/views/pod/preview/index.vue')
    // redirect:'pod/preview/index'
  },
  {
    path: '/pod',
    name: 'Pod',
    // component: Layout,
    redirect: '/pod/index',
    children: [
      {
        path: 'index',
        name: 'Pod',
        component: () => import('@/views/pod/index.vue'),
        meta: {
          title: 'Product editor',
          icon: 'House'
        }
      }
    ]
  },
  // 帮助中心
  {
    path: '/helpCenter',
    name: 'helpCenter',
    component: Layout,
    redirect: '/helpCenter/index',
    children: [
      {
        path: 'index',
        name: 'helpCenter',
        component: () => import('@/views/helpCenter/index.vue'),
        meta: {
          title: 'Help center',
          icon: 'House'
        }
      }
    ]
  },
  /* 404页面 */
  {
    path: '/:pathMatch(.*)*',
    meta: {
      hidden: true
    },
    name: 'not-found',
    component: () => import('@/views/error/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
