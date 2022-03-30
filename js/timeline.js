class TimeLine {

    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerHeight: _config.containerHeight || 250,
            margin: { top: 40, bottom: 35, right: 50, left: 50 },
            tooltipPadding: _config.tooltipPadding || 10
        }

        this.config.containerWidth = d3.select('#timelinediv').node().getBoundingClientRect().width;
  
        this.data = _data;
    
        // Call a class function
        this.initVis();
    }
  
    initVis() {
        
        let vis = this; //this is a keyword that can go out of scope, especially in callback functions, 
                        //so it is good to create a variable that is a reference to 'this' class instance
    
        //set up the width and height of the area where visualizations will go- factoring in margins               
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
        vis.chartWidth = vis.width / 2 - 30;

        // // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        // // Append group element that will contain our actual chart (see margin convention)
        const transformheight = - vis.config.margin.top 
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left}, ${transformheight})`);

        // scales
        vis.xScale = d3.scaleBand()
            .range([0, vis.width]);
        vis.xAxisScale = d3.scaleLinear()
            .range([0, vis.width]);
        vis.yScale = d3.scaleLinear()
            .range([0, vis.height]);
        vis.yAxisScale = d3.scaleLinear()
            .range([vis.height / 2, 0])
        vis.lowerYAxisScale = d3.scaleLinear()
            .range([vis.height / 2, 0])

        // init axis
        vis.xAxis = d3.axisBottom(vis.xAxisScale).tickFormat(d3.format("d")); // Remove thousand comma
        vis.yAxis = d3.axisLeft(vis.yAxisScale);
        vis.lowerYAxis = d3.axisLeft(vis.lowerYAxisScale);

        // init axis groups
        vis.xAxisGroup = vis.chart.append("g")
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0, ${vis.height + 90})`);
        vis.xAxisGroup.append("text")
            .attr("y", 20)
            .attr("x", vis.width)
            .attr("text-anchor", "right")
            .attr("stroke", "black")
            .text("Year");

        vis.yAxisGroup = vis.chart.append("g")
            .attr('class', 'axis y-axis')
            .attr('transform', `translate(0, ${vis.height / 2})`);
        vis.yAxisGroup.append("text")
            .attr("y", -35)
            .attr("x", -vis.height / 2 + 25)
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("stroke", "black")
            .text("# of Days");

        vis.lowerYAxisGroup = vis.chart.append("g")
            .attr('class', 'axis y-axis')
            .attr('transform', `translate(0, 169)`);

        vis.updateVis();
    }

    //leave this empty for now
    updateVis() { 
        let vis = this;

        // Process data
        vis.yearArray = [];
        const minYear = d3.min(vis.data, d => d.year);
        const maxYear = d3.max(vis.data, d => d.year);
        vis.data.forEach(d => {
            vis.yearArray.push(d.year);
        });
        vis.yearArray.sort();
        vis.fullYearArray = [];
        vis.yearFrequencyArray = [];
        for (var i = minYear; i <= maxYear; i++) {
            vis.fullYearArray.push(parseInt(i));
            vis.yearFrequencyArray.push(i);
        }
        // vis.fullYearArray.sort();
        //console.log('full year array: ', vis.fullYearArray);
        vis.numUniqueYears = 0;
        const getYearFrequency = (yearArray, fullYearArray) => {
            const map = {};
            fullYearArray.forEach(d => {
                map[d] = 0;
            });
            yearArray.forEach(d => {
                if (map[d] > 0) {
                    map[d] ++;
                }
                else {
                    vis.numUniqueYears ++;
                    map[d] = 1;
                }
            });
            return map;
        };
        vis.yearFrequency = getYearFrequency(vis.yearArray, vis.fullYearArray);
        //console.log('year frequency: ', vis.yearFrequency)
        vis.yearArray.forEach(d => {
            vis.yearFrequencyArray.push(vis.yearFrequency[d])
        });
        //console.log('year freq array: ', vis.yearFrequencyArray)

        // set scale domains
        vis.xScale.domain(vis.fullYearArray).paddingInner(0.1);
        vis.xAxisScale.domain(d3.extent(vis.yearArray));
        vis.yScale.domain([d3.max(vis.yearFrequencyArray) / 2 * 1.05, -(d3.max(vis.yearFrequencyArray) * .02)]);
        vis.yAxisScale.domain([-(d3.max(vis.yearFrequencyArray) * .02),d3.max(vis.yearFrequencyArray) / 2 * 1.05]);
        vis.lowerYAxisScale.domain([d3.max(vis.yearFrequencyArray) / 2 * 1.05, -(d3.max(vis.yearFrequencyArray) * .02)]);

        vis.xAxis.tickSizeOuter(0);
        vis.yAxis.tickSizeOuter(0);
        vis.lowerYAxis.tickSizeOuter(0);
        vis.xAxis.ticks(vis.numUniqueYears / 8);
        vis.yAxis.ticks(6);
        vis.lowerYAxis.ticks(6);

        vis.colorScale = ["#0000FF", "#FF0000", "#6600FF", "#FF6600", "#00FF00", "#FFF00"]

        vis.renderVis()
    }
  
    //leave this empty for now...
    renderVis() { 
        let vis = this;

        // Add rectangles
        vis.rect = vis.chart.selectAll('rect')
            .data(vis.fullYearArray)
            .enter()
            .append('rect')
                .attr('class', 'bar')
                .attr('fill', function(d,i) { if (vis.yearFrequency[d] == 0) { return "#808080"; } else{return vis.colorScale[i%5]}})
                .attr('width', d => vis.xScale.bandwidth())
                .attr('height', d => vis.height - vis.yScale(vis.yearFrequency[d]))
                .attr('y', d => vis.yScale(vis.yearFrequency[d] / 2))
                .attr('x', d => vis.xScale(d));

        vis.rect.on('mouseover', (event,d) => {
            d3.select('#tooltip')
                .style('display', 'block')
                .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
                .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                .html(`
                <div class="tooltip-title">${d}</div>
                <div><i>${vis.yearFrequency[d]} days</i></div>
                `);
        })
        .on('mouseleave', () => {
            d3.select('#tooltip').style('display', 'none');
        });

        // Update axis
        vis.xAxisGroup.call(vis.xAxis);
        vis.yAxisGroup.call(vis.yAxis);
        vis.lowerYAxisGroup.call(vis.lowerYAxis);

    }  
}