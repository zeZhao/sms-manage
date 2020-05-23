import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/sys/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/api/sys/logout',
    method: 'post'
  })
}

export function loginByUsername(data) {
  return request({
    url: '/api/sysLogin/login',
    method: 'post',
    data
  })
}

export function getAuthMenu(token) {
  return request({
    url: '/api/sysMenu/selectSysMenus',
    method: 'get',
    params: { token }
  })
}



