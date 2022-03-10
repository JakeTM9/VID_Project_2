class TimeLine {

    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerHeight: _config.containerHeight || 140,
            margin: { top: 40, bottom: 35, right: 50, left: 115 },
            tooltipPadding: _config.tooltipPadding || 15
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

        // // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        // // Append group element that will contain our actual chart (see margin convention)
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        // scales
        vis.xScale = d3.scaleBand()
            .range([0, vis.width]);

        vis.updateVis();
    }

    //leave this empty for now
    updateVis() { 
        let vis = this;

        // Remove old lines
        // vis.chart.selectAll("rect").remove();

        // Process data
        // vis.hamiltonData = []
        // vis.data.forEach(d => {
        //     if (d.county == "Hamilton") {
        //         vis.hamiltonData.push({"total": d.total, "cat": d.cat, "stat": d.stat});
        //     }
        // }); 

        // vis.hamiltonProcessedData = []
        // let hamiltonTotalDays = vis.hamiltonData[0].total
        // vis.hamiltonData.forEach(d => {
        //     vis.hamiltonProcessedData.push({"cat": d.cat, "stat": d.stat / hamiltonTotalDays * 100})
        // });

        // set scale domains
        // vis.xScale.domain([0, d3.max(vis.hamiltonProcessedData, d => d.stat)]);
        vis.xScale.domain(vis.data.map(d => d.year)).paddingInner(0.1);

        // vis.hamiltonxAxis.tickSizeOuter(0);
        // vis.hamiltonyAxis.tickSizeOuter(0);
        // vis.comparexAxis.tickSizeOuter(0);
        // vis.compareyAxis.tickSizeOuter(0);

                // color palette
        // vis.colorScale = d3.scaleOrdinal()
        //         .range(['#e41a1c','#377eb8','#4daf4a'])

        vis.colorScale = ["0968E5","0965E1","0963DD","0960D9","095DD5","095AD1","0958CD","0955C9","0952C5","094FC1","094DBD","094AB9","0947B5","0945B1","0942AD","093FA8","093CA4","093AA0","09379C","093498","093294","092F90","092C8C","092988","092784","092480","09217C","091E78","091C74","091970"];
        vis.myColor = d3.scaleLinear().domain([1,10])
            .range(["white", "blue"]) 

        vis.renderVis()
    }
  
    //leave this empty for now...
    renderVis() { 
        let vis = this;

        // Add rectangles
        vis.rect = vis.chart.selectAll('rect')
            .data(vis.data)
            .enter()
            .append('rect')
                .attr('class', 'bar')
                .attr('fill', function(d){return vis.myColor(d)})
                .attr('width', d => vis.xScale.bandwidth())
                .attr('height', vis.height)
                .attr('y', 0)
                .attr('x', d => vis.xScale(d.year));
    }  
}