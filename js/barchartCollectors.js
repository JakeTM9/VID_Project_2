class BarChartCollectors {
     /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
      constructor(_config, _data) {
        this.config = {
          parentElement: _config.parentElement,
          containerWidth: _config.containerWidth || 800,
          containerHeight: _config.containerHeight || 400,
          margin: _config.margin || {top: 50, right: 10, bottom: 150, left: 110}
        }
        this.data = _data;
        this.initVis();
    }

    initVis() {
        let vis = this;
        //START DATA PROCESSING -------------------------------------------------------------------------------------------------------------------------
        vis.collectionsByPerson = {
        }
        //this is how we do it
        vis.data.forEach(d =>{
            if (vis.collectionsByPerson.hasOwnProperty(d.recordedBy)){
                vis.collectionsByPerson[d.recordedBy] += 1;
            }
            else{
                vis.collectionsByPerson[d.recordedBy] = 1;
            }
        });
        //credit: https://stackoverflow.com/questions/25500316/sort-a-dictionary-by-value-in-javascript
        // Create items array
        var items = Object.keys(vis.collectionsByPerson).map(function(key) {
            return [key, vis.collectionsByPerson[key]];
        });
        // Sort the array based on the second element
        items.sort(function(first, second) {
            return second[1] - first[1];
        });
        vis.collectionsByPerson = items.slice(0,10);
        vis.People = []
        vis.Collections = []
        vis.collectionsByPerson.forEach(d => {
            vis.People.push(d[0]);
            vis.Collections.push(+d[1]);
        })
        //END DATA PROCESSING ------------------------------------------------------------------------------------------------------------------------------

        //console.log(vis.collectionsByPerson);
        
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
    
        vis.xScale = d3.scaleLinear()
            .domain([0,d3.max(vis.Collections)])
            .range([0, vis.width]);
        
        vis.yScale = d3.scaleBand()
          .domain(vis.People)
          .range([0, vis.height])
          .paddingInner(0.15);

            // Initialize axes
        vis.xAxis = d3.axisBottom(vis.xScale)
        .ticks(6)
        .tickSizeOuter(0)
        .tickPadding(10);

      //.tickFormat(d => d + ' km');

        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(6)
            .tickSizeOuter(0)
            .tickPadding(10);
        
        // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        // Append group element that will contain our actual chart (see margin convention)
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        // Append empty x-axis group and move it to the bottom of the chart
        vis.xAxisG = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`);
        
        // Append y-axis group
        vis.yAxisG = vis.chart.append('g')
            .attr('class', 'axis y-axis');

        // We need to make sure that the tracking area is on top of other chart elements
        vis.marks = vis.chart.append('g');
        vis.trackingArea = vis.chart.append('rect')
            .attr('width', vis.width)
            .attr('height', vis.height +50 ) 
            .attr('fill', 'none')
            .attr('pointer-events', 'all');
        
        //axes titles
        vis.chart.append("text")
        .attr("text-anchor", "end")
        .attr("x", vis.width/2 + 55)
        .attr("y", vis.height + 60)
        .attr("font-size","14px")
        .attr('font-weight', 'bold')
        .text("Number of Collections");

        vis.chart.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -vis.config.margin.left + 15)
        .attr("x", -vis.config.margin.top - 20 )
        .attr("font-size","14px")
        .attr('font-weight', 'bold')
        .text("Collector");

        vis.startYear = null;
        vis.endYear = null;
        vis.updateVis();

    }

    /**
     * Prepare the data and scales before we render it.
     */
    updateVis() {
        let vis = this;
        if(vis.startYear !== null && vis.endYear !== null){
            // console.log(vis.startYear);
            vis.collectionsByPerson = {
            }
            //this is how we do it
            //2 extra iffs is how we filter by years
            vis.data.forEach(d =>{
                if (vis.collectionsByPerson.hasOwnProperty(d.recordedBy) && (d.year >= vis.startYear && d.year <= vis.endYear)){
                    vis.collectionsByPerson[d.recordedBy] += 1;
                }
                else if ((d.year >= vis.startYear && d.year <= vis.endYear)){
                    vis.collectionsByPerson[d.recordedBy] = 1;
                }
                
            });
            //credit: https://stackoverflow.com/questions/25500316/sort-a-dictionary-by-value-in-javascript
            // Create items array
            var items = Object.keys(vis.collectionsByPerson).map(function(key) {
                return [key, vis.collectionsByPerson[key]];
            });
            // Sort the array based on the second element
            items.sort(function(first, second) {
                return second[1] - first[1];
            });
            vis.collectionsByPerson = items.slice(0,10);
            vis.People = []
            vis.Collections = []
            vis.collectionsByPerson.forEach(d => {
                vis.People.push(d[0]);
                vis.Collections.push(+d[1]);
            })
            //fix bug
            if(vis.People.length < 10){
                while(vis.Collections.length < 10){
                    vis.Collections.push(0);
                    vis.collectionsByPerson.push({
                        0: "Joe Mama",
                        1: 0
                    });
                }
            }
            //fix scales and axis
            vis.yScale = d3.scaleBand()
                .domain(vis.People)
                .range([0, vis.height])
                .paddingInner(0.15);
            
            vis.xScale = d3.scaleLinear()
                .domain([0,d3.max(vis.Collections)])
                .range([0, vis.width]);

            vis.xAxis = d3.axisBottom(vis.xScale)
            .ticks(6)
            .tickSizeOuter(0)
            .tickPadding(10);

            vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(6)
            .tickSizeOuter(0)
            .tickPadding(10)
        }
        /*
        vis.xValue = d => d.Good;
        vis.yValue = d => d.MaxAQI;
        vis.yValue2 = d => d.MedianAQI;
        vis.yValue3 = d => d.NinteyAQI;

        vis.bisectDate = d3.bisector(vis.xValue).left;
        */
        vis.renderVis();
    }

    /**
     * Bind data to visual elements
     */
    renderVis() {
        let vis = this;
        // Add bar path

        //remove old
        vis.chart.selectAll("rect").remove();

        vis.rect = vis.chart.selectAll('rect')
            .data(vis.collectionsByPerson)
            .enter()
            .append('rect')
                .attr('class', 'bar')
                .attr('fill', "#94C973")
                .attr('width',d => vis.xScale(d[1]))
                .attr('height', vis.yScale.bandwidth())
                .attr('y', d => vis.yScale(d[0]))
                .attr('x', 0);

        // Update the axes
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);
    }

    updateByYear(yearFrom,yearTo){
        let vis = this;
        vis.startYear = yearFrom;
        vis.endYear = yearTo;
        vis.updateVis();
    }
    
}