import {
  addCustomer,
  deleteCustomer,
  findPageCustomer,
  getAllCustomer,
  updateCustomer,
  uploadExcel
} from '@/api/customer'
import {Msg} from '@/utils/message'
import qs from 'qs'

const actions = {
  uploadExcel({}, rawFile) {
    console.log("uploadExcel")
    let file = new FormData()
    file.append("file", rawFile)
    return new Promise((resolve, reject) => {
      uploadExcel(file).then(response => {
        switch (response.data) {
          case "succeed":
            Msg.success(response.message);
            break;
          case "warn":
            Msg.warn(response.message);
            break;
          case "info":
            Msg.info(response.message);
            break;
        }
        resolve();
      }).catch(error => {
        console.log(error);
        reject(error);
      })
    })
  },
  deleteCustomer({}, id) {
    var json = {cusId: id}
    json = qs.stringify(json)
    return new Promise((resolve, reject) => {
      deleteCustomer(json).then(response => {
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
  findPageCustomer({}, pageQueryDTO) {
    pageQueryDTO = qs.stringify(pageQueryDTO)
    return new Promise((resolve, reject) => {
      findPageCustomer(pageQueryDTO).then(response => {
        resolve(response);
      }).catch(error => {
        console.log(error);
        reject(error);
      })
    })
  },
  getAllCustomer({}) {
    return new Promise((resolve, reject) => {
      getAllCustomer().then(response => {
        Msg.success(response.message)
        resolve(response);
      }).catch(error => {
        console.log(error);
        reject(error);
      })
    })
  },
  updateCustomer({}, customer) {
    customer = qs.stringify(customer)
    return new Promise((resolve, reject) => {
      updateCustomer(customer).then(response => {
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
  addCustomer({}, customer) {
    customer = qs.stringify(customer)
    return new Promise((resolve, reject) => {
      addCustomer(customer).then(response => {
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

