var str = "";
var table01_head = '<table style="width:100%; color:#319196" id="display-sum-data"><caption>智能小区开门总次数排行榜</caption><tr><th>小区名称</th><th>累计开门次数</th><th>平均信号强度</th>';
var table_foot = '</table>';
var table02_head = '<table style="width:100%; color:#319196" id="display-detail-data"><caption>智能小区实时开门数据</caption><tr class="tr1" style="color:#319196"><td>小区名称</td><td>开门时间</td><td>信号强度</td><td>开门方式</td><td>开门设备</td><td>网络状态</td><td>开门状态</td></tr>';
var k = 1;
var j = 1;
var success_counts = 0, fail_counts = 0, success_rate;
var top10 = [];
var app = {};
option = null;
var count_base = 15, signal_base = -90, base_size = 20, factor = 15, factor02 = 50;
var data = [], geoCoordMap = {}, new_open = [], province_data = [];
var rdm01, rdm02, rdm03, rdm04;
var myChart, unit_id, xiaoqu_name, total_counts, avg_sigal, xiaoqu, signal, open_status, network, open_door, city_code, city_name, province;
var lat = 0, lng = 0, pl;

$(function(){
    
    getUnitArea();
    
    function getUnitArea(){
        $.ajax({
            url: 'location.json',
            dataType:'json',
            success: function(result){
                for(var i=0, n=result.length; i<n; i++) {
                    unit_id = result[i].unit_id;
                    xiaoqu_name = result[i].name;
                    city_code = result[i].city_code;
                    city_name = result[i].city_name;
                    province = result[i].province;
                    lat = Number(result[i].lat);
                    lng = Number(result[i].lng);
                    create_xiaoqu(unit_id, xiaoqu_name, lat, lng, city_code, city_name, province);
                    pl = province_data.length;
                    create_province(lat, lng, province, total_counts, avg_sigal, pl);
                }
                //然后加载百度  echarts图表
                loadEChart(data, geoCoordMap);
                loadGauge();
            },
            error: function(){
                alert("数据未能正常加载，请确保资源存在！");
            }
        });
    }
});

function convertData(data, geoCoordMap) {
    var res = [];
    for(var i=0; i<data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
         if (geoCoord) {
            res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value)
            });
        }
    }
    return res;
}

function create_xiaoqu(unit_id, xiaoqu_name, lat, lng, city_code, city_name, province) {
    //rdm01 = (Math.random() * 8 + 2) / 10;
    rdm01 = 1;
    rdm02 = (Math.random() * 7 + 7) / 10;
    total_counts = count_base * rdm01;
    avg_sigal = signal_base * rdm02;
    xiaoqu = {name: unit_id, value: [total_counts, avg_sigal]};
    data.push(xiaoqu);
    geoCoordMap[unit_id] = [lat, lng, xiaoqu_name, province, city_name, city_code];
}

function create_province(lat, lng, province, total_counts, avg_sigal, pl) {
    var p = 0; 
    for(var i=0; i<pl; i++) {
        //有则改之，无则加勉
        if(province == province_data[i].name) {
            p = 1;
            var old_counts = province_data[i].value[3];
            var old_signal = province_data[i].value[4];
            province_data[i].value[3] = old_counts + total_counts;
            province_data[i].value[4] = (old_signal + avg_sigal)/2;
            province_data[i].value[5] += 1;
        }
    }
    if(p == 0 || pl == 0) {
        var p_new = {name: province, value: [lat, lng, province, total_counts, avg_sigal, j]};
        province_data.push(p_new);
    }
}

function point_effect(times, open_status) {
    if(open_status == '6' || open_status == '7') {
        option.series[1].itemStyle.normal.color = 'green';
    } else {
        option.series[1].itemStyle.normal.color = 'red';
    }
    option.series[1].data = convertData(new_open, geoCoordMap);
    myChart.setOption(option, true);
    
    if(times == 1) {
        setTimeout(function() {
            option.series[1].data = [];
            myChart.setOption(option, true);
        }, 1000)
    } else {
        for(var i=1; i<times; i++) {
            option.series[1].data = option.series[1].data.slice(1, times);
            new_open = new_open.slice(1, new_open.length);
            setTimeout(function() {     
                //每个1秒去掉新开门数组中索引为0的元素，避免该小区没人开门也一直闪烁 
                if(option.series[1].data.length == 1) {
                    option.series[1].data = [];
                }
                myChart.setOption(option, true);
            }, 1000)
        }
        return new_open;
    }
}

