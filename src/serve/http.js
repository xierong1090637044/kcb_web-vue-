import Bmob from "hydrogen-js-sdk";
import { Message } from 'iview'
export default {
  Post(name, params) {
    params.uid = JSON.parse(localStorage.getItem('user')).objectId;
    return new Promise((resolve, reject) => {
      Bmob.functions(name, params).then(function(res) {
        if (res.code == 1) {
          Message.info(res.msg);
          resolve(res)
        }else{
          Message.error(res.msg);
        }
      })
    })
  }
}
