$(function(){
    var dom = document.getElementById("container");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    var n = 10, m = 25, count_base = 20, signal_base = -90, base_size = 1, factor = 2;
    var sz_lat_base = 114.0548, sz_long_base = 22.5530, cs_lat_base = 113.0281, cs_long_base = 28.2238;
    var data = [], geoCoordMap = {};
    var unit_id, rdm01, rdm02, rdm03, rdm04, total_counts, avg_sigal, xiaoqu, lat, long, signal;

    //随机新建10个深圳小区作为测试
    for(var i = 0; i < n; i++) {
        unit_id = '00000' + i;
        //随机模拟每个小区的地理信息和基础开门数据
        rdm01 = (Math.random() * 10 + 15) / 10;
        rdm02 = (Math.random() * 7 + 7) / 10;
        rdm03 = (Math.random() * 15 - 1) / 100;
        rdm04 = (Math.random() * 7 - 1) / 100;
        total_counts = count_base * rdm01;
        avg_sigal = signal_base * rdm02;
        xiaoqu = {name: unit_id, value: [total_counts, avg_sigal]};
        data.push(xiaoqu);
        lat = sz_lat_base + rdm03;
        long = sz_long_base + rdm04;
        geoCoordMap[unit_id] = [lat, long];
    }

    //随机新建15个长沙小区作为测试
    for(var i = n; i < m; i++) {
        unit_id = '00000' + i;
        //随机模拟每个小区的地理信息和基础开门数据
        rdm01 = (Math.random() * 10 + 15) / 10;
        rdm02 = (Math.random() * 7 + 7) / 10;
        rdm03 = (Math.random() * 15 - 1) / 100;
        rdm04 = (Math.random() * 7 - 1) / 100;
        total_counts = count_base * rdm01;
        avg_sigal = signal_base * rdm02;
        xiaoqu = {name: unit_id, value: [total_counts, avg_sigal]};
        data.push(xiaoqu);
        lat = cs_lat_base + rdm03;
        long = cs_long_base + rdm04;
        geoCoordMap[unit_id] = [lat, long];
    }

    //实时数据更新测试，小区id范围[000000 - 000029]
    unit_id = '000000';
    signal = -70;
    for(var i=0, n=data.length; i<n; i++) {
        var nvalue = data[i].name;
        var cvalue = data[i].value[0];
        var svalue = data[i].value[1];
        if(unit_id == nvalue) {
            console.log(cvalue);
            data[i].value[0] += 1;
            data[i].value[1] = (cvalue * svalue + signal)/cvalue;
        }
    }

    var convertData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var geoCoord = geoCoordMap[data[i].name];
            if (geoCoord) {
                res.push({
                    name: data[i].name,
                    value: geoCoord.concat(data[i].value)
                });
            }
        }
        return res;
    };

    console.log(data[0]);
    console.log(geoCoordMap['000000']);
    console.log(convertData(data)[0]);

    // var convertedData = [
    //     convertData(data),
    //     convertData(data.sort(function (a, b) {
    //         return a.value - b.value;
    //     }).slice(0, 16))
    // ];
    // var category = [];
    // var bardata = [];
    // for(var i = 0, n = convertedData[1].length; i < n; i++) {
    //     var idx = convertedData[1][i];
    //     var cvalue = idx.name;
    //     var bdata = idx.value[2];
    //     category.push(cvalue);
    //     bardata.push(bdata);
    // }

    option = {
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicInOut',
        animationDurationUpdate: 1000,
        animationEasingUpdate: 'cubicInOut',
        bmap: {
            center: [114.114129, 22.550339],
            zoom: 13.5,
            roam: true,
            mapStyle: {
                styleJson: [{
                    'featureType': 'water',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#d1d1d1'
                    }
                }, {
                    'featureType': 'land',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#f3f3f3'
                    }
                }, {
                    'featureType': 'railway',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'on'
                    }
                }, {
                    'featureType': 'highway',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#fdfdfd'
                    }
                }, {
                    'featureType': 'highway',
                    'elementType': 'labels',
                    'stylers': {
                        'visibility': 'on'
                    }
                }, {
                    'featureType': 'arterial',
                    'elementType': 'geometry',
                    'stylers': {
                        'color': '#fefefe'
                    }
                }, {
                    'featureType': 'arterial',
                    'elementType': 'geometry.fill',
                    'stylers': {
                        'color': '#fefefe'
                    }
                }, {
                    'featureType': 'poi',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'on'
                    }
                }, {
                    'featureType': 'green',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'subway',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'on'
                    }
                }, {
                    'featureType': 'manmade',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#d1d1d1'
                    }
                }, {
                    'featureType': 'local',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#d1d1d1'
                    }
                }, {
                    'featureType': 'arterial',
                    'elementType': 'labels',
                    'stylers': {
                        'visibility': 'on'
                    }
                }, {
                    'featureType': 'boundary',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#fefefe'
                    }
                }, {
                    'featureType': 'building',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#d1d1d1'
                    }
                }, {
                    'featureType': 'label',
                    'elementType': 'labels.text.fill',
                    'stylers': {
                        'color': '#999999'
                    }
                }]
            }
        },
        
        tooltip : {
            padding: 10,
            backgroundColor: '#222',
            borderColor: '#777',
            borderWidth: 1,
            formatter: function (obj) {
                var name = obj.name;
                var value = obj.value;
                return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
                    + '小区编号:' + ' ' + name
                    + '</div>'
                    + '累计开门次数' + '：' + Math.round(value[2]) + '<br>'
                    + '平均信号强度' + '：' + Math.round(value[3]) + '<br>';
            }
        },
        
        series : [
            {
                name: 'xiqoqu',
                type: 'effectScatter',
                coordinateSystem: 'bmap',
                data: convertData(data),
                symbolSize: function (val) {
                    return base_size + val[2] / factor;
                },    
                showEffectOn: 'render',
                rippleEffect: {
                    brushType: 'stroke'
                },
                hoverAnimation: true,
                itemStyle: {
                    normal: {
                        color: 'green',
                        shadowBlur: 10,
                        shadowColor: '#333',
                        opacity: 0.3
                    }
                },
                zlevel: 1
                
            },
        ]
    };

    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }

})