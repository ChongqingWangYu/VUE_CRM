import { uploadExcel } from '@/api/customer'
import {Msg} from '@/utils/message';
import qs from 'qs'

const actions = {
  uploadExcel({},rawFile) {
    let file=new FormData()
    file.append("file",rawFile)
    return new Promise((resolve, reject) => {
      uploadExcel(file).then(response => {
        console.log(response);
        Msg.success(response.massage);
        resolve();
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

