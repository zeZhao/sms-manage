import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: {
      token
    }
  })
}

export function logout() {
  return request({
    url: '/sysLogin/logout',
    method: 'get'
  })
}

export function loginByUsername(data) {
  return request({
    url: '/sysLogin/login',
    method: 'post',
    data
  })
}
export function googleAuthLogin(data) {
  return request({
    url: '/sysLogin/googleAuthLogin',
    method: 'post',
    data
  })
}

export function getAuthMenu(token) {
  return request({
    url: 'sysMenu/selectSysMenus',
    method: 'get',
    params: {
      token
    }
  })
}
