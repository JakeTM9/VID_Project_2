class BarChartWhen {
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 800,
            containerHeight: _config.containerHeight || 400,
            margin: _config.margin || {top: 10, right: 50, bottom: 75, left: 110},
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
            if (vis.startYear == null ){
                var date = new Date(d.eventDate);
                var month = date.getMonth();
                vis.monthCount[month] = vis.monthCount[month] + 1
            }
            else if(d.year >= vis.startYear && d.year <= vis.endYear){
                var date = new Date(d.eventDate);
                var month = date.getMonth();
                vis.monthCount[month] = vis.monthCount[month] + 1
            }
        });
        // console.log(vis.monthCount);

        //set up the width and height of the area where visualizations will go- factoring in margins               
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        // // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        // // Append group element that will contain our actual chart (see margin convention)
        const transformheight = - vis.config.margin.top 
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left}, ${transformheight})`);

        vis.chart.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y",  vis.config.margin.top - 75)
            .attr("x", -vis.height / 2)
            .attr("font-size","14px")
            .attr('font-weight', 'bold')
            .text("Month");

        vis.chart.append("text")
            .attr("y", vis.height + vis.config.margin.bottom)
            .attr("x", (vis.width - vis.config.margin.left - vis.config.margin.right)/2)
            .attr("font-size","14px")
           .attr('font-weight', 'bold')
            .attr("text-anchor", "right")
            .text("Samples per Month");

        vis.updateVis();
    }

    updateVis() {
        let vis = this;
        
        // scales
        vis.xScale = d3.scaleLinear()
            .domain([0, d3.max(vis.monthCount)])
            .range([0, vis.width]);
        vis.yScale = d3.scaleBand()
            // .domain(vis.monthNum)
            .paddingInner(0.15)
            .domain(vis.monthList)  
            .range([0, vis.height]);

        // console.log('max count in a month', d3.max(vis.monthCount));

        // init axis
        vis.xAxis = d3.axisBottom(vis.xScale)
            // .tickFormat(d3.format("d")); // Remove thousand comma
            .tickSizeOuter(0);
        vis.yAxis = d3.axisLeft(vis.yScale)
            .tickSizeOuter(0);

        // init axis groups
        vis.xAxisGroup = vis.chart.append("g")
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0, ${vis.height+25})`);

        // vis.xAxisGroup.append("text")
        //     .attr("y", 50)
        //     .attr("x", vis.width/2)
        //     .attr("text-anchor", "right")
        //     .attr("stroke", "black")
        //     .text("Samples per Month");

        vis.yAxisGroup = vis.chart.append("g")
            .attr('class', 'axis y-axis')
            // .attr('transform', `translate(0, ${vis.height})`);
            .attr('transform', `translate(0, 25)`);

        // vis.yAxisGroup.append("text")
        //    // .attr('class', 'label-text')
        //     .attr("y", -70)
        //     .attr("x", -vis.height / 2 + 25)
        //     .style("font", "20px times bold")
        //     .attr("text-anchor", "end")
        //     .attr("transform", "rotate(-90)")
        //     .attr("stroke", "black")
        //     .text("Month");

        vis.colorScale = ["#94C973", "#59981A"]
        vis.renderVis();

    }

    renderVis() {
        let vis = this;
        // console.log('Counts for each month:', vis.monthCount);
        // console.log(vis.monthNum);
        // Add rectangles
        vis.rect = vis.chart.selectAll('rect')
            .data(vis.monthNum)
            .enter()
            .append('rect')
                .attr('class', 'bar')
                .attr('fill', "#94C973")
                .attr('width', d => vis.xScale(vis.monthCount[d]))
                // .attr('height', d => vis.height - vis.yScale(vis.monthCount[d]))
                .attr('height', vis.yScale.bandwidth())
                .attr('y', d => vis.yScale(vis.monthList[d])+25)
                .attr('x', 1);

        vis.rect.on('mouseover', (event,d) => {
            d3.select('#tooltip')
                .style('display', 'block')
                .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
                .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                .html(`
                <div class="tooltip-title">${vis.monthList[d]}</div>
                <div><i>${vis.monthCount[d]} samples collected</i></div>
                `);
        })
        .on('mouseleave', () => {
            d3.select('#tooltip').style('display', 'none');
        });

        // Update axis
        vis.xAxisGroup.call(vis.xAxis);
        vis.yAxisGroup.call(vis.yAxis);
    }

    updateByYear(yearFrom,yearTo){
        let vis = this;
        vis.svg.selectAll('*').remove();
        vis.startYear = yearFrom;
        vis.endYear = yearTo;
        vis.initVis();
    }
}