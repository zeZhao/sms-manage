import {
  post,
  fetch,
  patch,
  put,
  del
} from './http'

/**
 * params 类型为Object
 */
export default {
  // 省份列表
  listSysProvince(params) {
    return post("/sysProvince/listSysProvince", params);
  },
  // 市级列表
  listSysProvinceCity(params) {
    return post("/sysProvinceCity/listSysProvinceCity", params);
  },
  // 企业和用户列表
  queryMainInfo(params) {
    return fetch("/corpUser/queryMainInfo", params);
  },

  role: {
    // 角色列表
    roleList(params) {
      return post("/sysRole/queryByPage", params);
    },
    // 角色新增&修改
    addOrUpdate(params) {
      return post("/sysRole/addOrUpdate", params);
    },
    //查询角色菜单
    queryRoleMenu(params) {
      return fetch("/sysRoleMenu/queryRoleMenu", params);
    },
    //修改绑定菜单
    updateRoleMenu(params) {
      return post("/sysRoleMenu/updateRoleMenu", params);
    },
    //根据type查询角色列表
    getRoleByType(params) {
      return fetch("/sysRole/getRoleByType", params);
    },
    //修改角色状态
    updateStatus(params) {
      return post("/sysRole/updateStatus", params);
    },
    //删除角色
    delete(params) {
      return fetch("/sysRole/delete", params);
    }
  },
  user: {
    // 运营账号列表
    queryByPage(params) {
      return post("/sysUser/queryByPage", params);
    },
    // 运营账号新增&修改
    addOrUpdate(params) {
      return post("/sysUser/addOrUpdate", params);
    },
    //查询角色菜单
    queryRoleMenu(params) {
      return post("/sysRoleMenu/queryRoleMenu", params);
    },
    //修改绑定菜单
    updateRoleMenu(params) {
      return post("/sysRoleMenu/updateRoleMenu", params);
    },
    //修改状态
    updateStatus(params) {
      return post("/sysUser/updateStatus", params);
    },
    //修改运营角色
    sysUseOrUpdate(params) {
      return post("/sysUserRole/addOrUpdate", params);
    },
    //删除运营角色
    delete(params) {
      return fetch("/sysUser/delete", params);
    }
  },
  company: {
    // 商户账号列表
    queryWebUserByPage(params) {
      return post("/corpUser/queryWebUserByPage", params);
    },
    // 商户账号绑定角色
    addOrUpdate(params) {
      return post("/corpUserRole/addOrUpdate", params);
    },
  },
  nav: {
    // 菜单列表
    selectMenuList(params) {
      return fetch("/sysMenu/selectMenuList", params);
    },
    // 菜单状态修改
    updateStatus(params) {
      return post("/sysMenu/updateStatus", params);
    },
    // 新增&修改菜单
    addOrUpdate(params) {
      return post("/sysMenu/addOrUpdate", params);
    },
    // 新增&修改菜单
    delete(params) {
      return fetch("/sysMenu/delete", params);
    },
  },
  corp: {
    // 企业列表
    queryByPage(params) {
      return post("/corp/queryByPage", params);
    },
    // 企业状态
    updateStatus(params) {
      return post("/corp/updateStatus", params);
    },
    // 新增企业
    addOrUpdate(params) {
      return post("/corp/addOrUpdate", params);
    },
  },
  //企业用户
  corpUser: {
    // 企业用户列表
    queryByPage(params) {
      return post("/corpUser/queryByPage", params);
    },
    // 新增企业用户
    addOrUpdate(params) {
      return post("/corpUser/addOrUpdate", params);
    },
    // 修改企业用户状态
    updateStatus(params) {
      return post("/corpUser/updateStatus", params);
    },
  },
  //通道重发配置
  sysResendConfig: {
    // 配置列表
    listResendConfigByPage(params) {
      return post("/sysResendConfig/listResendConfigByPage", params);
    },
    // 删除
    deleteResendConfig(params) {
      return post("/sysResendConfig/deleteResendConfig", params);
    },
    // 修改
    updateResendConfig(params) {
      return post("/sysResendConfig/updateResendConfig", params);
    },
    // 添加
    addResendConfig(params) {
      return post("/sysResendConfig/addResendConfig", params);
    },
  },
  // 签名路由配置
  sysSignRoute: {
    // 配置列表
    listSignRouteByPage(params) {
      return post("/sysSignRoute/listSignRouteByPage", params);
    },
    // 删除
    deleteSignRoute(params) {
      return post("/sysSignRoute/deleteSignRoute", params);
    },
    // 修改
    updateSignRoute(params) {
      return post("/sysSignRoute/updateSignRoute", params);
    },
    // 添加
    addSignRoute(params) {
      return post("/sysSignRoute/addSignRoute", params);
    },
  },
  //发送上限
  sysSendLimit: {
    // 发送上限列表
    listSendLimitByPage(params) {
      return post("/sysSendLimit/listSendLimitByPage", params);
    },
    // 删除
    deleteSendLimit(params) {
      return post("/sysSendLimit/deleteSendLimit", params);
    },
    // 修改
    updateSendLimit(params) {
      return post("/sysSendLimit/updateSendLimit", params);
    },
    // 修改
    addSendLimit(params) {
      return post("/sysSendLimit/addSendLimit", params);
    },
  },
  //通道组配置
  sysGatewayGroup: {
    // 列表
    listGatewayGroupByPage(params) {
      return post("/sysGatewayGroup/listGatewayGroupByPage", params);
    },
    // 删除
    deleteGatewayGroup(params) {
      return post("/sysGatewayGroup/deleteGatewayGroup", params);
    },
    // 修改
    updateGatewayGroup(params) {
      return post("/sysGatewayGroup/updateGatewayGroup", params);
    },
    // 添加
    addGatewayGroup(params) {
      return post("/sysGatewayGroup/addGatewayGroup", params);
    },
    // 查询通道组
    selectGatewayGroup(params) {
      return post("/sysGatewayGroup/selectGatewayGroup", params);
    },
  },
  //分省路由
  sysProvinceRoute: {
    // 列表
    listProvinceRouteByPage(params) {
      return post("/sysProvinceRoute/listProvinceRouteByPage", params);
    },
    // 删除
    deleteProvinceRoute(params) {
      return post("/sysProvinceRoute/deleteProvinceRoute", params);
    },
    // 修改
    updateProvinceRoute(params) {
      return post("/sysProvinceRoute/updateProvinceRoute", params);
    },
    // 添加
    addProvinceRoute(params) {
      return post("/sysProvinceRoute/addProvinceRoute", params);
    },
  },
  //短信通道
  gateway: {
    // 下拉查询列表
    listGateway(params) {
      return post("/gateway/listGateway", params);
    },
    // 分页查询列表
    listGatewayByPage(params) {
      return post("/gateway/listGatewayByPage", params);
    },
    // 删除
    deleteGateway(params) {
      return post("/gateway/deleteGateway", params);
    },
    // 修改
    updateGateway(params) {
      return post("/gateway/updateGateway", params);
    },
    // 添加
    addGateway(params) {
      return post("/gateway/addGateway", params);
    },
  },
  //客户通道策略
  //短信通道
  sysCustomerChannelStrategy: {
    // 下拉查询列表
    // listGateway(params) {
    //   return post("/sysCustomerChannelStrategy/listStrategyByPage", params);
    // },
    // 分页查询列表
    listStrategyByPage(params) {
      return post("/sysCustomerChannelStrategy/listStrategyByPage", params);
    },
    // 删除
    deleteStrategy(params) {
      return post("/sysCustomerChannelStrategy/deleteStrategy", params);
    },
    // 修改
    updateStrategy(params) {
      return post("/sysCustomerChannelStrategy/updateStrategy", params);
    },
    // 添加
    addStrategy(params) {
      return post("/sysCustomerChannelStrategy/addStrategy", params);
    },
  },
  //短信通道
  mmsUserGateway: {
    // 分页查询列表
    listMmsUserGatewayByPage(params) {
      return post("/mmsUserGateway/listMmsUserGatewayByPage", params);
    },
    // 删除
    deleteMmsUserGateway(params) {
      return post("/mmsUserGateway/deleteMmsUserGateway", params);
    },
    // 修改
    updateMmsUserGateway(params) {
      return post("/mmsUserGateway/updateMmsUserGateway", params);
    },
    // 添加
    addMmsUserGateway(params) {
      return post("/mmsUserGateway/addMmsUserGateway", params);
    },
  },
  // 签名管理
  sysSignCheck: {
    // 分页查询列表
    listSignCheckByPage(params) {
      return post("/sysSignCheck/listSignCheckByPage", params);
    },
    // 删除
    deleteSignCheck(params) {
      return post("/sysSignCheck/deleteSignCheck", params);
    },
    // 修改
    updateSignCheck(params) {
      return post("/sysSignCheck/updateSignCheck", params);
    },
  },
  //用户余额
  corpUserBalance: {
    // 分页查询列表
    queryByPage(params) {
      return post("/corpUserBalance/queryByPage", params);
    },
  },
  //余额调整记录
  smsBalanceopt: {
    // 分页查询列表
    queryByPage(params) {
      return post("/smsBalanceopt/queryByPage", params);
    },
    // 新增
    add(params) {
      return post("/smsBalanceopt/add", params);
    },
  },
  //余额调整记录
  sysCompanyIncome: {
    // 分页查询列表
    listCompanyIncomeByPage(params) {
      return post("/sysCompanyIncome/listCompanyIncomeByPage", params);
    },
    // 新增
    addCompanyIncome(params) {
      return post("/sysCompanyIncome/addCompanyIncome", params);
    },
    // 修改
    updateCompanyIncome(params) {
      return post("/sysCompanyIncome/updateCompanyIncome", params);
    },
    // 删除
    deleteCompanyIncome(params) {
      return post("/sysCompanyIncome/deleteCompanyIncome", params);
    },
  },
  //零点余额
  userBalanceDaily: {
    listBalanceDailyByPage(params) {
      return post("/userBalanceDaily/listBalanceDailyByPage", params)
    }
  },
  //企业月账单
  sysPrepaidCard: {
    listCorporateBillByPage(params) {
      return post("/sysPrepaidCard/listCorporateBillByPage", params)
    }
  },
  //用户月账单
  sysUserPrepaidCard: {
    listPrepaidCardByPage(params) {
      return post("/sysPrepaidCard/listPrepaidCardByPage", params)
    }
  },
  //通道月账单
  smsGatewayBill: {
    // 列表
    listGatewayBillByPage(params) {
      return post("/smsGatewayBill/listGatewayBillByPage", params)
    },
    // 新增
    addGatewayBill(params) {
      return post("/smsGatewayBill/addGatewayBill", params)
    },
    // 修改
    updateGatewayBill(params) {
      return post("/smsGatewayBill/updateGatewayBill", params)
    },
    // 删除
    deleteGatewayBill(params) {
      return post("/smsGatewayBill/deleteGatewayBill", params)
    }
  },
  sysFinancialControl: {
    //编辑【审核接口】
    useCard(params) {
      return post('/sysPrepaidCard/useCard', params)
    },
    //驳回
    stopPrepaidCard(params) {
      return post('/sysPrepaidCard/stopPrepaidCard', params)
    },
  },
  //财务管理充值
  sysRecharge: {
    // 列表
    listPrepaidCardByPage(params) {
      return post("/sysPrepaidCard/listPrepaidCardByPage", params)
    },
    // 新增
    addPrepaidCard(params) {
      return post("/sysPrepaidCard/addPrepaidCard", params)
    },
    // 修改
    updatePrepaidCard(params) {
      return post("/sysPrepaidCard/updatePrepaidCard", params)
    },
    // 账号互转
    refundPrepaidCard(params) {
      return post("/sysPrepaidCard/refundPrepaidCard", params)
    }
  },
  //报警信息
  sysAlarmMessage: {
    // 分页查询列表
    listAlarmMessageByPage(params) {
      return post("/sysAlarmMessage/listAlarmMessageByPage", params);
    },
    // 报警信息统计表分页查询列表
    listAlarmMessageStatisticsByPage(params) {
      return post("/sysAlarmMessage/listAlarmMessageStatisticsByPage", params);
    },

  },
  //通道报警
  sysGatewayAlarm: {
    // 分页查询列表
    listGatewayAlarmByPage(params) {
      return post("/sysGatewayAlarm/listGatewayAlarmByPage", params);
    },
    // 新增
    addGatewayAlarm(params) {
      return post("/sysGatewayAlarm/addGatewayAlarm", params);
    },
    // 修改
    updateGatewayAlarm(params) {
      return post("/sysGatewayAlarm/updateGatewayAlarm", params);
    },
    // 删除
    deleteGatewayAlarm(params) {
      return post("/sysGatewayAlarm/deleteGatewayAlarm", params);
    },
  },
  //用户报警
  sysUserAlarm: {
    // 分页查询列表
    listUserAlarmByPage(params) {
      return post("/sysUserAlarm/listUserAlarmByPage", params);
    },
    // 新增
    addUserAlarm(params) {
      return post("/sysUserAlarm/addUserAlarm", params);
    },
    // 修改
    updateUserAlarm(params) {
      return post("/sysUserAlarm/updateUserAlarm", params);
    },
    // 删除
    deleteUserAlarm(params) {
      return post("/sysUserAlarm/deleteUserAlarm", params);
    },
  },
  //用户报警
  sysAlarmType: {
    // 分页查询列表
    listAlarmTypeByPage(params) {
      return post("/sysAlarmType/listAlarmTypeByPage", params);
    },
    // 新增
    addAlarmType(params) {
      return post("/sysAlarmType/addAlarmType", params);
    },
    // 修改
    updateAlarmType(params) {
      return post("/sysAlarmType/updateAlarmType", params);
    },
    // 删除
    deleteAlarmType(params) {
      return post("/sysAlarmType/deleteAlarmType", params);
    },
  },
  //销售组管理
  sysSalesGroup: {
    // 分页查询列表
    queryByPage(params) {
      return post("/sysSalesGroup/queryByPage", params);
    },
    // 新增
    addOrUpdate(params) {
      return post("/sysSalesGroup/addOrUpdate", params);
    },
    // 修改状态
    updateStatus(params) {
      return post("/sysSalesGroup/updateStatus", params);
    },
  },
  //销售组管理
  sysSales: {
    // 分页查询列表
    queryByPage(params) {
      return post("/sysSales/queryByPage", params);
    },
    // 新增
    addOrUpdate(params) {
      return post("/sysSales/addOrUpdate", params);
    },
    // 修改状态
    updateStatus(params) {
      return post("/sysSales/updateStatus", params);
    },
    //  查询 新增修改销售员人页面 下拉框组
    getEditData(params) {
      return post("/sysSales/getEditData", params);
    },
    // 查询有效的销售人员
    queryAvailableSaleman(params) {
      return fetch("/sysSales/queryAvailableSaleman", params);
    },
  },
  //敏感词
  sysSensitiveWord: {
    // 分页查询列表
    listSensitiveWordByPage(params) {
      return post("/sysSensitiveWord/listSensitiveWordByPage", params);
    },
    // 新增
    addSensitiveWord(params) {
      return post("/sysSensitiveWord/addSensitiveWord", params);
    },
    // 修改
    updateSensitiveWord(params) {
      return post("/sysSensitiveWord/updateSensitiveWord", params);
    },
    //  删除
    deleteSensitiveWord(params) {
      return post("/sysSensitiveWord/deleteSensitiveWord", params);
    },
  },
  // 敏感词组
  sysSensitiveWordGroup: {
    // 查询列表
    listSensitiveWordGroup(params) {
      return post("/sysSensitiveWordGroup/listSensitiveWordGroup", params);
    },
    // 分页查询列表
    listKeyWordGroupByPage(params) {
      return post("/sysSensitiveWordGroup/listKeyWordGroupByPage", params);
    },
    // 新增
    addSensitiveWordGroup(params) {
      return post("/sysSensitiveWordGroup/addSensitiveWordGroup", params);
    },
    // 修改状态
    updateSensitiveWordGroup(params) {
      return post("/sysSensitiveWordGroup/updateSensitiveWordGroup", params);
    },
    //  删除
    deleteSensitiveWordGroup(params) {
      return post("/sysSensitiveWordGroup/deleteSensitiveWordGroup", params);
    },
  },
  // 黑名单管理
  sysBlacklist: {
    // 查询列表
    listBlacklistByPage(params) {
      return post("/sysBlacklist/listBlacklistByPage", params);
    },
    // 新增
    addSysBlackList(params) {
      return post("/sysBlacklist/addSysBlackList", params);
    },
    // 修改
    updateSysBlackList(params) {
      return post("/sysBlacklist/updateSysBlackList", params);
    },
    //  删除
    deleteSysBlackList(params) {
      return post("/sysBlacklist/deleteSysBlackList", params);
    },
  },
  // 红名单管理
  sysRedList: {
    // 查询列表
    listRedListByPage(params) {
      return post("/sysRedList/listRedListByPage", params);
    },
    // 新增
    addSysRedList(params) {
      return post("/sysRedList/addSysRedList", params);
    },
    // 修改
    updateSysRedList(params) {
      return post("/sysRedList/updateSysRedList", params);
    },
    //  删除
    deleteSysRedList(params) {
      return post("/sysRedList/deleteSysRedList", params);
    },
  },
  // 白名单管理
  sysWhitelist: {
    // 查询列表
    listWhitelistByPage(params) {
      return post("/sysWhitelist/listWhitelistByPage", params);
    },
    // 新增
    addSysWhiteList(params) {
      return post("/sysWhitelist/addSysWhiteList", params);
    },
    // 修改
    updateSysWhiteList(params) {
      return post("/sysWhitelist/updateSysWhiteList", params);
    },
    //  删除
    deleteSysWhiteList(params) {
      return post("/sysWhitelist/deleteSysWhiteList", params);
    },
  },
  // 二次路由
  sysSecondaryRoute: {
    // 查询列表
    listSecondaryRouteByPage(params) {
      return post("/sysSecondaryRoute/listSecondaryRouteByPage", params);
    },
    // 新增
    addSecondaryRoute(params) {
      return post("/sysSecondaryRoute/addSecondaryRoute", params);
    },
    // 修改
    updateSecondaryRoute(params) {
      return post("/sysSecondaryRoute/updateSecondaryRoute", params);
    },
    //  删除
    deleteInterfaceSign(params) {
      return post("/sysSecondaryRoute/deleteInterfaceSign", params);
    },
  },
  // 审核号码
  smsCheckMobile: {
    // 查询列表
    queryByPage(params) {
      return post("/smsCheckMobile/queryByPage", params);
    }
  },
  // 短连接查询
  smsShortUrl: {
    // 查询列表
    queryByPage(params) {
      return post("/smsShortUrl/queryByPage", params);
    }
  },
  // 上行信息
  smsMoQueue: {
    // 查询列表
    queryByPage(params) {
      return post("/smsMoQueue/queryByPage", params);
    }
  },
  // 审核查询
  smsCheck: {
    // 查询列表
    queryByPage(params) {
      return post("/smsCheck/queryByPage", params);
    }
  },
  // 定时
  sysTimeTasklist: {
    // 查询列表
    listTimeTasklistByPage(params) {
      return post("/sysTimeTasklist/listTimeTasklistByPage", params);
    }
  },
  // 待发
  smsSendTask: {
    // 查询列表
    queryByPage(params) {
      return post("/smsSendTask/queryByPage", params);
    }
  },
  // 网关错误
  sysSendError: {
    // 查询列表
    queryByPage(params) {
      return post("/sysSendError/queryByPage", params);
    },
    // 修改网关
    editGateWay(params) {
      return post("/sysSendError/editGateWay", params);
    },
    // 修改内容
    editContent(params) {
      return post("/sysSendError/editContent", params);
    },
  },
  // 失败原因
  sysRouteReturnError: {
    // 查询列表
    listRouteReturnErrorByPage(params) {
      return post("/sysRouteReturnError/listRouteReturnErrorByPage", params);
    },
    // 新增
    addRouteReturnError(params) {
      return post("/sysRouteReturnError/addRouteReturnError", params);
    },
    // 修改
    updateRouteReturnError(params) {
      return post("/sysRouteReturnError/updateRouteReturnError", params);
    },
    //  删除
    deleteRouteReturnError(params) {
      return post("/sysRouteReturnError/deleteRouteReturnError", params);
    },
  },
  // 接口加强签名
  sysInterfaceSign: {
    // 查询列表
    listInterfaceSignByPage(params) {
      return post("/sysInterfaceSign/listInterfaceSignByPage", params);
    },
    // 新增
    addInterfaceSign(params) {
      return post("/sysInterfaceSign/addInterfaceSign", params);
    },
    // 修改
    updateInterfaceSign(params) {
      return post("/sysInterfaceSign/updateInterfaceSign", params);
    },
    //  删除
    deleteInterfaceSign(params) {
      return post("/sysInterfaceSign/deleteInterfaceSign", params);
    },
  },

}
