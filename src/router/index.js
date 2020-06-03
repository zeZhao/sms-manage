import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */


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
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
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
    component: () =>
      import ('@/views/login/index'),
    hidden: true,
    meta: {
      title: '短信平台-登录'
    }
  },
  {
    path: '/auth-redirect',
    component: () =>
      import ('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () =>
      import ('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () =>
      import ('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index/index',
    children: [{
      path: '',
      component: () =>
        import ('@/views/index/index'),
      name: 'index',
      meta: {title: '首页', affix: true}
    }]
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/role',
    component: Layout,
    redirect: '/role/index',
    hidden: true,
    alwaysShow: true,
    name: '',
    meta: {
      title: 'WEB账号管理',
    },
    children: [{
      path: '/role/index',
      component: () =>
        import ('@/views/Systemmanagement/role/index'),
      name: 'role',
      meta: {
        keepAlive: true,
        title: '角色管理'
      }
    },
      {
        path: '/nav/index',
        component: () =>
          import ('@/views/Systemmanagement/nav/index'),
        name: 'nav',
        meta: {
          keepAlive: true,
          title: '菜单管理'
        }
      }, {
        path: '/user/index',
        component: () =>
          import ('@/views/Systemmanagement/user/index'),
        name: 'user',
        meta: {
          keepAlive: true,
          title: '运营账号'
        }
      }, {
        path: '/company/index',
        component: () =>
          import ('@/views/Systemmanagement/company/index'),
        name: 'company',
        meta: {
          keepAlive: true,
          title: '商户管理'
        }
      }

    ]
  },
  {
    path: '/enterprise',
    component: Layout,
    redirect: '/enterprise/index',
    hidden: true,
    alwaysShow: true,
    name: '',
    meta: {
      title: '用户管理',
    },
    children: [
      {
        path: '/enterprise/index',
        component: () =>
          import ('@/views/Usermanagement/enterprise/index'),
        name: 'enterprise',
        meta: {
          keepAlive: true,
          title: '企业信息'
        }
      },
      {
        path: '/userManagement/index',
        component: () =>
          import ('@/views/Usermanagement/userManagement/index'),
        name: 'userManagement',
        meta: {
          keepAlive: true,
          title: '用户信息'
        }
      }
    ]
  },
  {
    path: '/ConfigManagement',
    component: Layout,
    redirect: '/ConfigManagement/index',
    hidden: true,
    alwaysShow: true,
    name: '',
    meta: {
      title: '配置管理',
    },
    children: [
      {
        path: '/sysResendConfig/index',
        component: () =>
          import ('@/views/ConfigManagement/sysResendConfig/index'),
        name: 'sysResendConfig',
        meta: {
          keepAlive: true,
          title: '重发通道配置'
        }
      },
      {
        path: '/sysSignRoute/index',
        component: () =>
          import ('@/views/ConfigManagement/sysSignRoute/index'),
        name: 'sysSignRoute',
        meta: {
          keepAlive: true,
          title: '签名路由管理'
        }
      },
      {
        path: '/sysWhitelist/index',
        component: () =>
          import ('@/views/ConfigManagement/sysWhitelist/index'),
        name: 'sysWhitelist',
        meta: {
          keepAlive: true,
          title: '白名单管理'
        }
      },
      {
        path: '/sysSendLimit/index',
        component: () =>
          import ('@/views/ConfigManagement/sysSendLimit/index'),
        name: 'sysSendLimit',
        meta: {
          keepAlive: true,
          title: '发送上限'
        }
      },
      {
        path: '/sysGatewayGroup/index',
        component: () =>
          import ('@/views/ConfigManagement/sysGatewayGroup/index'),
        name: 'sysGatewayGroup',
        meta: {
          keepAlive: true,
          title: '通道组配置'
        }
      },
    ]
  },
  // 404 page must be placed at the end !!!
  {path: '*', redirect: '/404', hidden: true}
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
