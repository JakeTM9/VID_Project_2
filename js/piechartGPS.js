class PieChartGPS {
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

        vis.categories = ["Total", "With GPS", "Without GPS"];

        vis.totalSpecimens = d3.count(vis.data, d => d.id);
        vis.haveGPS = d3.count(vis.data, d => d.decimalLatitude);
        vis.noGPS = vis.totalSpecimens - vis.haveGPS;

        vis.barchartData = [vis.totalSpecimens, vis.haveGPS, vis.noGPS];

        //set up the width and height of the area where visualizations will go- factoring in margins               
        vis.radius = vis.config.containerHeight / 2 - vis.config.margin.top;

        // // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        // // Append group element that will contain our actual chart (see margin convention)
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.containerWidth / 4}, ${vis.config.containerHeight / 2})`)

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // scales
        // set the color scale
        vis.color = d3.scaleOrdinal()
            .domain(vis.data)
            .range(d3.schemeSet2);

        // Compute the position of each group on the pie:
        vis.pie = d3.pie();
        vis.data_ready = vis.pie(vis.barchartData);

        // shape helper to build arcs:
        vis.arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(vis.radius);

        vis.renderVis();
    }

    renderVis(){
        let vis = this;

        vis.chart.selectAll('mySlices')
            .data(vis.data_ready)
            .enter()
            .append('path')
                // .attr('d', vis.arcGenerator)
                .attr('d', d3.arc()
                    .innerRadius(0)
                    .outerRadius(vis.radius)
                )
                .attr('fill', function(d, i){ return(vis.color(i)) })
                .attr("stroke", "black")
                .style("stroke-width", "2px")
                .style("opacity", 0.7);

        // vis.rect.on('mouseover', (event,d) => {
        //     d3.select('#tooltip')
        //         .style('display', 'block')
        //         .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
        //         .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
        //         .html(`
        //         <div class="tooltip-title">${vis.categories[d]}</div>
        //         <div><i>${vis.barchartData[d]} Specimens</i></div>
        //         `);
        // })
        // .on('mouseleave', () => {
        //     d3.select('#tooltip').style('display', 'none');
        // });
    }
}