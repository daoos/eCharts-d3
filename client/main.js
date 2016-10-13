import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';

// 引入 ECharts 主模块
// var echarts = require('echarts/lib/echarts');

Template.charts.events({
	// for(var i=1;i<5;i++) {
	// 	var btn = " #chart" + i;
	// 	var chart = "drawChart" + i;
	// 	"click"+btn:function(e) {
	// 		e.preventDefault();
	// 		Meteor.call(chart);
	// 	}
	// }
	"click #chart01":function(e) {
		e.preventDefault();
		Meteor.call("drawChart01");
	},
	"click #chart02":function(e) {
		e.preventDefault();
		Meteor.call("drawChart02");
	},
	"click #chart03": function(e) {
		e.preventDefault();
		Meteor.call("drawChart03");
	},
	"click #chart04": function(e) {
		e.preventDefault();
		Meteor.call("drawChart04");
	},
	"click #chart05": function(e) {
		e.preventDefault();
		Meteor.call("drawChart05");
	},
	"click #chart06": function(e) {
		e.preventDefault();
		Meteor.call("drawChart06");
	},
	"click #chart07": function(e) {
		e.preventDefault();
		Meteor.call("drawChart07");
	},
	"click #chart08": function(e) {
		e.preventDefault();
		Meteor.call("drawChart08");
	}
});