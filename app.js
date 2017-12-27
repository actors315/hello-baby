//app.js
App({
  onLaunch: function () {
    //this.checkLogin();
  },
  checkLogin:function(callback){
    if (this.globalData.hasLogin === false){
      const that = this;
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: "https://wechat.lingyin99.com/hello-baby/user/login",
            data: { code: res.code },
            success: res => {
              that.globalData.hasLogin = true;
              that.globalData.simpleUserInfo = res.data; 
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
    simpleUserInfo:null
  }
})