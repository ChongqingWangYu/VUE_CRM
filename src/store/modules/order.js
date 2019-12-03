import {
  addOrder,
  deleteOrder,
  findPageOrder,
  getAllOrder,
  updateOrder,
  uploadExcel,
  findOrderByCusID
} from '@/api/order'
import {Msg} from '@/utils/message'
import qs from 'qs'

const actions = {
  deleteOrder({}, id) {
    var json = {orderID: id}
    json = qs.stringify(json)
    return new Promise((resolve, reject) => {
      deleteOrder(json).then(response => {
        if (response.message != "删除失败") {
          Msg.success(response.message);
        } else {
          Msg.error(response.message);
        }
        resolve();
      }).catch(error => {
        console.log(error);
        reject(error);
      })
    })
  },
  findOrderByCusID({}, id) {
    var json = {cusID: id}
    json = qs.stringify(json)
    return new Promise((resolve, reject) => {
      findOrderByCusID(json).then(response => {
        resolve(response);
      }).catch(error => {
        console.log(error);
        reject(error);
      })
    })
  },
  findPageOrder({}, pageQueryDTO) {
    pageQueryDTO = qs.stringify(pageQueryDTO)
    return new Promise((resolve, reject) => {
      findPageOrder(pageQueryDTO).then(response => {
        resolve(response);
      }).catch(error => {
        console.log(error);
        reject(error);
      })
    })
  },
  getAllOrder({}) {
    return new Promise((resolve, reject) => {
      getAllOrder().then(response => {
        Msg.success(response.message)
        resolve(response);
      }).catch(error => {
        console.log(error);
        reject(error);
      })
    })
  },
  updateOrder({}, order) {
    order = qs.stringify(order)
    return new Promise((resolve, reject) => {
      updateOrder(order).then(response => {
        if (response.message != "修改失败") {
          Msg.success(response.message);
        } else {
          Msg.error(response.message);
        }
        resolve();
      }).catch(error => {
        console.log(error);
        reject(error);
      })
    })
  },
  addOrder({}, customer) {
    customer = qs.stringify(customer)
    return new Promise((resolve, reject) => {
      addOrder(customer).then(response => {
        if (response.data != "error") {
          Msg.success(response.message);
        } else {
          Msg.error(response.message);
        }
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

