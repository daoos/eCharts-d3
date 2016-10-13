var echarts = require('echarts');
Meteor.methods({
    drawChart01:function(){
        var myChart = echarts.init(document.getElementById('demo'));
        var l = ["销量"];
        var x = ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"];
        var y = [30, 20, 5, 80, 70, 10];

        // var xmlhttp = new XMLHttpRequest();
        // var url = "bar01.txt";
        // xmlhttp.onreadystatechange = function() {
        //     if (this.readyState == 4 && this.status == 200) {
        //         var myArr = JSON.parse(this.responseText);
        //         myFunction(myArr);
        //     }
        // };
        // xmlhttp.open("GET", url, true);
        // xmlhttp.send();

        // function myFunction(arr) {

        // }

        // 指定图表的配置项和数据
        var option = {
        title: {
            text: 'ECharts 入门示例'
        },
        tooltip: {

        },
        legend: {
            data: l
        },
        xAxis: {
            data: x
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            itemStyle: {
                normal: {
                    // 设置扇形的颜色
                    color: '#af8bbf',
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            data: y
        }]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    }
})