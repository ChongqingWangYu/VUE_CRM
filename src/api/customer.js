import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/customer/findAllCustomer',
    method: 'get',
    params
  })
}
export function uploadExcel(data) {
  return request({
    url: '/customer/importCustomerFromExcel',
    headers: {'content-type':'multipart/form-data'},
    method: 'post',
    data
  })
}