function loadEChart(data, geoCoordMap) {
    var dom = document.getElementById("main");
    myChart = echarts.init(dom);
    option = {
    	backgroundColor: '#000000',
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicInOut',
        animationDurationUpdate: 1000,
        animationEasingUpdate: 'cubicInOut',
        bmap: {
            center: [117.0600, 30.0000],
            zoom: 6.8,
            roam: true,
            mapStyle: {
            	styleJson: [
               {
                    'featureType': 'water',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#000000'
                    }
                }, 
                {
                    'featureType': 'land',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#000000'
                    }
                }, 
                {
                    'featureType': 'railway',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'on',
                        'color': '#319296'
                    }
                }, 
                {
                    'featureType': 'railway',
                    'elementType': 'labels',
                    'stylers': {
                        'visibility': 'on'
                    }
                }, 
                {
                    'featureType': 'highway',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#319296'
                    }
                }, 
                {
                    'featureType': 'highway',
                    'elementType': 'labels',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, 
                {
                    'featureType': 'arterial',
                    'elementType': 'geometry',
                    'stylers': {
                        'color': '#000000'
                    }
                }, 
                {
                    'featureType': 'arterial',
                    'elementType': 'geometry.fill',
                    'stylers': {
                        'color': '#000000'
                    }
                }, 
                {
                    'featureType': 'poi',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'on',
                        'color': '#319296'
                    }
                }, 
                {
                    'featureType': 'poi',
                    'elementType': 'labels',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, 
                {
                    'featureType': 'green',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, 
                {
                    'featureType': 'subway',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'on',
                        'color': '#319296'
                    }
                }, 
                {
                    'featureType': 'subway',
                    'elementType': 'labels',
                    'stylers': {
                        'visibility': 'off',
                        
                    }
                }, 
                {
                    'featureType': 'manmade',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#000000'
                    }
                }, 
                {
                    'featureType': 'manmade',
                    'elementType': 'labels',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, 
                {
                    'featureType': 'local',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#000000'
                    }
                }, 
                {
                    'featureType': 'local',
                    'elementType': 'labels',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, 
                {
                    'featureType': 'arterial',
                    'elementType': 'labels',
                    'stylers': {
                        'visibility': 'on',
                        'color': '#319296'
                    }
                }, 
                {
                    'featureType': 'arterial',
                    'elementType': 'labels',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, 
                {
                    'featureType': 'boundary',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#319296'
                    }
                }, 
                {
                    'featureType': 'building',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#000000'
                    }
                }, 
                {
                    'featureType': 'building',
                    'elementType': 'labels',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, 
                {
                    'featureType': 'label',
                    'elementType': 'labels.text.fill',
                    'stylers': {
                    	'backgroundColor': '#000000',
                        'color': '#161A47',
                        'visibility': 'off'
                    }
                }
                ]
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
                var mingchen = value[2];
                var tip = '';
                var kaimen, xinhao, stat, txt;
                if(value.length == 6) {
                	tip = '省份:';
                	stat = value[5];
                	kaimen = Math.round(value[3]);
                	xinhao = Math.round(value[4]);
                	txt = '小区数量';
                } else {
                	tip = '小区名称:';
                	stat = value[3] + ' ' + value[4];
                	kaimen = Math.round(value[6]);
                	xinhao = Math.round(value[7]);
                	txt = '所在地区';
                }
                return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
                    + tip + ' ' + mingchen
                    + '</div>'
                    + txt + '：' + stat + '<br>'
                    + '累计开门次数' + '：' + kaimen + '<br>'
                    + '平均信号强度' + '：' + xinhao + '<br>';
            }
        },
        
        series : [
            {
                name: 'xiqoqu',
                type: 'effectScatter',
                coordinateSystem: 'bmap',
                //data: convertData(data, geoCoordMap),
                data:province_data,
                symbolSize: function (val) {
                	if(val.length == 6) {
                		return base_size + val[3] / factor;
                	} else {
                		return base_size + val[6] / factor;
                	}
                },    
                showEffectOn: 'render',
                rippleEffect: {
                    //brushType: ''
                	brushType: 'stroke'
                },
                hoverAnimation: true,
                itemStyle: {
                    normal: {
                        color: 'green',
                        shadowBlur: 10,
                        shadowColor: '#333',
                        opacity: 0.7
                    }
                },
                zlevel: 1
            },
//            {
//                name: 'xiqoqu-open',
//                type: 'effectScatter',
//                coordinateSystem: 'bmap',
//                data: [],
//                symbolSize: function (val) {
//                	if(val.length == 6) {
//                		return base_size + val[3] / factor;
//                	} else {
//                		return base_size + val[6] / factor;
//                	}
//                },    
//                showEffectOn: 'render',
//                rippleEffect: {
//                    brushType: 'stroke'
//                },
//                hoverAnimation: true,
//                itemStyle: {
//                    normal: {
//                        color: 'green',
//                        shadowBlur: 10,
//                        shadowColor: '#333',
//                        opacity: 0.3
//                    }
//                },
//                zlevel: 1
//            }
        ]
    };
    
	var locations = [{
	    name: '湖南',
	    coord: [118.472644, 28.231706]
	}, {
	    name: '北京',
	    coord: [119.905285, 35.904989]
	}, {
	    name: '广东',
	    coord: [113.280637, 23.459463]
	}];
	var currentLoc = 0;
	var myInterval = setInterval(function () {
		//当没有开门数据阐述时，地图的center随机变化；当有开门数据产生了，地图的center随开门小区的经纬度变化
		if(lat == 0 & lng == 0) {
			lat = locations[currentLoc].coord[0];
			lng = locations[currentLoc].coord[1];
		}
	 	myChart.setOption({
	        bmap: [{
		        center: [lat, lng],
		        zoom: 7.6,
		    }],
		    dataRange: {
                min : -110,
                max : -60,
                y: '60%',
                calculable : true,
                color: ['#ff3333', 'orange','aqua'],
                show: true,
                left: 'left',
                top: 'bottom',
                text: ['高','低'],
                textStyle: {
                    color: '#319196',
                    fontWeight: 'bolder',
                    fontSize: 15,
            }
        },
		    series: [{
		    	data: convertData(data, geoCoordMap),
		    }]
		});
	 	lat = 0;
	 	lng = 0;
	 	currentLoc = (currentLoc + 1) % locations.length;
	}, 2500);
	$("#main").dblclick(function() {
		clearInterval(myInterval);
		myChart.setOption({
			bmap: [{
		        center: [117.0600, 30.0000],
		        zoom: 6.8,
		        }],
		    dataRange: {
			    //show:false,
			    },
		    series: [{
			    	data: province_data,
			    }]
		})
	});
    
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }  
    return option;
    return myChart;  
}

