var echarts = require('echarts');
Meteor.methods({
    drawChart04:function() {
    	var myChart = echarts.init(document.getElementById('demo'));
		var app = {};
		option = null;

		option = {
		    xAxis: {
		        type: 'value'
		    },
		    yAxis: {
		        type: 'value'
		    },
		    dataZoom: [
		        {
		            type: 'slider',
		            xAxisIndex: 0,
		            start: 10,
		            end: 60
		        },
		        {
		            type: 'inside',
		            xAxisIndex: 0,
		            start: 10,
		            end: 60
		        },
		        {
		            type: 'slider',
		            yAxisIndex: 0,
		            start: 30,
		            end: 80
		        },
		        {
		            type: 'inside',
		            yAxisIndex: 0,
		            start: 30,
		            end: 80
		        }
		    ],
		    series: [
		        {
		            name: 'scatter',
		            type: 'scatter',
		            itemStyle: {
		                normal: {
		                    opacity: 0.8
		                }
		            },
		            symbolSize: function (val) {
		                return val[2] * 40;
		            },
		            data: [["14.616","7.241","0.896"],["3.958","5.701","0.955"],["2.768","8.971","0.669"],["9.051","9.710","0.171"],["14.046","4.182","0.536"],["12.295","1.429","0.962"],["4.417","8.167","0.113"],["0.492","4.771","0.785"],["7.632","2.605","0.645"],["14.242","5.042","0.368"]]
		        }
		    ]
		};
		if (option && typeof option === "object") {
		    myChart.setOption(option, true);
		}
    }
})