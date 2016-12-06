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

var svg = d3.select("#charts").append("svg")
		.attr("width", width)
		.attr("height", height);

var groups = svg.append('g')
		.attr("id","group")
		.call(zoom)
		.call(drag);

var projection = d3.geo.mercator()
				.center([107,38])
				.scale(1020)
				.translate([width/2,height/2]);

var path = d3.geo.path()
				.projection(projection);

var defs = groups.append('defs');

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
	//console.log(georoot);

	var paths = groups.selectAll("path")
		.data(georoot.features)
		.enter()
		.append('path')
		.attr({
			class: 'province',
			d: path
		})
		.style("fill", "none")
		.style("stroke", "#00FFFF");

	var text = groups.selectAll(".place-label")
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
	test();
})

function addBasicData() {
	var color = d3.scale.category20();
	// var a = d3.rgb(255,255,255),
	// 	b = d3.rgb(255,255,0);
	var myColor = d3.interpolateLab("#fc8d59","#ffffbf","#91cf60");
	d3.json("json/location.json", function(error, root){
		for(var i=0; i<root.length; i++){
			root[i].loc = [root[i].lat, root[i].lng];
		}
		basic = root;
		console.log(basic);

		var points = svg.selectAll("circle")
			.data(root)
			.enter()
			.append('circle')
			.attr("class", "basic-data")
			.attr("transform", function(d){
				return "translate(" + projection(d.loc) + ")";
			})
			.attr("r",function(d,i){
				return Math.floor(Math.random() * 1 + 1);
			})
			.style("fill",function(d,i){
				//return color(i);
				var color = myColor(Math.random());
				return color.toString();
			})
			.style("filter", "url(#" + gaussian.attr("id") + ")");
	})
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
	}, 600);
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
		groups.insert("circle")
		.attr("cx", m[0])
		.attr("cy", m[1])
		.attr("r", 1e-6)
		.style("stroke-width", '0.03em')
		.style("stroke", d3.hsl((i = (i + 1) % 360), 1, .5))
		.style("stroke-opacity", 1)
	  	.transition()
	    .duration(3000)
	    .ease(Math.sqrt)
	    .attr("r", 60)
	    .style("fill","none")
	    .style("stroke-width", '0.1em')
	    .style("stroke-opacity", 1e-6)
	    .remove();
	}
}