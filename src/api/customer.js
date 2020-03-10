import request from '@/utils/request'

export function findPageCustomer(data) {
  return request({
    url: '/customer/findPageCustomer',
    method: 'post',
    data
  })
}

export function getAllCustomerAddress() {
  return request({
    url: '/customer/getAllCustomerAddress',
    method: 'get'
  })
}

export function getAllCustomer() {
  return request({
    url: '/customer/getAllCustomer',
    method: 'get'
  })
}

export function uploadExcel(data) {
  return request({
    url: '/customer/importCustomerFromExcel',
    headers: {'content-type': 'multipart/form-data'},
    method: 'post',
    data
  })
}

export function deleteCustomer(data) {
  return request({
    url: '/customer/deleteCustomer',
    method: 'post',
    data
  })
}

export function updateCustomer(data) {
  return request({
    url: '/customer/updateCustomer',
    method: 'post',
    data
  })
}

export function addCustomer(data) {
  return request({
    url: '/customer/addCustomer',
    method: 'post',
    data
  })
}
