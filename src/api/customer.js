import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/customer/findAllCustomer',
    method: 'get',
    params
  })
}
