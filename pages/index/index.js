'use strict';

const util = require('../../utils/util.js');

const app = getApp()

let choose_year = null,
	choose_month = null;
const conf = {
	data: {
		hasEmptyGrid: false,
		showPicker: false,
    showEvent: false,
    csrfToken : ''
	},
	onLoad() {
    wx.showLoading({
      title: '加载中',
    })

		const date = new Date();
		const cur_year = date.getFullYear();
		const cur_month = date.getMonth() + 1;
		const weeks_ch = [ '日', '一', '二', '三', '四', '五', '六' ];
		this.calculateEmptyGrids(cur_year, cur_month);
		this.calculateDays(cur_year, cur_month);
		this.setData({
			cur_year,
			cur_month,
			weeks_ch
		});
	},
	getThisMonthDays(year, month) {
		return new Date(year, month, 0).getDate();
	},
	getFirstDayOfWeek(year, month) {
		return new Date(Date.UTC(year, month - 1, 1)).getDay();
	},
	calculateEmptyGrids(year, month) {
		const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
		let empytGrids = [];
		if (firstDayOfWeek > 0) {
			for (let i = 0; i < firstDayOfWeek; i++) {
				empytGrids.push(i);
			}
			this.setData({
				hasEmptyGrid: true,
				empytGrids
			});
		} else {
			this.setData({
				hasEmptyGrid: false,
				empytGrids: []
			});
		}
	},
	calculateDays(year, month) {

    let that = this
		let days = [];
    
		const thisMonthDays = this.getThisMonthDays(year, month);

		for (let i = 1; i <= thisMonthDays; i++) {
			days.push({
				day: i,
				choosed: false
			});
		}

    let queryMonth = year + '' + util.formatNumber(month);

    app.checkLogin(_queryEvent)

    function _queryEvent(){
      wx.request({
        url: "https://wechat.lingyin99.com/hello-baby/event/month",
        data: { api_token: app.globalData.simpleUserInfo.api_token, month: queryMonth },
        success: function (res) {
          if (res.statusCode == 200 && res.data.status == 0) {
            let data = res.data.list;
            for (let i in days) {
              if (i in data) {
                days[i].makeLove = data[i]['make_love'] == undefined ? 0 : data[i]['make_love']
                days[i].menstruation = data[i]['menstruation'] == undefined ? 0 : data[i]['menstruation']
                days[i].pregnant = data[i]['pregnant'] == undefined ? 0 : data[i]['pregnant']
              }
            }
          }
        },
        complete: function () {
          that.setData({
            days
          });
          wx.hideLoading();
        }
      });	
    }
	},
	handleCalendar(e) {
		const handle = e.currentTarget.dataset.handle;
		const cur_year = this.data.cur_year;
		const cur_month = this.data.cur_month;
		if (handle === 'prev') {
			let newMonth = cur_month - 1;
			let newYear = cur_year;
			if (newMonth < 1) {
				newYear = cur_year - 1;
				newMonth = 12;
			}

			this.calculateDays(newYear, newMonth);
			this.calculateEmptyGrids(newYear, newMonth);

			this.setData({
				cur_year: newYear,
				cur_month: newMonth
			});

		} else {
			let newMonth = cur_month + 1;
			let newYear = cur_year;
			if (newMonth > 12) {
				newYear = cur_year + 1;
				newMonth = 1;
			}

			this.calculateDays(newYear, newMonth);
			this.calculateEmptyGrids(newYear, newMonth);

			this.setData({
				cur_year: newYear,
				cur_month: newMonth
			});
		}
	},
	tapDayItem(e) {
		const idx = e.currentTarget.dataset.idx;
		const days = this.data.days;
		for(let i in days){
      days[i].choosed = false;
    }
    days[idx].choosed = !days[ idx ].choosed;

    const that = this;

    let makeLove = 0, menstruation = 0, pregnant = 0, csrfToken = '';
    let date = this.data.cur_year + '' + util.formatNumber(this.data.cur_month) + '' + util.formatNumber(days[idx].day);

    wx.request({
      url: "https://wechat.lingyin99.com/hello-baby/event/update",
      data: { api_token: app.globalData.simpleUserInfo.api_token,date: date},
      success : function(res){
        makeLove = parseInt(res.data.make_love);
        menstruation = parseInt(res.data.menstruation);
        pregnant = parseInt(res.data.pregnant);

        that.setData({
          days,
          showEvent: true,
          showPicker: false,
          picker_year: that.data.cur_year,
          picker_month: that.data.cur_month,
          picker_day: days[idx].day,
          makeLove: makeLove,
          menstruation: menstruation,
          pregnant: pregnant
        });
      }
    });		
	},
	chooseYearAndMonth() {
		const cur_year = this.data.cur_year;
		const cur_month = this.data.cur_month;
		let picker_year = [],
			picker_month = [];
		for (let i = 1900; i <= 2100; i++) {
			picker_year.push(i);
		}
		for (let i = 1; i <= 12; i++) {
			picker_month.push(i);
		}
		const idx_year = picker_year.indexOf(cur_year);
		const idx_month = picker_month.indexOf(cur_month);
		this.setData({
			picker_value: [ idx_year, idx_month ],
			picker_year,
			picker_month,
      showEvent: false,
			showPicker: true,
		});
	},
	pickerChange(e) {
		const val = e.detail.value;
		choose_year = this.data.picker_year[val[0]];
		choose_month = this.data.picker_month[val[1]];
	},
	tapPickerBtn(e) {
		const type = e.currentTarget.dataset.type;
		const o = {
			showPicker: false,
		};
		if (type === 'confirm') {
			o.cur_year = choose_year;
			o.cur_month = choose_month;
			this.calculateEmptyGrids(choose_year, choose_month);
			this.calculateDays(choose_year, choose_month);
		}
		this.setData(o);
	},
  switchEvent(e){
    app.checkLogin();

    const attr_name = e.currentTarget.dataset.attr;
    const event_type = e.currentTarget.dataset.event;
    const status = e.detail.value ? 1 : 0;
    const date = this.data.picker_year + '' + util.formatNumber(this.data.picker_month) + '' + util.formatNumber(this.data.picker_day);
    const that = this;
    wx.request({
      url: "https://wechat.lingyin99.com/hello-baby/event/update",
      data: {
        api_token: app.globalData.simpleUserInfo.api_token,
        event_type: event_type,
        status:status,
        date:date
      },
      method : 'POST',
      success:function(res){
        if (res.statusCode == 200 && res.data.status == 0){
          console.log("成功");
        } else {
          wx.showToast({
            title: '记录失败',
            duration: 2000
          });
          let o = new Object();
          o[attr_name] = !status;
          that.setData(o);
        }
      }
    })
  },
	onShareAppMessage() {
		return {
			title: '孕宝手记',
			desc: '简单，私密的孕期日历',
			path: 'pages/hello-baby/index'
		};
	}
};

Page(conf);
