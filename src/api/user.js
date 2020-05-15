import request from '@/utils/request'

export function update(data) {
  return request({
    url: 'http://localhost:8085/user/update',
    method: 'put',
    data
  })
}

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/getInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

// 获取路由
export const getRouters = () => {
  return request({
    url: 'http://localhost:8087/system/getRouters',
    method: 'get',
    params: {sysName:"客户关系管理系统"}
  })
}
