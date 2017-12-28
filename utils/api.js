/**
 * 所有接口地址
 */

let isTest = true;

const testApi = {
  user:{
    checkLogin: 'https://wechat.lingyin99.com/hello-baby/user/login',
  },
  event:{
    queryMonth: "https://wechat.lingyin99.com/hello-baby/event/month",
    update: "https://wechat.lingyin99.com/hello-baby/event/update",
  }
}

const prodApi = {
  user: {
    checkLogin: 'https://hellobaby.lingyin99.com/hello-baby/user/login',
  },
  event: {
    queryMonth: "https://hellobaby.lingyin99.com/hello-baby/event/month",
    update: "https://hellobaby.lingyin99.com/hello-baby/event/update",
  }
}

let Api = isTest ? testApi : prodApi;

module.exports = Api;