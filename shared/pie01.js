var echarts = require('echarts');
Meteor.methods({
    drawChart02:function() {
    	var myChart = echarts.init(document.getElementById('demo'));
    	var data = [
	                {value:400, name:'搜索引擎'},
	                {value:335, name:'直接访问'},
	                {value:310, name:'邮件营销'},
	                {value:274, name:'联盟广告'},
	                {value:235, name:'视频广告'}
	            ];
		myChart.setOption({
		// backgroundColor: '#2c343c',
		textStyle: {
	        color: 'rgba(255, 0, 0, 0.6)'
	    },
	    series : [
	        {
	            name: '访问来源',
	            type: 'pie',
	            radius: '55%',
	            roseType: true,
	            itemStyle: {
	            	//emphasis: {
				    //     shadowBlur: 200,
				    //     shadowColor: 'rgba(0, 0, 0, 0.5)'
				    // }
				    normal: {
				        // 阴影的大小
				        shadowBlur: 200,
				        // 阴影水平方向上的偏移
				        shadowOffsetX: 0,
				        // 阴影垂直方向上的偏移
				        shadowOffsetY: 0,
				        // 阴影颜色
				        shadowColor: 'rgba(0, 0, 0, 0.5)'
				    }
				},
				labelLine: {
				    normal: {
				        lineStyle: {
				            color: 'rgba(255, 0, 0, 0.8)'
				        }
				    }
				},
				itemStyle: {
				    normal: {
				        // 设置扇形的颜色
				        color: '#c23531',
				        shadowBlur: 200,
				        shadowColor: 'rgba(0, 0, 0, 0.5)'
				    }
				},
	            data: data
	        }
	    ]
	})
    }
})
