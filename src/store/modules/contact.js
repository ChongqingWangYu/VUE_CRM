import {
  addContact,
  deleteContact,
  findPageContact,
  getAllContact,
  updateContact,
  uploadExcel
} from '@/api/contact'
import {Msg} from '@/utils/message'
import qs from 'qs'

const actions = {
  uploadExcel({}, rawFile) {
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
          case "error":
            Msg.error(response.message);
            break;
        }
        resolve();
      }).catch(error => {
        console.log(error);
        reject(error);
      })
    })
  },
  deleteContact({}, id) {
    var json = {contactID: id}
    json = qs.stringify(json)
    return new Promise((resolve, reject) => {
      deleteContact(json).then(response => {
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
  findPageContact({}, pageQueryDTO) {
    pageQueryDTO = qs.stringify(pageQueryDTO)
    return new Promise((resolve, reject) => {
      findPageContact(pageQueryDTO).then(response => {
        resolve(response);
      }).catch(error => {
        console.log(error);
        reject(error);
      })
    })
  },
  getAllContact({}) {
    return new Promise((resolve, reject) => {
      getAllContact().then(response => {
        Msg.success(response.message)
        resolve(response);
      }).catch(error => {
        console.log(error);
        reject(error);
      })
    })
  },
  updateContact({}, contact) {
    contact = qs.stringify(contact)
    return new Promise((resolve, reject) => {
      updateContact(contact).then(response => {
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
  addContact({}, customer) {
    customer = qs.stringify(customer)
    return new Promise((resolve, reject) => {
      addContact(customer).then(response => {
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