function loadGauge() {
	var dom = document.getElementById("chart00");
	var myChart_gauge = echarts.init(dom);
	var app = {};
	option_gauge = null;
	option_gauge = {
		backgroundColor: 'rgba(43,80,80,.4)',
	    series: [
			{
			    name:'开门指标',
			    type:'gauge',
			    min:50,
			    max:100,
			    splitNumber:10,
			    radius: '100%',
			    axisLine: {            // 坐标轴线
			        lineStyle: {       // 属性lineStyle控制线条样式
			            color: [[0.09, 'red'],[0.82, '#1e90ff'],[1, 'green']],
			            width: 3,
			            shadowColor : '#fff', 
			            shadowBlur: 10
			        }
			    },
			    axisLabel: {            // 坐标轴小标记
			        textStyle: {       // 属性lineStyle控制线条样式
			            fontWeight: 'bolder',
			            color: '#fff',
			            shadowColor : '#fff', 
			            shadowBlur: 10
			        }
			    },
			    axisTick: {            // 坐标轴小标记
			        length :8,        // 属性length控制线长
			        lineStyle: {       // 属性lineStyle控制线条样式
			            color: 'auto',
			            shadowColor : '#fff', 
			            shadowBlur: 10
			        }
			    },
			    splitLine: {           // 分隔线
			        length :8,         // 属性length控制线长
			        lineStyle: {       
			            width:3,
			            color: '#fff',
			            shadowColor : '#fff', 
			            shadowBlur: 10
			        }
			    },
			    pointer: {           // 分隔线
			        shadowColor : '#fff', 
			        shadowBlur: 5
			    },
			    title : {
			        textStyle: {       
			            fontWeight: 'bolder',
			            fontSize: 8,
			            fontStyle: 'italic',
			            color: '#fff',
			            shadowColor : '#fff', //默认透明
			            shadowBlur: 10
			        }
			    },
			    detail : {
			        //backgroundColor: 'rgba(30,144,255,0.8)',
			        //borderWidth: 1,
			    	formatter:'{value}%',
			        borderColor: '#fff',
			        shadowColor : '#fff', 
			        shadowBlur: 5,
			        offsetCenter: [0, '50%'],       // x, y，单位px
			        textStyle: {       
			            fontWeight: 'bolder',
			            color: 'green',
			            fontSize:15
			        }
			    },
			    data:[{value: 98.27, name: '开门成功率'}]
			},
	    ]
	};

	app.timeTicket = setInterval(function () {
		if(success_counts == 0 & fail_counts == 0) {
			success_rate = 98.27;
		} else {
			success_rate = Math.round(success_counts/(success_counts + fail_counts) * 100);
		}
		option_gauge.series[0].data[0].value = success_rate;
	    myChart_gauge.setOption(option_gauge, true);
	},2000);
		
	if (option_gauge && typeof option_gauge === "object") {
	    myChart_gauge.setOption(option_gauge, true);
	}
}

