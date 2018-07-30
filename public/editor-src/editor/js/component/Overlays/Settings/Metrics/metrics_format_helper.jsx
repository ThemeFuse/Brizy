var numeral = require('numeral');

var MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var MONTH_NAMES_SHORT = ['Jan','Feb ','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];


var DESCRIPTIONS = {
	day: 'last 10 days',
	week: 'last 12 weeks',
	month: 'last 12 months'
};

var formatDate = {
	monthAndDate: function (date_str) {
		var date = new Date(Date.parse(date_str.replace(/^(.+?),.*/i,"$1")));
		return MONTH_NAMES_SHORT[date.getMonth()] + " " + date.getDate();
	},
	monthShort: function (date_str) {
		var date = new Date(Date.parse(date_str));
		return MONTH_NAMES_SHORT[date.getMonth()];
	},
	month: function (date_str) {
		var date = new Date(Date.parse(date_str));
		return MONTH_NAMES[date.getMonth()];
	},
	periodDate: function (date_str) {
		var dateFrom = new Date(Date.parse(date_str.replace(/^(.+?),.*/i,"$1")));
		var dateTo = new Date(Date.parse(date_str.replace(/.*,(.+?)$/i,"$1")));
		return {
			dateFrom: MONTH_NAMES_SHORT[dateFrom.getMonth()] + " " + dateFrom.getDate(),
			dateTo: MONTH_NAMES_SHORT[dateTo.getMonth()] + " " + dateTo.getDate()
		};
	}
};

export default {
	numberFormat: function(num) {
		return numeral(num).format('0,0');
	},
	dateFormat: function(period, date_str) {
		if (period === 'month') {
			return formatDate.month(date_str);
		} else if (period === 'week') {
			var date = formatDate.periodDate(date_str);
			return date.dateFrom;
		} else if (period === 'day') {
			return formatDate.monthAndDate(date_str);
		}
	},
	getChartIntervalLabel: function(period, date_str) {
		if (period === 'month') {
			return formatDate.monthShort(date_str);
		} else if (period === 'week') {
			return formatDate.monthAndDate(date_str);
		} else if (period === 'day') {
			return formatDate.monthAndDate(date_str);
		}
	},
	getTotalDescriptionByPeriod: function(period) {
		return DESCRIPTIONS[period];
	}
};
