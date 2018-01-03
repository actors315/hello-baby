'use strict';

const Util = require('../../utils/util.js');
const Api = require('../../utils/api.js');
const EventInfo = require('../../api/eventInfo.js');

const app = getApp()

let choose_year = null,
	choose_month = null;

const conf = {
	data: {
		hasEmptyGrid: false,
		showPicker: false,
    showEvent: false
	},
  onLoad() {    
		const date = new Date();
		const cur_year = date.getFullYear();
		const cur_month = date.getMonth() + 1;
		const weeks_ch = [ '日', '一', '二', '三', '四', '五', '六' ]
    this.calculateEmptyGrids(cur_year, cur_month)
		this.setData({
			cur_year,
			cur_month,
			weeks_ch
		});
    this.calculateDays(cur_year, cur_month);
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
    let that = this;
    app.checkLogin(EventInfo.queryMonthEvent(that, year, month))    
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
		let idx = e.currentTarget.dataset.idx;
    let days = this.data.days;
    let menstruationIn = false,tempMe = false;
		for(let i in days){
      days[i].choosed = false;
    }
    days[idx].choosed = !days[ idx ].choosed;
    if (days[idx].menstruation == 2 || days[idx].menstruation_off == 1){
      menstruationIn = true
    }
    console.log(days[idx]);
    this.setData({
      days,
      showEvent: true,
      showPicker: false,
      picker_year: this.data.cur_year,
      picker_month: this.data.cur_month,
      picker_day: days[idx].day,
      makeLove: parseInt(days[idx].makeLove),
      menstruation: parseInt(days[idx].menstruation),
      menstruation_off: parseInt(days[idx].menstruation_off),
      pregnant: parseInt(days[idx].pregnant),
      menstruationIn: menstruationIn
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
    EventInfo.updateDayEevnt(this, e, this.data.picker_year, this.data.picker_month, this.data.picker_day)
  },
	onShareAppMessage() {
		return {
			title: '孕宝手记',
			desc: '简单，私密的孕期日历',
			path: 'pages/index/index'
		};
	}
};

Page(conf);
