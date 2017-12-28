
const Api = require('./utils/api.js');
const Storage = require('./utils/storage.js');

App({
  onLaunch: function () {
    this.checkLogin();
  },
  checkLogin:function(callback){
    if (this.globalData.hasLogin === false){
      const that = this;
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: Api.user.checkLogin,
            data: { code: res.code },
            success: res => {
              that.globalData.hasLogin = true;
              that.globalData.simpleUserInfo = res.data; 
              Storage.sync.set('last_event_time', res.data.last_event_time)
              typeof callback == "function" && callback()
            }
          })
        }
      })
    } else {
      typeof callback == "function" && callback()
    }
  },
  globalData: {
    hasLogin: false,
    simpleUserInfo:null,
    last_event_time:0
  }
})