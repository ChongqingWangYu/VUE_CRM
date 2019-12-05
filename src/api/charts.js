import request from '@/utils/request'

export function getCustomerAllDataMonthlyStatistics() {
  return request({
    url: '/charts/getCustomerAllDataMonthlyStatistics',
    method: 'get'
  })
}
