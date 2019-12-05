import {
  getCustomerAllDataMonthlyStatistics
} from '@/api/charts'
import {Msg} from '@/utils/message'
import qs from 'qs'

const actions = {
  getCustomerAllDataMonthlyStatistics() {
    return new Promise((resolve, reject) => {
      getCustomerAllDataMonthlyStatistics().then(response => {
        resolve(response);
      }).catch(error => {
        console.log(error);
        reject(error);
      })
    })
  }
}

export default {
  namespaced: true,
  actions
}

