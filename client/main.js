import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';

// 引入 ECharts 主模块
// var echarts = require('echarts/lib/echarts');
var echarts = require('echarts');

Template.charts.events({
	"click #chart01":function(e) {
		e.preventDefault();
		drawChart01();
	},
	"click #chart02":function(e) {
		e.preventDefault();
		drawChart02();
	}
});

function drawChart01() {
	var myChart = echarts.init(document.getElementById('demo'));
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: 'ECharts 入门示例'
        },
        tooltip: {

        },
        legend: {
            data:['销量']
        },
        xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

function drawChart02() {
	var myChart = echarts.init(document.getElementById('demo'));
	myChart.setOption({
	    series : [
	        {
	            name: '访问来源',
	            type: 'pie',
	            radius: '55%',
	            data:[
	                {value:400, name:'搜索引擎'},
	                {value:335, name:'直接访问'},
	                {value:310, name:'邮件营销'},
	                {value:274, name:'联盟广告'},
	                {value:235, name:'视频广告'}
	            ]
	        }
	    ]
	})
}