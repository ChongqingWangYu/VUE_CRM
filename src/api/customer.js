import request from '@/utils/request'

export function findCustomer(data) {
  return request({
    url: '/customer/findAllCustomer',
    method: 'post',
    data
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
