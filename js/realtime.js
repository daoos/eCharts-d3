var width = window.innerWidth;
var height = window.innerHeight;
var basic = [];

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 10])
    .on("zoom", zoomed);

function zoomed() {
    d3.select(this).attr("transform", 
        "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

var drag = d3.behavior.drag()
    .on("drag", dragmove); 
                
function dragmove(d) {  
    console.log(d);
    console.log(d3.event);
}

var svg = d3.select("#map").append("svg")
    .attr("xmlns","http://www.w3.org/2000/svg")
    .attr("xmlns:xlink","http://www.w3.org/1999/xlink")
    .attr("width", width)
    .attr("height", height);

var title = svg.append('g')
    .append("a")
    .attr("xlink:href", "http://www.wow666.top")
    .append("text")
    .attr("x",5)
    .attr("y",35)
    .style("font-size","1.3em")
    .attr("fill","#fff")
    .text("小区实时开门数据");

var chinaMap = svg.append('g')
    .attr("id","chinaMap");
    // .call(zoom)
    // .call(drag);

var graphOne = svg.append('g')
    // .append('rect')
    // .attr("width", width/3-15)
    // .attr("height",height/3)
    .attr("transform", "translate(" + width*2/3 + "," + 0 +")");

graphOne
    .append("svg")
    .attr("width",width/10)
    .attr("height",height/3)
    .attr("id","graphOne1");
graphOne
    .append("svg")
    .attr("width",width/10)
    .attr("height",height/3)
    .attr("id","graphOne2");
graphOne
    .append("svg")
    .attr("width",width/10)
    .attr("height",height/3)
    .attr("id","graphOne3");

var graphTwo = svg.append('g')
    .attr("transform", "translate(" + width*2/3 + "," + height*1/3 +")")
    .append("svg")
    .attr("width",width/3)
    .attr("height",height/3)
    .attr("id","graphTwo");

var graphThree = svg.append('g')
    .attr("transform", "translate(" + width*2/3 + "," + height*2/3 +")")
    .append("svg")
    .attr("width",width/3)
    .attr("height",height/3)
    .attr("id","graphThree");

var projection = d3.geo.mercator()
    .center([104.7,38])
    .scale(940)
    .translate([width/3,height/2]);

var path = d3.geo.path()
    .projection(projection);

var defs = chinaMap.append('defs');

var gaussian = defs.append('filter')
    .attr('id','gaussian');

gaussian.append('feGaussianBlur')
    .attr('in', 'SourceGraphic')
    .attr('stdDeviation', '0.5');

d3.json("json/china.json",function(error, root){
    if(error){
        return console.error(error);
    }
    console.log(root)

    var georoot = root;
    //var georoot = topojson.feature(root, root.objects.china);

    var paths = chinaMap.append('g')
        .selectAll("path")
        .data(georoot.features)
        .enter()
        .append('path')
        .attr({
            class: 'province',
            d: path
        })
        .style("fill", "none")
        .style("stroke", "#00FFFF");

    var text = chinaMap.append('g')
        .selectAll(".place-label")
        .data(georoot.features)
        .enter()
        .append("text")
        .attr("class", "place-label")
        .attr("transform", function(d) { 
            return "translate(" + projection(d.properties.cp) + ")";
        })
        .attr("dy", ".35em")
        .text(function(d) { return d.properties.name; });

    addBasicData();
    
    addgraphOne();
    addgraphTwo();
    addgraphThree();

    test();
})

function addBasicData() {
    var color = d3.scale.category20();
    // var a = d3.rgb(255,255,255),
    //  b = d3.rgb(255,255,0);
    var myColor = d3.interpolateLab("#fc8d59","#ffffbf","#91cf60");
    d3.json("json/location.json", function(error, root){
        for(var i=0; i<root.length; i++){
            root[i].loc = [root[i].lat, root[i].lng];
        }
        basic = root;
        console.log(basic);

        var points = chinaMap.append('g')
            .selectAll("circle")
            .data(root)
            .enter()
            .append('circle')
            .attr("class", "basic-data")
            .attr("transform", function(d){
                return "translate(" + projection(d.loc) + ")";
            })
            .attr("r",function(d,i){
                return Math.floor(Math.random() * 2 + 1);
            })
            .style("fill",function(d,i){
                var color = myColor(Math.random());
                return color.toString();
            })
            .style("filter", "url(#" + gaussian.attr("id") + ")");
    })
}

function addgraphOne(){
    //var gauge1 = loadLiquidFillGauge("graphOne1", 55);
    //var gauge2 = loadLiquidFillGauge("graphOne2", 55);
    //var gauge3 = loadLiquidFillGauge("graphOne3", 55);
    // var config3 = liquidFillGaugeDefaultSettings();
 //    config3.textVertPosition = 0.8;
 //    config3.waveAnimateTime = 5000;
 //    config3.waveHeight = 0.15;
 //    config3.waveAnimate = false;
 //    config3.waveOffset = 0.25;
 //    config3.valueCountUp = false;
 //    config3.displayPercent = false;
 //    var gauge4 = loadLiquidFillGauge("graphOne", 50, config3);
}

function liquidFillGaugeDefaultSettings(){
    return {
        minValue: 0, // The gauge minimum value.
        maxValue: 100, // The gauge maximum value.
        circleThickness: 0.05, // The outer circle thickness as a percentage of it's radius.
        circleFillGap: 0.05, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
        circleColor: "#178BCA", // The color of the outer circle.
        waveHeight: 0.05, // The wave height as a percentage of the radius of the wave circle.
        waveCount: 1, // The number of full waves per width of the wave circle.
        waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
        waveAnimateTime: 18000, // The amount of time in milliseconds for a full wave to enter the wave circle.
        waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
        waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
        waveAnimate: true, // Controls if the wave scrolls or is static.
        waveColor: "#178BCA", // The color of the fill wave.
        waveOffset: 0, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
        textVertPosition: .5, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
        textSize: 1, // The relative height of the text to display in the wave circle. 1 = 50%
        valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading. If false, the final value is displayed.
        displayPercent: true, // If true, a % symbol is displayed after the value.
        textColor: "#045681", // The color of the value text when the wave does not overlap it.
        waveTextColor: "#A4DBf8" // The color of the value text when the wave overlaps it.
    };
}

function loadLiquidFillGauge(elementId, value, config) {
    if(config == null) config = liquidFillGaugeDefaultSettings();

    var gauge = d3.select("#" + elementId);
    var radius = Math.min(parseInt(gauge.attr("width")), parseInt(gauge.attr("height")))/2;
    var locationX = parseInt(gauge.attr("width"))/2 - radius;
    var locationY = parseInt(gauge.attr("height"))/2 - radius;
    var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value))/config.maxValue;

    var waveHeightScale;
    if(config.waveHeightScaling){
        waveHeightScale = d3.scale.linear()
            .range([0,config.waveHeight,0])
            .domain([0,50,100]);
    } else {
        waveHeightScale = d3.scale.linear()
            .range([config.waveHeight,config.waveHeight])
            .domain([0,100]);
    }

    var textPixels = (config.textSize*radius/2);
    var textFinalValue = parseFloat(value).toFixed(2);
    var textStartValue = config.valueCountUp?config.minValue:textFinalValue;
    var percentText = config.displayPercent?"%":"";
    var circleThickness = config.circleThickness * radius;
    var circleFillGap = config.circleFillGap * radius;
    var fillCircleMargin = circleThickness + circleFillGap;
    var fillCircleRadius = radius - fillCircleMargin;
    var waveHeight = fillCircleRadius*waveHeightScale(fillPercent*100);

    var waveLength = fillCircleRadius*2/config.waveCount;
    var waveClipCount = 1+config.waveCount;
    var waveClipWidth = waveLength*waveClipCount;

    // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
    var textRounder = function(value){ return Math.round(value); };
    if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
        textRounder = function(value){ return parseFloat(value).toFixed(1); };
    }
    if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
        textRounder = function(value){ return parseFloat(value).toFixed(2); };
    }

    // Data for building the clip wave area.
    var data = [];
    for(var i = 0; i <= 40*waveClipCount; i++){
        data.push({x: i/(40*waveClipCount), y: (i/(40))});
    }

    // Scales for drawing the outer circle.
    var gaugeCircleX = d3.scale.linear().range([0,2*Math.PI]).domain([0,1]);
    var gaugeCircleY = d3.scale.linear().range([0,radius]).domain([0,radius]);

    // Scales for controlling the size of the clipping path.
    var waveScaleX = d3.scale.linear().range([0,waveClipWidth]).domain([0,1]);
    var waveScaleY = d3.scale.linear().range([0,waveHeight]).domain([0,1]);

    // Scales for controlling the position of the clipping path.
    var waveRiseScale = d3.scale.linear()
        // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
        // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
        // circle at 100%.
        .range([(fillCircleMargin+fillCircleRadius*2+waveHeight),(fillCircleMargin-waveHeight)])
        .domain([0,1]);
    var waveAnimateScale = d3.scale.linear()
        .range([0, waveClipWidth-fillCircleRadius*2]) // Push the clip area one full wave then snap back.
        .domain([0,1]);

    // Scale for controlling the position of the text within the gauge.
    var textRiseScaleY = d3.scale.linear()
        .range([fillCircleMargin+fillCircleRadius*2,(fillCircleMargin+textPixels*0.7)])
        .domain([0,1]);

    // Center the gauge within the parent SVG.
    var gaugeGroup = gauge.append("g")
        .attr('transform','translate('+locationX+','+locationY+')');

    // Draw the outer circle.
    var gaugeCircleArc = d3.svg.arc()
        .startAngle(gaugeCircleX(0))
        .endAngle(gaugeCircleX(1))
        .outerRadius(gaugeCircleY(radius))
        .innerRadius(gaugeCircleY(radius-circleThickness));
    gaugeGroup.append("path")
        .attr("d", gaugeCircleArc)
        .style("fill", config.circleColor)
        .attr('transform','translate('+radius+','+radius+')');

    // Text where the wave does not overlap.
    var text1 = gaugeGroup.append("text")
        .text(textRounder(textStartValue) + percentText)
        .attr("class", "liquidFillGaugeText")
        .attr("text-anchor", "middle")
        .attr("font-size", textPixels + "px")
        .style("fill", config.textColor)
        .attr('transform','translate('+radius+','+textRiseScaleY(config.textVertPosition)+')');

    // The clipping wave area.
    var clipArea = d3.svg.area()
        .x(function(d) { return waveScaleX(d.x); } )
        .y0(function(d) { return waveScaleY(Math.sin(Math.PI*2*config.waveOffset*-1 + Math.PI*2*(1-config.waveCount) + d.y*2*Math.PI));} )
        .y1(function(d) { return (fillCircleRadius*2 + waveHeight); } );
    var waveGroup = gaugeGroup.append("defs")
        .append("clipPath")
        .attr("id", "clipWave" + elementId);
    var wave = waveGroup.append("path")
        .datum(data)
        .attr("d", clipArea)
        .attr("T", 0);

    // The inner circle with the clipping wave attached.
    var fillCircleGroup = gaugeGroup.append("g")
        .attr("clip-path", "url(#clipWave" + elementId + ")");
    fillCircleGroup.append("circle")
        .attr("cx", radius)
        .attr("cy", radius)
        .attr("r", fillCircleRadius)
        .style("fill", config.waveColor);

    // Text where the wave does overlap.
    var text2 = fillCircleGroup.append("text")
        .text(textRounder(textStartValue) + percentText)
        .attr("class", "liquidFillGaugeText")
        .attr("text-anchor", "middle")
        .attr("font-size", textPixels + "px")
        .style("fill", config.waveTextColor)
        .attr('transform','translate('+radius+','+textRiseScaleY(config.textVertPosition)+')');

    // Make the value count up.
    if(config.valueCountUp){
        var textTween = function(){
            var i = d3.interpolate(this.textContent, textFinalValue);
            return function(t) { this.textContent = textRounder(i(t)) + percentText; }
        };
        text1.transition()
            .duration(config.waveRiseTime)
            .tween("text", textTween);
        text2.transition()
            .duration(config.waveRiseTime)
            .tween("text", textTween);
    }

    // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
    var waveGroupXPosition = fillCircleMargin+fillCircleRadius*2-waveClipWidth;
    if(config.waveRise){
        waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(0)+')')
            .transition()
            .duration(config.waveRiseTime)
            .attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')')
            .each("start", function(){ wave.attr('transform','translate(1,0)'); }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is actually necessary.
    } else {
        waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')');
    }

    if(config.waveAnimate) animateWave();

    function animateWave() {
        wave.attr('transform','translate('+waveAnimateScale(wave.attr('T'))+',0)');
        wave.transition()
            .duration(config.waveAnimateTime * (1-wave.attr('T')))
            .ease('linear')
            .attr('transform','translate('+waveAnimateScale(1)+',0)')
            .attr('T', 1)
            .each('end', function(){
                wave.attr('T', 0);
                animateWave(config.waveAnimateTime);
            });
    }

    function GaugeUpdater(){
        this.update = function(value){
            var newFinalValue = parseFloat(value).toFixed(2);
            var textRounderUpdater = function(value){ return Math.round(value); };
            if(parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))){
                textRounderUpdater = function(value){ return parseFloat(value).toFixed(1); };
            }
            if(parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))){
                textRounderUpdater = function(value){ return parseFloat(value).toFixed(2); };
            }

            var textTween = function(){
                var i = d3.interpolate(this.textContent, parseFloat(value).toFixed(2));
                return function(t) { this.textContent = textRounderUpdater(i(t)) + percentText; }
            };

            text1.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);
            text2.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);

            var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value))/config.maxValue;
            var waveHeight = fillCircleRadius*waveHeightScale(fillPercent*100);
            var waveRiseScale = d3.scale.linear()
                // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
                // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
                // circle at 100%.
                .range([(fillCircleMargin+fillCircleRadius*2+waveHeight),(fillCircleMargin-waveHeight)])
                .domain([0,1]);
            var newHeight = waveRiseScale(fillPercent);
            var waveScaleX = d3.scale.linear().range([0,waveClipWidth]).domain([0,1]);
            var waveScaleY = d3.scale.linear().range([0,waveHeight]).domain([0,1]);
            var newClipArea;
            if(config.waveHeightScaling){
                newClipArea = d3.svg.area()
                    .x(function(d) { return waveScaleX(d.x); } )
                    .y0(function(d) { return waveScaleY(Math.sin(Math.PI*2*config.waveOffset*-1 + Math.PI*2*(1-config.waveCount) + d.y*2*Math.PI));} )
                    .y1(function(d) { return (fillCircleRadius*2 + waveHeight); } );
            } else {
                newClipArea = clipArea;
            }

            var newWavePosition = config.waveAnimate?waveAnimateScale(1):0;
            wave.transition()
                .duration(0)
                .transition()
                .duration(config.waveAnimate?(config.waveAnimateTime * (1-wave.attr('T'))):(config.waveRiseTime))
                .ease('linear')
                .attr('d', newClipArea)
                .attr('transform','translate('+newWavePosition+',0)')
                .attr('T','1')
                .each("end", function(){
                    if(config.waveAnimate){
                        wave.attr('transform','translate('+waveAnimateScale(0)+',0)');
                        animateWave(config.waveAnimateTime);
                    }
                });
            waveGroup.transition()
                .duration(config.waveRiseTime)
                .attr('transform','translate('+waveGroupXPosition+','+newHeight+')')
        }
    }

    return new GaugeUpdater();
}

