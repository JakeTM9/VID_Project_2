class timeLine {
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

    initVis(){
        let vis = this;
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.xScale = d3.scaleBand()
            // .domain([1859, 2017])
            .range([0, vis.width]);
    
        vis.yScale = d3.scaleBand()
            // .domain(vis.keys)
            // .domain(50)
            .range([0, vis.height])
            .paddingInner(0.15);

        // Initialize axes
        vis.xAxis = d3.axisBottom(vis.xScale)
            .tickFormat(d3.format("d")) // Remove thousand comma
            .ticks(6)
            .tickSizeOuter(0)
            .tickPadding(10);

        vis.yAxis = d3.axisLeft(vis.yScale)
            // .tickSize(-vis.width)
            // .tickPadding(10);
            .ticks(6)
            .tickSizeOuter(0)
            .tickPadding(10);

        // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        // Append group element that will contain our actual svg
        vis.svg
            .append("g")
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        // Append empty x-axis group and move it to the bottom of the svg
        vis.xAxisG = vis.svg.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`);
        
        // Append y-axis group
        vis.yAxisG = vis.svg.append('g')
            .attr('class', 'axis y-axis');
    }

    updateVis(){
        let vis = this;

        // vis.svg.append("rect")
        //     .data([vis.data])
        //     .attr('class', 'chart-bar')
        //     .attr('width', vis.xScale.bandwidth())
        //     .attr('height', vis.height)
        //     .attr('y', vis.yScale)
        //     .attr('x', 0);
            
        vis.renderVis();
    }

    renderVis(){
        let vis = this;

        // Update the axes
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);

    }
}