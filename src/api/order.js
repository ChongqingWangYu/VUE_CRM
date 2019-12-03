import request from '@/utils/request'

export function findPageOrder(data) {
  return request({
    url: '/order/findPageOrder',
    method: 'post',
    data
  })
}
export function findOrderByCusID(data) {
  return request({
    url: '/order/findOrderByCusID',
    method: 'post',
    data
  })
}
export function getAllOrder() {
  return request({
    url: '/order/getAllOrder',
    method: 'get'
  })
}

export function uploadExcel(data) {
  return request({
    url: '/order/importOrderFromExcel',
    headers: {'content-type': 'multipart/form-data'},
    method: 'post',
    data
  })
}

export function deleteOrder(data) {
  return request({
    url: '/order/deleteOrder',
    method: 'post',
    data
  })
}

export function updateOrder(data) {
  return request({
    url: '/order/updateOrder',
    method: 'post',
    data
  })
}

export function addOrder(data) {
  return request({
    url: '/order/addOrder',
    method: 'post',
    data
  })
}