function addgraphTwo(){
    
}

function addgraphThree(){
    
}

function test(){
    var interval01 = setInterval(function() {
        var message = [];
        var signal = Math.floor(Math.random() * 50 - 120);
        var kmfs = ['1', '2', '3', '4', '1'];
        var kmwl = ['1', '2', '3', '4', '1', '1'];
        var status = ['1', '2', '3', '4', '5', '6', '7', '6', '7', '6', '7', '6', '7', '6', '7', '6', '7'];
        var kmsb = ['联想 新网9 128G', 'KUPAI R7 64G', 'BLACKBERRY 64G', '苹果 iPhone 7 32GB', 'iPhone 6s 32GB', 'iPhone 6splus 128GB', '三星 Galaxy S7 Edge 32G', '华为 P9全网通高配版', 'vivo X7 Plus', '苹果 iPhone 6s Plus', 'OPPO R9s全网通', '三星Galaxy C7', '魅族 魅蓝Note3高配版'];
        var rdm1 = Math.floor(Math.random() * basic.length);
        var rdm2 = Math.floor(Math.random() * kmfs.length);
        var rdm3 = Math.floor(Math.random() * kmwl.length);
        var rdm4 = Math.floor(Math.random() * status.length);
        var rdm5 = Math.floor(Math.random() * kmsb.length);
        message = [basic[rdm1].unit_id, status[rdm4], kmwl[rdm3], signal, kmfs[rdm2], kmsb[rdm5]];
        onMessages(message);
    }, 300);
}

function onMessages(arr) {
    var unit_id = arr[0];
    var point = [];
    for(var i=1; i<basic.length; i++){
        if(basic[i].unit_id === unit_id) {
            point = basic[i].loc;
        }
    }
    particle(point);
}

var i = 0;

function particle(point) {
    var m = projection(point);
    if(m[0] && m[1]) {
        chinaMap.insert("circle")
        .attr("cx", m[0])
        .attr("cy", m[1])
        .attr("r", 1e-6)
        .style("stroke-width", '0.03em')
        .style("stroke", d3.hsl((i = (i + 1) % 360), 1, .5))
        .style("stroke-opacity", 1)
        .transition()
        .duration(2000)
        .ease(Math.sqrt)
        .attr("r", 85)
        .style("fill","none")
        .style("stroke-width", '0.1em')
        .style("stroke-opacity", 1e-6)
        .remove();
    }
}