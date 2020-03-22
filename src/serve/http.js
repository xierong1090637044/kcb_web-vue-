import Bmob from "hydrogen-js-sdk";
export default {
  httpPost(name, params) {
    params.uid = that.$store.state.userid;
    return new Promise((resolve, reject) => {
      Bmob.functions(name, params).then(function(res) {
        if (res.code == 1) {
          resolve(res.data)
        }
      })
    })
  }
}
