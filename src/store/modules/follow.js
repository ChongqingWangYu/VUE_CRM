import {
  addFollow,
  deleteFollow,
  findPageFollow,
  getAllFollow,
  updateFollow,
  uploadExcel
} from '@/api/follow'
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
  deleteFollow({}, id) {
    var json = {followID: id}
    json = qs.stringify(json)
    return new Promise((resolve, reject) => {
      deleteFollow(json).then(response => {
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
  findPageFollow({}, pageQueryDTO) {
    pageQueryDTO = qs.stringify(pageQueryDTO)
    return new Promise((resolve, reject) => {
      findPageFollow(pageQueryDTO).then(response => {
        resolve(response);
      }).catch(error => {
        console.log(error);
        reject(error);
      })
    })
  },
  getAllFollow({}) {
    return new Promise((resolve, reject) => {
      getAllFollow().then(response => {
        Msg.success(response.message)
        resolve(response);
      }).catch(error => {
        console.log(error);
        reject(error);
      })
    })
  },
  updateFollow({}, follow) {
    follow = qs.stringify(follow)
    return new Promise((resolve, reject) => {
      updateFollow(follow).then(response => {
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
  addFollow({}, customer) {
    customer = qs.stringify(customer)
    return new Promise((resolve, reject) => {
      addFollow(customer).then(response => {
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

