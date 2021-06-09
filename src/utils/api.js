import {
    post,
    fetch,
    downLoadGet,
    put,
    del
} from './http'

/**
 * params 类型为Object
 */
export default {
    sysLogin: {
        captcha(params) {
            return fetch("/sysLogin/captcha", params);
        }
    },
    // 省份列表
    listSysProvince(params) {
        return post("/sysProvince/listSysProvince", params);
    },
    // 市级列表
    listSysProvinceCity(params) {
        return post("/sysProvinceCity/listSysProvinceCity", params);
    },
    // 商户和用户列表
    queryMainInfo(params) {
        return fetch("/corpUser/queryMainInfo", params);
    },

    sendReportStatistic: {
        // 发送统计
        querySendStaticByTime(params) {
            return fetch("/sendReportStatistic/querySendStaticByTime", params);
        },
        //运营商发送数量统计
        queryCountByOpera(params) {
            return fetch("/sendReportStatistic/queryCountByOpera", params);
        },
        //区域统计
        queryCountByArea(params) {
            return fetch("/sendReportStatistic/queryCountByArea", params);
        },
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
        // 下拉商户列表
        queryAllCorp(params) {
            return fetch("/corp/queryAllCorp", params);
        },
        // 商户列表
        queryByPage(params) {
            return post("/corp/queryByPage", params);
        },
        // 商户状态
        updateStatus(params) {
            return post("/corp/updateStatus", params);
        },
        // 新增商户
        addOrUpdate(params) {
            return post("/corp/addOrUpdate", params);
        },
    },
    //商户用户
    corpUser: {
        // 商户用户列表
        queryByPage(params) {
            return post("/corpUser/queryByPage", params);
        },
        // 新增商户用户
        addOrUpdate(params) {
            return post("/corpUser/addOrUpdate", params);
        },
        // 修改商户用户状态
        updateStatus(params) {
            return post("/corpUser/updateStatus", params);
        },
        // 审核
        check(params) {
            return post("/corpUser/check", params);
        },
        // 商户和用户列表
        queryMainInfo(params) {
            return post("/corpUser/queryMainInfo", params);
        },
        // 配置提交速率
        configureSubmitRate(params) {
            return fetch("/corpUser/configureSubmitRate", params);
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
    //标签
    sysTag: {
        // 发送上限列表
        tagList(params) {
            return fetch("/sms/tag", params);
        },
        // 删除
        deleteTag(id) {
            return del(`/sms/tag/${id}`);
        },
        // 保存
        tagPost(params) {
            return post("/sms/tag", params);
        },
        // 修改
        tagPut(params) {
            return put("/sms/tag", params);
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
        // 查询通道组
        listGatewayAndGroup(params) {
            return post("/sysGatewayGroup/listGatewayAndGroup", params);
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
    //优化比例配置
    corpUserOptimize: {
        // 列表
        queryByPage(params) {
            return post("/corpUserOptimize/queryByPage", params);
        },
        // 删除
        delete(params) {
            return fetch("/corpUserOptimize/delete", params);
        },
        // 新增修改优化比例配置
        addOrUpdate(params) {
            return post("/corpUserOptimize/addOrUpdate", params);
        },
    },
    //客户通道策略
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
    //投诉录入
    sysComplaints: {
        // 分页查询列表
        queryByPage(params) {
            return post("/sysComplaint/queryByPage", params);
        },
        // 添加、修改
        addOrUpdate(params) {
            return post("/sysComplaint/addOrUpdate", params);
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
        // 审核
        checkSignCheck(params) {
            return post("/sysSignCheck/checkSignCheck", params);
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
    //导出账单
    sysExportBill: {
        // 分页查询列表
        list(params) {
            return post("/bill/export/list", params);
        },
        // 新增
        export(params) {
            return post("/bill/export", params);
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
    //商户月账单
    sysPrepaidCard: {
        listCorporateBillByPage(params) {
            return post("/sysPrepaidCard/listCorporateBillByPage", params)
        },
        //导出平台账单
        exportPlatform(params) {
            return post("/sysPrepaidCard/exportPlatform", params)

        },
        //导出直连账单
        exportDirectLink(params) {
            return post("/sysPrepaidCard/exportDirectLink", params)
        }
    },
    //用户月账单
    sysUserPrepaidCard: {
        listPrepaidCardByPage(params) {
            return post("/sysPrepaidCard/listPrepaidCardByPage", params)
        }
    },
    //用户日账单
    userDailyBill: {
        queryUserDailyBill(params) {
            return post("/userDailyBill/queryUserDailyBill", params)
        }
    },
    //用户月账单
    userMonthlyBill: {
        queryList(params) {
            return post("/userMonthlyBill/queryList", params)
        }
    },
    //通道月账单（运营）
    gatewayMonthlyBill: {
        queryList(params) {
            return post("/gatewayMonthlyBill/queryList", params)
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
    //财务审核
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
        // 财务列表
        listPrepaidCardExamineByPage(params) {
            return post("/sysPrepaidCard/listPrepaidCardExamineByPage", params)
        },
        // 运营列表
        listPrepaidCardOperationByPage(params) {
            return post("/sysPrepaidCard/listPrepaidCardOperationByPage", params)
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
        },
        // 上传凭证
        // uploadFile(params) {
        //   return post("/sysPrepaidCard/uploadFile", params)
        // }
    },
    //支出信息
    sysExpensesInfo: {
        // 列表
        listExpensesInfoByPage(params) {
            return post("/sysExpensesInfo/listExpensesInfoByPage", params)
        },
        // 新增
        addExpensesInfo(params) {
            return post("/sysExpensesInfo/addExpensesInfo", params)
        },
        // 修改
        updateExpensesInfo(params) {
            return post("/sysExpensesInfo/updateExpensesInfo", params)
        },
        // 删除
        deleteExpensesInfo(params) {
            return post("/sysExpensesInfo/deleteExpensesInfo", params)
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
        // 检测是否存在
        checkSensitiveWord(params) {
            return post("sysSensitiveWord/checkSensitiveWord", params);
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
        //  检测是否存在
        checkSensitiveWordGroup(params) {
            return post("/sysSensitiveWordGroup/checkSensitiveWordGroup", params);
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
    // 发送记录
    sendRecord: {
        // 查询列表
        selectSendBackByPage(params) {
            return post("/sendLogFegin/selectSendBackByPage", params);
        },
        // 查询列表总数
        selectSendBackAllNum(params) {
            return post("/sendLogFegin/selectSendBackAllNum", params);
        }
    },
    // 发送报告
    smsTxReport: {
        // 查询列表
        searchSendReport(params) {
            return post("/sendLogFegin/selectSendreportByPage", params);
        }
    },
    // 返回报告
    smsReturnReport: {
        // 查询列表
        selectReturnReportByPage(params) {
            return post("/sendLogFegin/selectReturnReportByPage", params);
        }
    },
    // 发送返回报告
    smsTxReturnReport: {
        // 查询列表
        searchSendReturnReport(params) {
            return post("/sendLogFegin/selectSendReturnByPage", params);
        }
    },
    // 定时
    sysTimeTasklist: {
        // 查询列表
        listTimeTasklistByPage(params) {
            return post("/sysTimeTasklist/listTimeTasklistByPage", params);
        }
    },
    // 发送跨天列表查询
    sendAcrossDays: {
        // 查询列表
        queryList(params) {
            return post("/sendAcrossDays/queryList", params);
        }
    },
    // 待发
    smsSendTask: {
        // 查询列表
        queryByPage(params) {
            return post("/smsSendTask/queryByPage", params);
        },
        // 批量修改通道
        batchModify(params) {
            return post("/smsSendTask/batchModify", params);
        },
        //查看汇总 
        queryGatewayStockNum(params) {
            return post("/smsSendTask/queryGatewayStockNum", params);
        }
    },
    // 通道错误
    sysSendError: {
        // 查询列表
        queryByPage(params) {
            return post("/sysSendError/queryByPage", params);
        },
        // 修改通道
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
    // 前台提交调整
    smsSendlogSubmit: {
        // 查询列表
        queryByPage(params) {
            return post("/smsSendlogSubmit/queryByPage", params);
        },
        // 修改
        editSmsSendlogSubmit(params) {
            return post("/smsSendlogSubmit/editSmsSendlogSubmit", params);
        },
        // 获取修改数据
        getSmsSendlogSubmit(params) {
            return fetch("/smsSendlogSubmit/getSmsSendlogSubmit", params);
        },
        //  删除
        deleteTaskid(params) {
            return fetch("/smsSendlogSubmit/deleteTaskid", params);
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
    // 免审管理
    sysExemptReviewManage: {
        // 查询列表
        listExemptReviewManageByPage(params) {
            return post("/sysExemptReviewManage/listExemptReviewManageByPage", params);
        },
        // 新增
        addExemptReviewManage(params) {
            return post("/sysExemptReviewManage/addExemptReviewManage", params);
        },
        // 修改
        updateExemptReviewManage(params) {
            return post("/sysExemptReviewManage/updateExemptReviewManage", params);
        },
        //  删除
        deleteExemptReviewManage(params) {
            return post("/sysExemptReviewManage/deleteExemptReviewManage", params);
        },
    },
    // 审核管理-待审
    smsCheckWait: {
        // 查询列表
        listCheckWaitByPage(params) {
            return post("/smsCheckWait/listCheckWaitByPage", params);
        },
        // 添加分配
        addCheck(params) {
            return post("/smsCheckWait/addCheck", params);
        },
        // 停止分配
        stopCheck(params) {
            return post("/smsCheckWait/stopCheck", params);
        },
        //  通过拒绝选择项
        checkSms(params) {
            return post("/smsCheckWait/checkSms", params);
        },
        //  超审
        supperCheck(params) {
            return post("/smsCheckWait/supperCheck", params);
        },

    },
    // 审核管理-免审核模板
    smsAuditfreeTemplate: {
        // 查询列表
        list(params) {
            return post("/smsAuditfreeTemplate/list", params);
        },
        // 删除
        delete(params) {
            return fetch("/smsAuditfreeTemplate/delete", params);
        },
        // 新增修改
        addOrUpdate(params) {
            return post("/smsAuditfreeTemplate/addOrUpdate", params);
        },

    },
    // 审核管理-待审模板
    smsCheckTemplate: {
        // 查询列表
        listCheckTemplateByPage(params) {
            return post("/smsCheckTemplate/listCheckTemplateByPage", params);
        },
        // 修改
        updateCheckTemplate(params) {
            return post("/smsCheckTemplate/updateCheckTemplate", params);
        },
    },
    // 用户利润查询
    smsProfit: {
        // 查询列表
        queryByPage(params) {
            return post("/smsProfit/queryByPage", params);
        },
    },
    // 定时统计
    sysTimeTasklistStatistics: {
        // 查询列表
        queryTimeTaskByPage(params) {
            return post("/sysTimeTasklist/queryTimeTaskByPage", params);
        },
    },
    // 定时统计
    userChannelStatistics: {
        // 查询列表
        queryList(params) {
            return post("/userChannelStatistics/queryList", params);
        },
        // 统计
        queryChannelSuccNum(params) {
            return post("/userChannelStatistics/queryChannelSuccNum", params);
        },
    },
    // 成功率统计
    sysSuccessRate: {
        // 查询列表
        querySendDetail(params) {
            return fetch("/report/querySendDetail", params);
        },
    },
    // 实时数据查询
    sysRealTimeData: {
        // 查询列表
        realTimeData(params) {
            return fetch("/report/realTimeData", params);
        },
    },

    //用户发送情况统计
    report: {
        // 查询列表
        queryByPage(params) {
            return fetch("/report/queryUserSendDetail", params);
        },
        //统计
        queryUserSendDetailAll(params) {
            return fetch("/report/queryUserSendDetailAll", params);
        },
    },
    //返回报告统计
    returnReportStatistics: {
        // 查询列表
        returnReportStatistics(params) {
            return fetch("/report/returnReportStatistics", params);
        },
        //统计
        returnReportTotal(params) {
            return fetch("/report/returnReportTotal", params);
        },
    },
    //发送报告统计
    sendReportStatistics: {
        // 查询列表
        sendReportStatistics(params) {
            return fetch("/report/sendReportStatistics", params);
        },
        //统计
        sendReportTotal(params) {
            return fetch("/report/sendReportTotal", params);
        },
    },
    //提交统计
    submitStatistics: {
        // 查询列表
        submitStatistics(params) {
            return fetch("/report/submitStatistics", params);
        },
        // //统计
        // sendReportTotal(params) {
        //   return fetch("/report/sendReportTotal", params);
        // },
    },
    //投诉统计
    sysComplaint: {
        // 查询列表
        queryStatisticByPage(params) {
            return post("/sysComplaint/queryStatisticByPage", params);
        },
        //统计
        TypeStatistic(params) {
            return fetch("/sysComplaint/querySysComplaintTypeStatistic", params);
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
        // 停止
        stopGateway(params) {
            return post("/gateway/stopGateway", params);
        },
        // 启用
        startGateway(params) {
            return post("/gateway/startGateway", params);
        },
        //配置
        updateGatewayByConfigure(params) {
            return post("/gateway/updateGatewayByConfigure", params);
        },
    },
    //彩信通道
    mmsGateway: {
        // 分页查询列表
        listMmsGatewayByPage(params) {
            return post("/mmsGateway/listMmsGatewayByPage", params);
        },
        // 删除
        deleteMmsGateway(params) {
            return post("/mmsGateway/deleteMmsGateway", params);
        },
        // 修改
        updateMmsGateway(params) {
            return post("/mmsGateway/updateMmsGateway", params);
        },
        // 添加
        addMmsGateway(params) {
            return post("/mmsGateway/addMmsGateway", params);
        },
    },
    //测试发送接口
    smsTestSendTask: {
        // 分页查询列表
        send(params) {
            return post("/smsSendTask/send", params);
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
    //销售管理-提交统计
    reportsubmitStatistics: {
        // 列表
        saleSubmitStatistics(params) {
            return fetch("/report/saleSubmitStatistics", params);
        },
        // 汇总
        saleSubmitStatisticsTotal(params) {
            return fetch("/report/saleSubmitStatisticsTotal", params);
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
        // 检测是否存在
        checkSensitiveWord(params) {
            return post("sysSensitiveWord/checkSensitiveWord", params);
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
        //  检测是否存在
        checkSensitiveWordGroup(params) {
            return post("/sysSensitiveWordGroup/checkSensitiveWordGroup", params);
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
    // 提交记录
    sendLogFegin: {
        // 查询列表
        selectSendLogByPage(params) {
            return post("/sendLogFegin/selectSendLogByPage", params);
        },
        // 总数量查询
        selectSendLogAllNum(params) {
            return post("/sendLogFegin/selectSendLogAllNum", params);
        }
    },

    // 发送报告
    smsTxReport: {
        // 查询列表
        searchSendReport(params) {
            return post("/sendLogFegin/selectSendreportByPage", params);
        }
    },
    // 返回报告
    smsReturnReport: {
        // 查询列表
        selectReturnReportByPage(params) {
            return post("/sendLogFegin/selectReturnReportByPage", params);
        }
    },
    // 发送返回报告
    smsTxReturnReport: {
        // 查询列表
        searchSendReturnReport(params) {
            return post("/sendLogFegin/selectSendReturnByPage", params);
        }
    },
    // 定时
    sysTimeTasklist: {
        // 查询列表
        listTimeTasklistByPage(params) {
            return post("/sysTimeTasklist/listTimeTasklistByPage", params);
        }
    },
    // 发送跨天列表查询
    sendAcrossDays: {
        // 查询列表
        queryList(params) {
            return post("/sendAcrossDays/queryList", params);
        }
    },
    // 待发
    smsSendTask: {
        // 查询列表
        queryByPage(params) {
            return post("/smsSendTask/queryByPage", params);
        },
        // 批量修改通道
        batchModify(params) {
            return post("/smsSendTask/batchModify", params);
        },
        //查看汇总 
        queryGatewayStockNum(params) {
            return post("/smsSendTask/queryGatewayStockNum", params);
        }
    },
    // 通道错误
    sysSendError: {
        // 查询列表
        queryByPage(params) {
            return post("/sysSendError/queryByPage", params);
        },
        // 修改通道
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
    // 前台提交调整
    smsSendlogSubmit: {
        // 查询列表
        queryByPage(params) {
            return post("/smsSendlogSubmit/queryByPage", params);
        },
        // 修改
        editSmsSendlogSubmit(params) {
            return post("/smsSendlogSubmit/editSmsSendlogSubmit", params);
        },
        // 获取修改数据
        getSmsSendlogSubmit(params) {
            return fetch("/smsSendlogSubmit/getSmsSendlogSubmit", params);
        },
        //  删除
        deleteTaskid(params) {
            return fetch("/smsSendlogSubmit/deleteTaskid", params);
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
    // 免审管理
    sysExemptReviewManage: {
        // 查询列表
        listExemptReviewManageByPage(params) {
            return post("/sysExemptReviewManage/listExemptReviewManageByPage", params);
        },
        // 新增
        addExemptReviewManage(params) {
            return post("/sysExemptReviewManage/addExemptReviewManage", params);
        },
        // 修改
        updateExemptReviewManage(params) {
            return post("/sysExemptReviewManage/updateExemptReviewManage", params);
        },
        //  删除
        deleteExemptReviewManage(params) {
            return post("/sysExemptReviewManage/deleteExemptReviewManage", params);
        },
        // 推荐通道及通道组列表
        listRecommendGatewayAndGroup(params) {
            return post("/sysGatewayGroup/listRecommendGatewayAndGroup", params);
        },
    },
    // 审核管理-待审模板
    smsCheckTemplate: {
        // 查询列表
        listCheckTemplateByPage(params) {
            return post("/smsCheckTemplate/listCheckTemplateByPage", params);
        },
        // 修改
        updateCheckTemplate(params) {
            return post("/smsCheckTemplate/updateCheckTemplate", params);
        },
    },
    // 用户利润查询
    smsProfit: {
        // 查询列表
        queryByPage(params) {
            return post("/smsProfit/queryByPage", params);
        },
        // 查询table下方数据
        queryAll(params) {
            return post("/smsProfit/queryAll", params);
        }
    },
    // 定时统计
    sysTimeTasklistStatistics: {
        // 查询列表
        queryTimeTaskByPage(params) {
            return post("/sysTimeTasklist/queryTimeTaskByPage", params);
        },
    },
    // 免审未发统计
    sysUnbilled: {
        // 查询列表
        queryNoSendByPage(params) {
            return fetch("/sysExemptReviewManage/queryNoSendByPage", params);
        },
        //  删除
        deleteExemptReviewManage(params) {
            return post("/sysExemptReviewManage/deleteExemptReviewManage", params);
        },
    },



    //提交统计
    submitStatistics: {
        // 查询列表
        submitStatistics(params) {
            return fetch("/report/submitStatistics", params);
        },
        //统计
        submitStatisticsTotal(params) {
            return fetch("/report/submitStatisticsTotal", params);
        },
    },
    //投诉统计
    smsComplaint: {
        // 查询列表
        queryStatisticByPage(params) {
            return post("/sysComplaint/queryStatisticByPage", params);
        },
        //统计
        TypeStatistic(params) {
            return fetch("/sysComplaint/querySmsComplaintTypeStatistic", params);
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
        // 停止
        stopGateway(params) {
            return post("/gateway/stopGateway", params);
        },
        // 启用
        startGateway(params) {
            return post("/gateway/startGateway", params);
        },
        //配置
        updateGatewayByConfigure(params) {
            return post("/gateway/updateGatewayByConfigure", params);
        },
    },
    //彩信通道
    mmsGateway: {
        // 分页查询列表
        listMmsGatewayByPage(params) {
            return post("/mmsGateway/listMmsGatewayByPage", params);
        },
        // 删除
        deleteMmsGateway(params) {
            return post("/mmsGateway/deleteMmsGateway", params);
        },
        // 修改
        updateMmsGateway(params) {
            return post("/mmsGateway/updateMmsGateway", params);
        },
        // 添加
        addMmsGateway(params) {
            return post("/mmsGateway/addMmsGateway", params);
        },
        // 修改彩信网关状态
        setMmsGatewayStatus(params) {
            return post("/mmsGateway/setMmsGatewayStatus", params);
        },
        // 彩信通道详情查询
        detailMmsGateway(params) {
            return fetch("/mmsGateway/detailMmsGateway", params);
        },
        // 小窗口登录验证接口
        viewLogin(params) {
            return post("/sysLogin/viewLogin", params);
        }
    },
    //测试发送接口
    smsTestSendTask: {
        // 分页查询列表
        send(params) {
            return post("/smsSendTask/send", params);
        },
    },
    //代理商
    agent: {
        // 分页查询列表
        queryByPage(params) {
            return post("/agent/queryByPage", params);
        },
        // 删除
        delete(params) {
            return fetch("/agent/delete", params);
        },
        // 添加/修改
        addOrUpdate(params) {
            return post("/agent/addOrUpdate", params);
        },
        // 修改代理商状态
        updateStatus(params) {
            return post("/agent/updateStatus", params);
        },
        // 查询有效代理商
        queryAgent(params) {
            return post("/agent/queryAgent", params);
        },
    },
    tags: {
        //查询列表
        tagList(params) {
            return fetch("/sms/tag", params)
        },
        //新增
        submitTag(params) {
            return post("/sms/tag", params)
        },
        //修改
        editTag(params) {
            return put("/sms/tag", params)
        },
        //删除
        delTag(id) {
            return del(`/sms/tag/${id}`)
        }
    },
    //标签管理
    smsTagController: {
        // 分页查询列表
        listTag(params) {
            return fetch("/sms/tag", params);
        }
    },
    //批量保存渠道标签
    smsChannelTagController: {
        // 短信通道添加/修改标签
        batchSave(params) {
            return post("/sms/channel/tag/batch-save", params);
        }
    },
    //批量保存渠道标签
    userTag: {
        // 账户添加/修改标签
        batchSave(params) {
            return post("/userTag/batchSave", params);
        }
    },
    //客户对账单
    customerStatement: {
        // 修改实付金额
        updateMoney(params) {
            return post("/userBalanceMonthBill/updateMoney", params);
        },
        // 修改账单状态
        updateStatus(params) {
            return post("/userBalanceMonthBill/updateStatus", params);
        },
        // 客户对账单查询
        userBalanceMonthBillList(params) {
            return post("/userBalanceMonthBill/userBalanceMonthBillList", params);
        }
    },
    //客户对账单
    sysDownLoadLog: {
        // 分页列表
        queryByPage(params) {
            return post("/sysDownLoadLog/queryByPage", params);
        },
        // 下载文件
        download(params) {
            return downLoadGet("/sysDownLoadLog/download", params);
        },

    },
    //用户监控配置管理
    sysAlarmUser: {
        // 查询用户监控配置数据(列表)
        queryAlarmUserByPage(params) {
            return post("/sysAlarmUser/queryAlarmUserByPage", params);
        },
        // 根据账户编号，报警类型查询数据
        queryOneAlarmUserByUserID(params) {
            return post("/sysAlarmUser/queryOneAlarmUserByUserID", params);
        },
        // 保存用户监控配置数据
        saveAlarmUser(params) {
            return put("/sysAlarmUser/saveAlarmUser", params);
        }
    },
    //签名发送
    reports: {
        // 签名发送统计分页查询
        querySignSendStatic(params) {
            return post("/report/querySignSendStatic", params);
        },
        // 签名发送统计数据查询
        querySignSendTotal(params) {
            return post("/report/querySignSendTotal", params);
        },
        // 导出签名发送统计
        exportSignSendTotal(params) {
            return post("/report/exportSignSendTotal", params);
        },
        // 查询到达延时统计分页列表
        queryArrivalDelayStatic(params) {
            return post("/report/queryArrivalDelayStatic", params);
        },
        // 导出到达延时统计分页列表
        exportArrivalDelayStatic(params) {
            return post("/report/exportArrivalDelayStatic", params);
        },
        // 查询商户月发送统计分页列表
        queryMerchSendSuccStatistics(params) {
            return post("/report/queryMerchSendSuccStatistics", params);
        },
        // 导出商户月发送统计分页列表
        exportMerchSendSuccStatistics(params) {
            return post("/report/exportMerchSendSuccStatistics", params);
        }
    },
    //彩信账号网关初始配置
    MMSgatewayInitial: {
        // 彩信账号网关初始配置列表分页查询
        queryByPage(params) {
            return post("/mmsInitUserGateway/queryByPage", params);
        },
        // 根据用户id查
        selectMmsInitUserGatewayByUserID(params) {
            return fetch("/mmsInitUserGateway/selectMmsInitUserGatewayByUserID", params);
        },
        // 根据运营商查询彩信网关
        selectMmsInitUserGatewayDtoByUserID(params) {
            return fetch("/mmsInitUserGateway/selectMmsInitUserGatewayDtoByUserID", params);
        },
        // 修改彩信账号网关初始配置
        update(params) {
            return post("/mmsInitUserGateway/update", params);
        }
    },
    //携号转网
    networkChange: {
        // 携号转网列表分页查询
        queryByPage(params) {
            return post("/networkChange/queryByPage", params);
        },
        // 批量导入携号转网
        importBatchAdd(params) {
            return post("/networkChange/importBatchAdd", params);
        },
        // 导出携号转网
        export(params) {
            return post("/corpUserBalance/downLoad", params);
        },
        // 删除携号转网
        delete(params) {
            return fetch("/networkChange/delete", params);
        },
        // 新增修改携号转网
        addOrUpdate(params) {
            return post("/networkChange/addOrUpdate", params);
        },

    },
    //黑名单分类
    smsBlackGroup: {
        // 列表分页查询
        listBlackGroupByPage(params) {
            return post("/smsBlackGroup/listBlackGroupByPage", params);
        },
        // 列表全部查询
        listBlackGroup(params) {
            return post("/smsBlackGroup/listBlackGroup", params);
        },
        // 删除
        delete(params) {
            return fetch("/smsBlackGroup/delete", params);
        },
        // 新增修改
        addOrUpdate(params) {
            return post("/smsBlackGroup/addOrUpdate", params);
        },
    },
    // 号段管理
    smsAppConfig: {
        // 新增号段
        addOrUpdate(params) {
            return post("/smsAppConfig/addOrUpdate", params);
        },
        // 查询号段
        getAppConfigList(params) {
            return fetch("/smsAppConfig/getAppConfigList", params);
        },

    },
    //黑名单分类
    moSensitiveWord: {
        // 列表分页查询
        queryByPage(params) {
            return post("/moSensitiveWord/queryByPage", params);
        },
        // 新增修改
        addOrUpdate(params) {
            return post("/moSensitiveWord/addOrUpdate", params);
        },
        // 根据用户id查
        selectMmsInitUserGatewayByUserID(params) {
            return fetch("/mmsInitUserGateway/selectMmsInitUserGatewayByUserID", params);
        },
        // 根据运营商查询彩信网关
        selectMmsInitUserGatewayDtoByUserID(params) {
            return fetch("/mmsInitUserGateway/selectMmsInitUserGatewayDtoByUserID", params);
        },
        // 修改彩信账号网关初始配置
        update(params) {
            return post("/mmsInitUserGateway/update", params);
        }
    },
    //彩信发送记录
    mmsSendReturnReport: {
        // 彩信发送记录列表分页查询
        queryByPage(params) {
            return post("/mmsSendReturnReport/queryByPage", params);
        }
    },
    //彩信发送统计
    mmsReportStatistic: {
        // 彩信发送统计列表分页查询
        queryByPage(params) {
            return post("/mmsReportStatistic/queryByPage", params);
        },
        // 导出彩信发送统计
        exportReportStatistic(params) {
            return post("/mmsReportStatistic/exportReportStatistic", params);
        },
        // 查询table下方数据
        queryAll(params) {
            return post("/mmsReportStatistic/queryAll", params);
        }
    },
    //彩信模板提审/审核
    mmsTemplateCheck: {
        // 提审列表
        listByPage(params) {
            return post("/mmsTemplateCheck/listByPage", params);
        },
        // 模板预览
        getTemplateDetail(params) {
            return fetch("/mmsTemplateCheck/getTemplateDetail", params);
        },
        // 模板提审
        pushGatewayArraign(params) {
            return fetch("/mmsTemplateCheck/pushGatewayArraign", params);
        },
        // 部分通过
        partilyPass(params) {
            return fetch("/mmsTemplateCheck/partilyPass", params);
        },
        // 驳回模板
        refuseBasicArragin(params) {
            return fetch("/mmsTemplateCheck/refuseBasicArragin", params);
        },
        // 通道配置
        gatewayConfig(params) {
            return post("/mmsTemplateCheck/gatewayConfig", params);
        }
    },
    //彩信分类统计
    mmsClassificationStatistic: {
        // 彩信分类统计列表
        listByPage(params) {
            return post("/mmsClassificationStatistic/listByPage", params);
        },
        // 彩信分类统计总计
        showStatistic(params) {
            return post("/mmsClassificationStatistic/showStatistic", params);
        },
        // 彩信分类统计列表导出
        exportData(params) {
            return post("/mmsClassificationStatistic/exportData", params);
        }
    },
    //彩信模板审核记录
    mmsTemplateCheckRecord: {
        // 彩信模板审核记录列表
        listByPage(params) {
            return post("/mmsTemplateCheckRecord/listByPage", params);
        }
    },
    //状态码统计
    SmsStatusCodeStatistics: {
        // 状态码统计列表分页查询
        queryByPage(params) {
            return post("/SmsStatusCodeStatistics/queryByPage", params);
        },
        // 导出状态码统计
        exportSmsStatusCodeStatistics(params) {
            return post("/SmsStatusCodeStatistics/exportSmsStatusCodeStatistics", params);
        }
    }
}