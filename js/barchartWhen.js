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
        vis.monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        vis.monthNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

        vis.monthCount = new Array(12).fill(0);
        vis.data.forEach(d=> {
            var date = new Date(d.eventDate);
            var month = date.getMonth();
            // var splitDate = date.split("");
            // var month = splitDate[0];
            // console.log(month);
            vis.monthCount[month] = vis.monthCount[month] + 1
        });
        // console.log(vis.monthCount);

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

        

        vis.updateVis();
    }

    updateVis() {
        let vis = this;
        
        // scales
        vis.xScale = d3.scaleLinear()
            .domain([0, d3.max(vis.monthCount)])
            .range([0, vis.width]);
        vis.yScale = d3.scaleBand()
            .domain(vis.monthNum) 
            .range([0, vis.height]);

        // console.log('max count in a month', d3.max(vis.monthCount));

        // init axis
        vis.xAxis = d3.axisBottom(vis.xScale)
            // .tickFormat(d3.format("d")); // Remove thousand comma
        vis.yAxis = d3.axisLeft(vis.yScale);

        // init axis groups
        vis.xAxisGroup = vis.chart.append("g")
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0, ${vis.height+75})`);
        vis.xAxisGroup.append("text")
            .attr("y", 50)
            .attr("x", vis.width/2)
            .attr("text-anchor", "right")
            .attr("stroke", "black")
            .text("Samples per Month");

        vis.yAxisGroup = vis.chart.append("g")
            .attr('class', 'axis y-axis');
            // .attr('transform', `translate(0, ${vis.height})`);
        vis.yAxisGroup.append("text")
            .attr("y", -35)
            .attr("x", -vis.height / 2 + 25)
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("stroke", "black")
            .text("Month");

        vis.renderVis();

    }

    renderVis() {
        let vis = this;
        console.log('Counts for each month:', vis.monthCount);
        // console.log(vis.monthNum);
        // Add rectangles
        vis.rect = vis.chart.selectAll('rect')
            .data(vis.monthNum)
            .enter()
            .append('rect')
                .attr('class', 'bar')
                .attr('fill', "green")
                .attr('width', d => vis.xScale(vis.monthCount[d]))
                // .attr('height', d => vis.height - vis.yScale(vis.monthCount[d]))
                .attr('height', vis.yScale.bandwidth())
                .attr('y', d => vis.yScale(vis.monthNum[d]))
                .attr('x', 0);

        vis.rect.on('mouseover', (event,d) => {
            d3.select('#tooltip')
                .style('display', 'block')
                .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
                .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                .html(`
                <div class="tooltip-title">${d}</div>
                <div><i>${vis.monthCount[d]} days</i></div>
                `);
        })
        .on('mouseleave', () => {
            d3.select('#tooltip').style('display', 'none');
        });

        // Update axis
        vis.xAxisGroup.call(vis.xAxis);
        vis.yAxisGroup.call(vis.yAxis);
    }
}