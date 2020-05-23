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
  }
}