//使用 websocket 实现实时数据更新，后台代码还没写
var webSocket = new WebSocket('ws://192.168.99.100:8080'); 
webSocket.onerror = function(event) {
    onError(event)
  };
webSocket.onopen = function(event) {
    onOpen(event)
  };
webSocket.onmessage = function(event) {
    onMessage(event)
  };

function onMessage(event) {
  var arr = event.data.split("^^");
  unit_id = arr[0];
  open_status = arr[1];
  signal = Number(arr[3]);
  network = arr[2];
  open_door = arr[4];
  DT = arr[5];
  for(var i=0, n=data.length; i<n; i++) {
      var nvalue = data[i].name;
      var cvalue = data[i].value[0];
      var svalue = data[i].value[1];
      if(unit_id == nvalue) {
          data[i].value[0] += 1;
          data[i].value[1] = ((cvalue * svalue) + signal)/cvalue;
          var new_data = {name: unit_id, value: [data[i].value[0], data[i].value[1]]};
          new_open.push(new_data);
          var times = new_open.length;
          lat = geoCoordMap[unit_id][0];
          lng = geoCoordMap[unit_id][1];
          xiaoqu_name = geoCoordMap[unit_id][2];
          province = geoCoordMap[unit_id][3];
          for(var j=0, m=province_data.length; j<m; j++) {
        	  if(province == province_data[j].name) {
        		  var old_signal = province_data[j].value[4];
        		  province_data[j].value[3] += 1;
        		  province_data[j].value[4] = (old_signal + data[j].value[1])/2;
        	  }
          }
          //point_effect(times, open_status);       
          re_loadEChart(unit_id, xiaoqu_name, open_status, signal, network, open_door, DT);
          display_data();
      }
  }
//  console.log(top10);
}

function onOpen(event) {
    //alert("Connection established")
      /*document.getElementById('messages').innerHTML
      = 'Connection established';*/
}

function onError(event) {
    alert(event.data);
}

function start() {
    webSocket.send('hello');
    return false;
}

function re_loadEChart(unit_id, xiaoqu_name, open_status, signal, network, open_door, DT) {   
      if(network == 1) {
          network = "wifi"
      } else {
          network = "蓝牙"
      }
      
      if(open_door == 1) {
          open_door = "一键开门"
      }
      else if(open_door == 2) {
          open_door = "自动开门"
      }
      else if(open_door == 3) {
          open_door = "亮屏开门"
      }
      else if(open_door == 4) {
          open_door = "摇一摇"
      }
      
      if(open_status == 6 || open_status == 7) {
          str = '<tr class="success"><td><img src="http://i.niupic.com/images/2016/10/27/xrwMjL.jpg">'+xiaoqu_name+'</td><td>'+getNowFormatDate()+'</td><td>'+signal+'</td><td>'+open_door+'</td><td>'+DT+'</td><td>'+network+'</td><td>'+"成功！"+'</td></tr>'+str;
          success_counts += 1;
      }
      else {
          str = '<tr class="fail"><td><img src="http://i.niupic.com/images/2016/10/27/xrwMjL.jpg">'+xiaoqu_name+'</td><td>'+getNowFormatDate()+'</td><td>'+signal+'</td><td>'+open_door+'</td><td>'+DT+'</td><td>'+network+'</td><td>'+"失败！"+'</td></tr>'+str;
          fail_counts += 1;
      }
      $("#chart02").html("");
      $("#chart02").html(table02_head+str+table_foot);
      var failClass = document.getElementsByClassName("fail");
      var successClass = document.getElementsByClassName("success");
      for(var i=0, n=failClass.length; i<n; i++) {
          failClass[i].style.color = "red";
      }
      for(var i=0, n=successClass.length; i<n; i++) {
          successClass[i].style.color = "green";
      }
}

function display_data() {
    var str = '';
    top10 = data.sort(function(a,b) {
        return b.value[0] - a.value[0];
    }).slice(0,10);
    for(var i=0, n=top10.length; i<n; i++) {
        xiaoqu_name = geoCoordMap[top10[i].name][2];
        total_counts = Math.round(top10[i].value[0]);
        avg_signal = Math.round(top10[i].value[1]*100)/100;
        str += '<tr style="text-color:green"><td><img src="http://i.niupic.com/images/2016/10/27/69DOKk.jpg">'+xiaoqu_name+'</td><td>'+total_counts+'</td><td>'+avg_signal+'</td></tr>';
    }
    $("#chart01").html("");
    $("#chart01").html(table01_head+str+table_foot);
}
