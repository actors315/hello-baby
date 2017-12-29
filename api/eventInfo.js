
const app = getApp()

const Util = require('../utils/util.js')
const Storage = require('../utils/storage.js')
const Api = require('../utils/api.js')

const queryMonthEvent = (obj,year,month) => {

  let queryMonth = year + '' + Util.formatNumber(month);

  let monthData = Storage.sync.get(queryMonth)

  let lastEventTime = Storage.sync.get('last_event_time')

  if (monthData && monthData.last_event_time >= lastEventTime){
    let days = monthData.days
    return obj.setData({days})
  }

  let days = [];

  const thisMonthDays = Util.getThisMonthDays(year, month);

  for (let i = 1; i <= thisMonthDays; i++) {
    days.push({
      day: i
    });
  }
  
  monthData = {
    days: days,
    last_event_time: 0
  }

  wx.showLoading({
    title: '加载中',
  })
  app.checkLogin(_queryEvent);

  function _queryEvent() {
    wx.request({
      url: Api.event.queryMonth,
      data: { api_token: app.globalData.simpleUserInfo.api_token, month: queryMonth },
      success: function (res) {
        if (res.statusCode == 200 && res.data.status == 0) {
          let data = res.data.list;
          for (let i in monthData.days) {
            if (i in data) {
              monthData.days[i].makeLove = data[i]['make_love'] == undefined ? 0 : parseInt(data[i]['make_love'])
              monthData.days[i].menstruation = data[i]['menstruation'] == undefined ? 0 : parseInt(data[i]['menstruation'])
              monthData.days[i].pregnant = data[i]['pregnant'] == undefined ? 0 : parseInt(data[i]['pregnant'])
            }
          }
        }
      },
      complete: function () {
        let days = monthData.days
        monthData.last_event_time = app.globalData.simpleUserInfo.last_event_time
        obj.setData({
          days
        });
        Storage.sync.set(queryMonth,monthData)
        wx.hideLoading();
      }
    });
  }
}

const updateDayEevnt = (obj,e,year,month,day) => {
  let attr_name = e.currentTarget.dataset.attr;
  let event_type = e.currentTarget.dataset.event;
  let status = e.detail.value ? 1 : 0;

  let queryMonth = year + '' + Util.formatNumber(month);

  let monthData = Storage.sync.get(queryMonth)

  let date = year + '' + month + '' + Util.formatNumber(day);

  wx.request({
    url: Api.event.update,
    data: {
      api_token: app.globalData.simpleUserInfo.api_token,
      event_type: event_type,
      status: status,
      date: date
    },
    method: 'POST',
    success: function (res) {
      if (res.statusCode == 200 && res.data.status == 0) {
        let idx = 0
        monthData.last_event_time = res.data.last_event_time
        for (let i in monthData.days) {        
          if (monthData.days[i].day == day){
            monthData.days[i][attr_name] = status
            idx = i
          }
        }
        Storage.sync.set(queryMonth, monthData)

        let days = monthData.days
        days[idx].choosed = true
        days[idx][attr_name] = status

        obj.setData({
          days
        });
        
      } else {
        wx.showToast({
          title: '记录失败',
          duration: 2000
        });
        let o = new Object();
        o[attr_name] = !status;
        obj.setData(o);
      }
    }
  })
}


module.exports = {
  queryMonthEvent: queryMonthEvent,
  updateDayEevnt: updateDayEevnt
}