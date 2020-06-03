import {post,fetch,patch,put,del} from './http'

/**
 * params 类型为Object
 */
export default {
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
    } ,
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
  nav:{
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
  corp:{
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
  corpUser:{
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
  sysResendConfig:{
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
  sysSignRoute:{
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
  sysSaleman:{
    // 销售人员
    queryAvailableSaleman(params) {
      return fetch("sysSaleman/queryAvailableSaleman", params);
    },
  },
  //发送上限
  sysSendLimit:{
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
  sysGatewayGroup:{
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
}
