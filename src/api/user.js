import request from '@/utils/request'
export function login(data) {
  return request({
    baseURL:'http://127.0.0.1:8080',
    url: '/user/loginUser',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    baseURL:'http://127.0.0.1:8080',
    url: '/user/registerUser',
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
    url: '/user/logout',
    method: 'post'
  })
}
