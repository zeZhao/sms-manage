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
export const constantRoutes = [{
    path: '/login',
    component: () =>
      import('@/views/login/index'),
    hidden: true,
    meta: {
      title: '短信平台-登录'
    }
  },
  {
    path: '/auth-redirect',
    component: () =>
      import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () =>
      import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () =>
      import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index/index',
    children: [{
      path: '',
      component: () =>
        import('@/views/index/index'),
      name: 'index',
      meta: {
        title: '首页',
        affix: true,
        breadcrumb: false,
        icon: 'el-icon-s-home'
      }
    }]
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [{
    path: '/role',
    component: Layout,
    redirect: '/role/index',
    hidden: true,
    alwaysShow: true,
    name: '',
    meta: {
      title: 'WEB账号管理',
      icon: "el-icon-s-operation"
    },
    children: [{
        path: '/role/index',
        component: () =>
          import('@/views/Systemmanagement/role/index'),
        name: 'role',
        meta: {
          keepAlive: true,
          title: '角色管理'
        }
      },
      {
        path: '/nav/index',
        component: () =>
          import('@/views/Systemmanagement/nav/index'),
        name: 'nav',
        meta: {
          keepAlive: true,
          title: '菜单管理'
        }
      }, {
        path: '/user/index',
        component: () =>
          import('@/views/Systemmanagement/user/index'),
        name: 'user',
        meta: {
          keepAlive: true,
          title: '运营账号'
        }
      }, {
        path: '/company/index',
        component: () =>
          import('@/views/Systemmanagement/company/index'),
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
      icon: 'el-icon-user-solid'
    },
    children: [{
        path: '/enterprise/index',
        component: () =>
          import('@/views/Usermanagement/enterprise/index'),
        name: 'enterprise',
        meta: {
          keepAlive: true,
          title: '企业信息'
        }
      },
      {
        path: '/userManagement/index',
        component: () =>
          import('@/views/Usermanagement/userManagement/index1'),
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
    children: [{
        path: '/sysResendConfig/index',
        component: () =>
          import('@/views/ConfigManagement/sysResendConfig/index'),
        name: 'sysResendConfig',
        meta: {
          keepAlive: true,
          title: '重发通道配置'
        }
      },
      {
        path: '/sysSignRoute/index',
        component: () =>
          import('@/views/ConfigManagement/sysSignRoute/index'),
        name: 'sysSignRoute',
        meta: {
          keepAlive: true,
          title: '签名路由管理'
        }
      },
      {
        path: '/sysSendLimit/index',
        component: () =>
          import('@/views/ConfigManagement/sysSendLimit/index'),
        name: 'sysSendLimit',
        meta: {
          keepAlive: true,
          title: '发送上限'
        }
      },
      {
        path: '/sysGatewayGroup/index',
        component: () =>
          import('@/views/ConfigManagement/sysGatewayGroup/index'),
        name: 'sysGatewayGroup',
        meta: {
          keepAlive: true,
          title: '通道组配置'
        }
      },
      {
        path: '/sysProvinceRoute/index',
        component: () =>
          import('@/views/ConfigManagement/sysProvinceRoute/index'),
        name: 'sysProvinceRoute',
        meta: {
          keepAlive: true,
          title: '分省路由'
        }
      },
      {
        path: '/sysCustomerChannelStrategy/index',
        component: () =>
          import('@/views/ConfigManagement/sysCustomerChannelStrategy/index'),
        name: 'sysCustomerChannelStrategy',
        meta: {
          keepAlive: true,
          title: '客户通道策略'
        }
      }, {
        path: '/mmsUserGateway/index',
        component: () =>
          import('@/views/ConfigManagement/mmsUserGateway/index'),
        name: 'mmsUserGateway',
        meta: {
          keepAlive: true,
          title: '彩信用户通道配置'
        }
      }, {
        path: '/sysSignCheck/index',
        component: () =>
          import('@/views/ConfigManagement/sysSignCheck/index'),
        name: 'sysSignCheck',
        meta: {
          keepAlive: true,
          title: '签名管理'
        }
      }, {
        path: '/sysSensitiveWord/index',
        component: () =>
          import('@/views/ConfigManagement/sysSensitiveWord/index'),
        name: 'sysSensitiveWord',
        meta: {
          keepAlive: true,
          title: '敏感词'
        }
      }, {
        path: '/sysSensitiveWordGroup/index',
        component: () =>
          import('@/views/ConfigManagement/sysSensitiveWordGroup/index'),
        name: 'sysSensitiveWordGroup',
        meta: {
          keepAlive: true,
          title: '敏感词类别'
        }
      },
      {
        path: '/sysWhitelist/index',
        component: () =>
          import('@/views/ConfigManagement/sysWhitelist/index'),
        name: 'sysWhitelist',
        meta: {
          keepAlive: true,
          title: '白名单管理'
        }
      },
      {
        path: '/sysBlacklist/index',
        component: () =>
          import('@/views/ConfigManagement/sysBlacklist/index'),
        name: 'sysBlacklist',
        meta: {
          keepAlive: true,
          title: '黑名单管理'
        }
      },
      {
        path: '/sysRedList/index',
        component: () =>
          import('@/views/ConfigManagement/sysRedList/index'),
        name: 'sysRedList',
        meta: {
          keepAlive: true,
          title: '红名单管理'
        }
      },
      {
        path: '/sysSecondaryRoute/index',
        component: () =>
          import('@/views/ConfigManagement/sysSecondaryRoute/index'),
        name: 'sysSecondaryRoute',
        meta: {
          keepAlive: true,
          title: '二次路由'
        }
      },
      {
        path: '/sysInterfaceSign/index',
        component: () =>
          import('@/views/ConfigManagement/sysInterfaceSign/index'),
        name: 'sysInterfaceSign',
        meta: {
          keepAlive: true,
          title: '接口加强签名'
        }
      },
      {
        path: '/sysExemptReviewManage/index',
        component: () =>
          import('@/views/ConfigManagement/sysExemptReviewManage/index'),
        name: 'sysExemptReviewManage',
        meta: {
          keepAlive: true,
          title: '免审管理'
        }
      },
    ]
  },
  {
    path: '/FinanceManagement',
    component: Layout,
    redirect: '/corpUserBalance/index',
    hidden: true,
    alwaysShow: true,
    name: 'FinanceManagement',
    meta: {
      title: '配置管理',
    },
    children: [{
        path: '/corpUserBalance/index',
        component: () =>
          import('@/views/FinanceManagement/corpUserBalance/index'),
        name: 'corpUserBalance',
        meta: {
          keepAlive: true,
          title: '用户余额'
        }
      },
      {
        path: '/smsBalanceopt/index',
        component: () =>
          import('@/views/FinanceManagement/smsBalanceopt/index'),
        name: 'smsBalanceopt',
        meta: {
          keepAlive: true,
          title: '余额调整记录'
        }
      },
      {
        path: '/sysCompanyIncome/index',
        component: () =>
          import('@/views/FinanceManagement/sysCompanyIncome/index'),
        name: 'sysCompanyIncome',
        meta: {
          keepAlive: true,
          title: '收入信息'
        }
      },
      {
        path: '/userBalanceDaily/index',
        component: () =>
          import('@/views/FinanceManagement/userBalanceDaily/index'),
        name: 'userBalanceDaily',
        meta: {
          keepAlive: true,
          title: '零点余额'
        }
      },
      {
        path: '/sysPrepaidCard/index',
        component: () =>
          import('@/views/FinanceManagement/sysPrepaidCard/index'),
        name: 'sysPrepaidCard',
        meta: {
          keepAlive: true,
          title: '企业月账单'
        }
      },
      {
        path: '/sysGatewayBill/index',
        component: () =>
          import('@/views/FinanceManagement/sysGatewayBill/index'),
        name: 'sysGatewayBill',
        meta: {
          keepAlive: true,
          title: '通道月账单	'
        }
      },
      {
        path: '/sysUserPrepaidCard/index',
        component: () =>
          import('@/views/FinanceManagement/sysUserPrepaidCard/index'),
        name: 'sysUserPrepaidCard',
        meta: {
          keepAlive: true,
          title: '用户月账单	'
        }
      },
      {
        path: '/userDailyBill/index',
        component: () =>
          import('@/views/FinanceManagement/userDailyBill/index'),
        name: 'userDailyBill',
        meta: {
          keepAlive: true,
          title: '用户日账单	'
        }
      },
      {
        path: '/userMonthlyBill/index',
        component: () =>
          import('@/views/FinanceManagement/userMonthlyBill/index'),
        name: 'userMonthlyBill',
        meta: {
          keepAlive: true,
          title: '用户月账单	'
        }
      },
      {
        path: '/gatewayMonthlyBill/index',
        component: () =>
          import('@/views/FinanceManagement/gatewayMonthlyBill/index'),
        name: 'gatewayMonthlyBill',
        meta: {
          keepAlive: true,
          title: '通道月账单（运营）	'
        }
      },
      {
        path: '/sysRecharge/index',
        component: () =>
          import('@/views/FinanceManagement/sysRecharge/index'),
        name: 'sysRecharge',
        meta: {
          keepAlive: true,
          title: '充值'
        }
      },
      {
        path: '/sysFinancialControl/index',
        component: () =>
          import('@/views/FinanceManagement/sysFinancialControl/index'),
        name: 'sysFinancialControl',
        meta: {
          keepAlive: true,
          title: '财务审核'
        }
      },
      {
        path: '/sysExpensesInfo/index',
        component: () =>
          import('@/views/FinanceManagement/sysExpensesInfo/index'),
        name: 'sysExpensesInfo',
        meta: {
          keepAlive: true,
          title: '支出信息'
        }
      },
    ]
  },
  {
    path: '/Alertmanagement',
    component: Layout,
    redirect: '/sysAlarmMessage/index',
    hidden: true,
    alwaysShow: true,
    name: 'Alertmanagement',
    meta: {
      title: '警报管理',
    },
    children: [{
      path: '/sysAlarmMessage/index',
      component: () =>
        import('@/views/Alertmanagement/sysAlarmMessage/index'),
      name: 'sysAlarmMessage',
      meta: {
        keepAlive: true,
        title: '报警信息'
      }
    }, {
      path: '/sysGatewayAlarm/index',
      component: () =>
        import('@/views/Alertmanagement/sysGatewayAlarm/index'),
      name: 'sysGatewayAlarm',
      meta: {
        keepAlive: true,
        title: '通道警报'
      }
    }, {
      path: '/sysUserAlarm/index',
      component: () =>
        import('@/views/Alertmanagement/sysUserAlarm/index'),
      name: 'sysUserAlarm',
      meta: {
        keepAlive: true,
        title: '用户警报'
      }
    }, {
      path: '/sysAlarmType/index',
      component: () =>
        import('@/views/Alertmanagement/sysAlarmType/index'),
      name: 'sysAlarmType',
      meta: {
        keepAlive: true,
        title: '报警类别'
      }
    }, {
      path: '/sysAlarmMessageStatistics/index',
      component: () =>
        import('@/views/Alertmanagement/sysAlarmMessageStatistics/index'),
      name: 'sysAlarmMessageStatistics',
      meta: {
        keepAlive: true,
        title: '报警信息统计表'
      }
    }, ]
  },
  {
    path: '/SalesManagement',
    component: Layout,
    redirect: '/sysSalesGroup/index',
    hidden: true,
    alwaysShow: true,
    name: 'SalesManagement',
    meta: {
      title: '销售管理',
    },
    children: [{
        path: '/sysSalesGroup/index',
        component: () =>
          import('@/views/SalesManagement/sysSalesGroup/index'),
        name: 'sysSalesGroup',
        meta: {
          keepAlive: true,
          title: '销售组管理'
        }
      },
      {
        path: '/sysSales/index',
        component: () =>
          import('@/views/SalesManagement/sysSales/index'),
        name: 'sysSales',
        meta: {
          keepAlive: true,
          title: '销售员'
        }
      },
    ]
  },
  {
    path: '/QueryAndPivot',
    component: Layout,
    redirect: '/smsCheckMobile/index',
    hidden: true,
    alwaysShow: true,
    name: 'QueryAndPivot',
    meta: {
      title: '数据查询',
    },
    children: [{
        path: '/smsCheckMobile/index',
        component: () =>
          import('@/views/QueryAndPivot/smsCheckMobile/index'),
        name: 'smsCheckMobile',
        meta: {
          keepAlive: true,
          title: '审核号码'
        }
      },
      {
        path: '/smsShortUrl/index',
        component: () =>
          import('@/views/QueryAndPivot/smsShortUrl/index'),
        name: 'smsShortUrl',
        meta: {
          keepAlive: true,
          title: '短连接查询'
        }
      },
      {
        path: '/smsMoQueue/index',
        component: () =>
          import('@/views/QueryAndPivot/smsMoQueue/index'),
        name: 'smsMoQueue',
        meta: {
          keepAlive: true,
          title: '上行信息'
        }
      },
      {
        path: '/smsCheck/index',
        component: () =>
          import('@/views/QueryAndPivot/smsCheck/index'),
        name: 'smsCheck',
        meta: {
          keepAlive: true,
          title: '审核查询'
        }
      },
      {
        path: '/sysTimeTasklist/index',
        component: () =>
          import('@/views/QueryAndPivot/sysTimeTasklist/index'),
        name: 'sysTimeTasklist',
        meta: {
          keepAlive: true,
          title: '定时'
        }
      },
      {
        path: '/sendAcrossDays/index',
        component: () =>
          import('@/views/QueryAndPivot/sendAcrossDays/index'),
        name: 'sendAcrossDays',
        meta: {
          keepAlive: true,
          title: '发送跨天列表查询'
        }
      },
      {
        path: '/smsSendTask/index',
        component: () =>
          import('@/views/QueryAndPivot/smsSendTask/index'),
        name: 'smsSendTask',
        meta: {
          keepAlive: true,
          title: '待发'
        }
      },
      {
        path: '/sysSendError/index',
        component: () =>
          import('@/views/QueryAndPivot/sysSendError/index'),
        name: 'sysSendError',
        meta: {
          keepAlive: true,
          title: '网关错误'
        }
      },
      {
        path: '/sysRouteReturnError/index',
        component: () =>
          import('@/views/QueryAndPivot/sysRouteReturnError/index'),
        name: 'sysRouteReturnError',
        meta: {
          keepAlive: true,
          title: '失败原因数据统计'
        }
      },
      {
        path: '/smsProfit/index',
        component: () =>
          import('@/views/QueryAndPivot/smsProfit/index'),
        name: 'smsProfit',
        meta: {
          keepAlive: true,
          title: '用户利润查询'
        }
      },
      {
        path: '/sendLogFegin/index',
        component: () =>
          import('@/views/QueryAndPivot/sendLogFegin/index'),
        name: 'sendLogFegin',
        meta: {
          keepAlive: true,
          title: '提交记录'
        }
      },
      {
        path: '/smsReturnReport/index',
        component: () =>
          import('@/views/QueryAndPivot/smsReturnReport/index'),
        name: 'smsReturnReport',
        meta: {
          keepAlive: true,
          title: '返回报告'
        }
      },
      {
        path: '/smsTxReport/index',
        component: () =>
          import('@/views/QueryAndPivot/smsTxReport/index'),
        name: 'smsTxReport',
        meta: {
          keepAlive: true,
          title: '发送报告'
        }
      },
      {
        path: '/smsTxReturnReport/index',
        component: () =>
          import('@/views/QueryAndPivot/smsTxReturnReport/index'),
        name: 'smsTxReturnReport',
        meta: {
          keepAlive: true,
          title: '发送返回报告'
        }
      },

    ]
  },
  {
    path: '/AuditsManagement',
    component: Layout,
    redirect: '/smsCheckWait/index',
    hidden: true,
    alwaysShow: true,
    name: 'AuditsManagement',
    meta: {
      title: '审核管理',
    },
    children: [{
        path: '/smsCheckWait/index',
        component: () =>
          import('@/views/AuditsManagement/smsCheckWait/index'),
        name: 'smsCheckWait',
        meta: {
          keepAlive: true,
          title: '待审'
        }
      },
      {
        path: '/smsCheckTemplate/index',
        component: () =>
          import('@/views/AuditsManagement/smsCheckTemplate/index'),
        name: 'smsCheckTemplate',
        meta: {
          keepAlive: true,
          title: '待审模板'
        },
      },
      {
        path: '/smsCheckSign/index',
        component: () =>
          import('@/views/AuditsManagement/smsCheckSign/index'),
        name: 'smsCheckSign',
        meta: {
          keepAlive: true,
          title: '待审签名'
        },
      },
    ]
  },
  {
    path: '/DataStatistics',
    component: Layout,
    redirect: '/sysTimeTasklistStatistics/index',
    hidden: true,
    alwaysShow: true,
    name: 'DataStatistics',
    meta: {
      title: '数据统计',
    },
    children: [{
        path: '/sysTimeTasklistStatistics/index',
        component: () =>
          import('@/views/DataStatistics/sysTimeTasklistStatistics/index'),
        name: 'sysTimeTasklistStatistics',
        meta: {
          keepAlive: true,
          title: '定时统计'
        }
      },
      {
        path: '/sysReport/index',
        component: () =>
          import('@/views/DataStatistics/sysReport/index'),
        name: 'sysReport',
        meta: {
          keepAlive: true,
          title: '用户发送情况统计'
        }
      },
      {
        path: '/sysSuccessRate/index',
        component: () =>
          import('@/views/DataStatistics/sysSuccessRate/index'),
        name: 'sysSuccessRate',
        meta: {
          keepAlive: true,
          title: '成功率统计'
        }
      },
      {
        path: '/sysRealTimeData/index',
        component: () =>
          import('@/views/DataStatistics/sysRealTimeData/index'),
        name: 'sysRealTimeData',
        meta: {
          keepAlive: true,
          title: '实时数据查询'
        }
      },
      {
        path: '/sysUnbilled/index',
        component: () =>
          import('@/views/DataStatistics/sysUnbilled/index'),
        name: 'sysUnbilled',
        meta: {
          keepAlive: true,
          title: '免审未发统计'
        }
      },
    ]
  },
  {
    path: '/ChannelManagement',
    component: Layout,
    redirect: '/gateway/index',
    hidden: true,
    alwaysShow: true,
    name: 'ChannelManagement',
    meta: {
      title: '通道管理',
    },
    children: [{
        path: '/gateway/index',
        component: () =>
          import('@/views/ChannelManagement/gateway/index'),
        name: 'gateway',
        meta: {
          keepAlive: true,
          title: '短信通道'
        }
      },
      {
        path: '/mmsGateway/index',
        component: () =>
          import('@/views/ChannelManagement/mmsGateway/index'),
        name: 'mmsGateway',
        meta: {
          keepAlive: true,
          title: '彩信通道'
        }
      },
      {
        path: '/smsTestSendTask/index',
        component: () =>
          import('@/views/ChannelManagement/smsTestSendTask/index'),
        name: 'smsTestSendTask',
        meta: {
          keepAlive: true,
          title: '测试发送接口'
        }
      },
    ]
  },
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
