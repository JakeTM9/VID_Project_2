class BarChartWhen {
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 800,
            containerHeight: _config.containerHeight || 400,
            margin: _config.margin || {top: 50, right: 10, bottom: 30, left: 110},
            tooltipPadding: _config.tooltipPadding || 15
        }
  
    this.data = _data;
    this.initVis();
    }

    initVis() {
        let vis = this;

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        var monthCount = new Array(12).fill(0);
        vis.data.forEach(d=> {
            var date = new Date(d.eventDate);
            var month = date.getMonth();
            // var splitDate = date.split("");
            // var month = splitDate[0];
            // console.log(month);
            monthCount[month] = monthCount[month] + 1
        });
        console.log(monthCount);

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

        // init axis
        vis.xAxis = d3.axisBottom(vis.xAxisScale).tickFormat(d3.format("d")); // Remove thousand comma
        vis.yAxis = d3.axisLeft(vis.yAxisScale);

        // init axis groups
        vis.xAxisGroup = vis.chart.append("g")
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0, ${vis.height + 90})`);
        vis.xAxisGroup.append("text")
            .attr("y", 20)
            .attr("x", vis.width-100)
            .attr("text-anchor", "right")
            .attr("stroke", "black")
            .text("Month");

        vis.yAxisGroup = vis.chart.append("g")
            .attr('class', 'axis y-axis')
            .attr('transform', `translate(0, ${vis.height / 2})`);
        vis.yAxisGroup.append("text")
            .attr("y", -35)
            .attr("x", -vis.height / 2 + 25)
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("stroke", "black")
            .text("Samples per Month");

        // // Create axes scales
        // vis.xScale = d3.scaleBand()
        //     .domain([0, 11])
        //     .range([ 0, vis.width ]);
    
        // vis.yScale = d3.scaleBand()
        //     // .domain(vis.keys)
        //     .domain([0, d3.max(monthCount)])
        //     .range([0, vis.height])
        //     .paddingInner(0.15);

        // // Initialize axes
        // vis.xAxis = d3.axisBottom(vis.xScale)
        //     // .tickFormat(d3.format("d")); // Remove thousand comma
        //     .ticks(6)
        //     .tickSizeOuter(0)
        //     .tickPadding(10);

        //  vis.yAxis = d3.axisLeft(vis.yScale)
        //     // .tickSize(-vis.width)
        //     // .tickPadding(10);
        //     .ticks(6)
        //     .tickSizeOuter(0)
        //     .tickPadding(10);

        // // Define size of SVG drawing area
        // vis.svg = d3.select(vis.config.parentElement)
        //     .attr('width', vis.config.containerWidth)
        //     .attr('height', vis.config.containerHeight);

        // // Append group element that will contain our actual chartAQIRating
        // vis.svg
        // .append("g")
        // .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        // // Append empty x-axis group and move it to the bottom of the chartAQIRating
        // vis.xAxisG = vis.svg.append('g')
        //     .attr('class', 'axis x-axis')
        //     .attr('transform', `translate(0,${vis.height})`);
        //     // .attr("transform", "translate(0," + vis.height + ")")
        
        // // Append y-axis group
        // vis.yAxisG = vis.svg.append('g')
        //     .attr('class', 'axis y-axis');

        // //axes titles
        // vis.svg.append("text")
        //     .attr("text-anchor", "end")
        //     .attr("x", vis.width/2 +50)
        //     .attr("y", vis.height+30)
        //     .attr("font-size","16px")
        //     .text("% of Year");

        // vis.svg.append("text")
        //     .attr("text-anchor", "end")
        //     .attr("transform", "rotate(-90)")
        //     .attr("y", -vis.config.margin.left+15)
        //     .attr("x", -vis.config.margin.top -60 )
        //     .attr("font-size","16px")
        //     .text("AQI Category");

        // // Chart title
        // vis.svg.append("text")
        //     .attr("x", (vis.width / 2) + 90)             
        //     .attr("y", 0 - (vis.config.margin.top / 2) + 50)
        //     .attr("text-anchor", "middle")  
        //     .style("font-size", "16px") 
        //     .style("text-decoration", "underline")  
        //     .text("Prevalence of AQI Categories 2021");

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.svg.append("rect")
            .data([vis.data])
            .attr('class', 'chart-bar')
            .attr('width', )
            .attr('height', )
            .attr('y', )
            .attr('x',0);

    }

    renderVis() {
        let vis = this;

        // Add rectangles
        vis.rect = vis.chart.selectAll('rect')
            .data(vis.fullYearArray)
            .enter()
            .append('rect')
                .attr('class', 'bar')
                .attr('fill', )
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