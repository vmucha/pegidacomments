/*global d3:false, console:false */
(function() {
	'use strict';
	var jsonData;
	var hours = [];
	var counts = {};
	var days = [];
	var weekdays = ['Mo','Di','Mi','Do','Fr','Sa','So'];

	d3.json('testout.json',function (error, json) {
		jsonData = json.filter(function() {
			if(299 < 300) {
				return true;
			}
		});
		createHours();
		createDays();
		getCounts();
		plot(hours,'hours','#plothours');
		plot(days,'days','#plotdays');
		barChart(days,'days','#bardays');
		barChart(hours,'hours','#barhours');

	});

	var formatDay = function(d) {
	    return weekdays[d];      
	};
	function createDays() {
		for (var i = 0;i<7;i++) {
			days[i] =[];
		}
		d3.selectAll(jsonData).each(function () {
			var day = new Date(this.date).getDay();
			if(typeof days[day] !== 'undefined') {
				days[day].push(this);
			} else {
				console.log('undefined??!?',day,this);
				days[day] = [this];
			}
		});
	}

	function createHours() {
		for (var i = 0;i<24;i++) {
			hours[i] =[];
		}
		d3.selectAll(jsonData).each(function () {
			var hour = new Date(this.date).getHours();
			if(typeof hours[hour] !== 'undefined') {
				hours[hour].push(this);
				
			} else {
				console.log('undefined??!?',hour,this);
				hours[hour] = [this];
			}
		});
	}

	function getCounts() {
		counts.hours = count(hours);
		counts.days = count(days);
	}
	function count(key) {
		var value =  d3.max(key,function(d) {
			if (typeof d !== 'undefined') {
				return d.length;
			}
		});
		return value;
	}
	function barChart(keyobj,key,domselector) {
		var w = 600;
		var h = 400;
		var barPadding = 1;
		var scale = d3.scale.linear();
		scale.domain([0,counts[key]]);
		scale.range([0,h]);

		var svg = d3.select('body '+domselector)
			.append('svg')
			.attr('width', w)
			.attr('height',h);
		svg.selectAll('rect')
	       .data(keyobj)
	       .enter()
	       .append('rect')
	       .attr('x', function(d,i) {
	       		return i*(w/keyobj.length);
	       })
	       .attr('y', function(d) {
	       		return h-scale(d.length);
	       })
	       .attr('width', w/keyobj.length-barPadding)
	       .attr('height', function(d) {
	       		return scale(d.length);
	       });
	       svg.selectAll('text')
		       .data(keyobj)
		       .enter()
		       .append('text')
		       .text(function(d) {
		       		return d.length;
		       	})
		       .attr('x', function(d, i) {
					return i * (w/keyobj.length)+(w/keyobj.length-barPadding)/2;
				})
				.attr('y', function() {
					return h - (counts[key]/1000)+15;
				})
				.attr('font-family', 'sans-serif')
	       		.attr('font-size', '11px')
	       		.attr('fill', 'white')
	       		.attr('text-anchor', 'middle');
	}
	function plot(keyobj,key,domselector) {

		var w = 600;
		var h = 400;
		var padding = 50;
		var scaleX = d3.scale.linear();
		//scaleX.domain([0,maxes[key]]);
		scaleX.domain([0,keyobj.length-1]);
		scaleX.range([padding,w-padding]);
		var scaleY = d3.scale.linear();
		scaleY.domain([counts[key],0]);
		scaleY.range([padding,h-padding]);
		var xAxis = d3.svg.axis()
		.scale(scaleX)
		.orient('bottom');
		if(key === 'hours') {
			xAxis.ticks(24);
		}
		if(key === 'days') {
			xAxis.ticks(7)
			.tickFormat(formatDay);
		}
		
		var yAxis = d3.svg.axis()
		.scale(scaleY)
		.orient('left')
		.ticks(4);
		var svg = d3.select('body '+domselector)
			.append('svg')
			.attr('width', w)
			.attr('height',h);
		svg.append('g')
			.attr('class','axis')
			.attr('transform','translate(0,'+(h-padding)+')')
			.call(xAxis)
			.selectAll('text')
			.attr('style','text-anchor:middle');
		svg.append('g')
			.attr('class','axis')
			.attr('transform','translate('+padding+',0)')
			.call(yAxis);
		
		d3.selectAll(keyobj).each(function(d,i) {
			
			svg.append('circle')
			.attr('r', 0)
	       	.transition()
	    	.duration(1000)
	       	.delay(function() {
	       		return 500*i;
	       	})
	       	.attr('cx', function() {
	       		return scaleX(i);
	       	})
	       	.attr('cy', function() {
	       		return scaleY(keyobj[i].length);
	       	})
	       	.attr('r', 5);
	       	if(i<keyobj.length-1) {
		       	svg.append('line')
		       	.attr('stroke-width',3)
		       	.attr('stroke','#000')
		       	.attr('x1',scaleX(i))
		       	.attr('y1',scaleY(keyobj[i].length))
		       	.attr('x2',scaleX(i))
		       	.attr('y2',scaleY(keyobj[i].length))
		       	.transition()
		       	.duration(1000)
		       	.delay(function() {
		       		return 500*i;
		       	})
		       	.attr('x2',scaleX(i+1))
		       	.attr('y2',scaleY(keyobj[i+1].length));
		    }
		});

		/*svg.selectAll('circle')
	       .data(keyobj)
	       .enter()
	       .append('circle')
	       .attr('r', 0)
	       .transition()
	       .duration(1000)
	       .delay(function(d,i) {
	       	return 500*i;
	       })
	       .attr('cx', function(d,i) {
	       		return scaleX(i);
	       })
	       .attr('cy', function(d) {
	       		return scaleY(d.length);
	       })
	       .attr('r', 5);
		svg.selectAll('line')
	       .data(keyobj)
	       .enter()
	       .append('line')
	       .attr('x1',)
	       .attr('y1',)
	       .attr('x2',)
	       .attr('y2',);*/

	}
}());