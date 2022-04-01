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

        vis.categories = ["With GPS", "Without GPS"];
        // vis.haveGPS, vis.noGPS = 0;

        if (vis.startYear == null ){
            vis.totalSpecimens = d3.count(vis.data, d => d.id);
            vis.haveGPS = d3.count(vis.data, d => d.decimalLatitude);
            vis.noGPS = vis.totalSpecimens - vis.haveGPS;

            vis.pieData = [vis.haveGPS, vis.noGPS];
        }
        else {
            vis.haveGPS = 0;
            vis.noGPS = 0;
            vis.totalSpecimens = 0;

            vis.data.forEach(d=> {
                // if (d.decimalLatitude !== "null" || d.decimalLongitude !== "null"){
                if (d.year >= vis.startYear && d.year <= vis.endYear){
                    // vis.haveGPS += 1;
                    vis.totalSpecimens += 1;
                    // console.log(d.year);
                    if (d.decimalLatitude !== "null" || d.decimalLongitude !== "null"){
                        vis.haveGPS += 1;
                    }
                }
            });
            vis.noGPS = vis.totalSpecimens - vis.haveGPS;
            vis.pieData = [vis.haveGPS, vis.noGPS];
        }

        // vis.totalSpecimens = d3.count(vis.data, d => d.id);
        // vis.haveGPS = d3.count(vis.data, d => d.decimalLatitude);
        // vis.noGPS = vis.totalSpecimens - vis.haveGPS;

        // vis.pieData = [vis.haveGPS, vis.noGPS];

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
        vis.data_ready = vis.pie(vis.pieData);

        // shape helper to build arcs:
        vis.arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(vis.radius);

        vis.renderVis();
    }

    renderVis(){
        let vis = this;

        vis.slices = vis.chart.selectAll('mySlices')
            .data(vis.data_ready)
            .enter()
            .append('path')
                .attr('d', d3.arc()
                    .innerRadius(0)
                    .outerRadius(vis.radius)
                )
                .attr('fill', function(d, i){ return(vis.color(i)) })
                .attr("stroke", "black")
                .style("stroke-width", "2px")
                .style("opacity", 0.7);

        vis.slices.on('mouseover', (event,d) => {
            console.log('tooltip d: ', d)
            d3.select('#tooltip')
                .style('display', 'block')
                .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
                .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                .html(`
                <div class="tooltip-title">${d.value}/${vis.totalSpecimens} Specimans ${vis.categories[d.index]}</div>
                `);
        })
        .on('mouseleave', () => {
            d3.select('#tooltip').style('display', 'none');
        });

        // add title
        vis.chart.append("text")
            .attr("x", (vis.config.containerWidth / 8 - vis.config.margin.left / 2 - 30))
            .attr("y", - vis.config.containerHeight / 2 + vis.config.margin.top / 2)
            .attr("text-anchor", "middle")
            .text("Specimens With/Without GPS Coordinates")
    }

    updateByYear(yearFrom,yearTo){
        let vis = this;
        vis.svg.selectAll('*').remove();
        vis.startYear = yearFrom;
        vis.endYear = yearTo;
        vis.initVis();
    }
}