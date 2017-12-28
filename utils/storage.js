/**
 * 本地数据读写
 */

// 同步获取内容
const sync = {
  set : (key,value) => {
    try {
      return wx.setStorageSync(key, value)
    } catch (e) {
      return false
    }
  },
  get : key => {
    try{
      return wx.getStorageSync(key)
    }catch(e){
      return '';
    }
  },
  remove : key => {
    try{
      return wx.removeStorageSync(key)
    }catch(e){
      return false
    }
  }
}

const async = {

}

module.exports = {
  sync: sync,
  async: async
}