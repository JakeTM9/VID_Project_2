class LeafletMap {

    /**
     * Class constructor with basic configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data) {
      this.config = {
        parentElement: _config.parentElement,
      }
      this.data = _data;
      this.initVis();
    }
    
    /**
     * We initialize scales/axes and append static elements, such as axis titles.
     */
    initVis() {
      let vis = this;
  
      //ESRI
      vis.esriUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      vis.esriAttr = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
  
      //TOPO
      vis.topoUrl ='https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      vis.topoAttr = 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  
      //Thunderforest Outdoors- requires key... so meh... 
      vis.thOutUrl = 'https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey={apikey}';
      vis.thOutAttr = '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  
      //Stamen Terrain
      vis.stUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}';
      vis.stAttr = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  
      //this is the base map layer, where we are showing the map background
      /*
      vis.base_layer = L.tileLayer(vis.esriUrl, {
        id: 'esri-image',
        attribution: vis.esriAttr,
        ext: 'png',
        continuousWorld: false,
        noWrap: true,
        minZoom: 2
        
      });*/

      vis.ersi = L.tileLayer(vis.esriUrl, {
        id: 'esri-image',
        attribution: vis.esriAttr,
        ext: 'png',
        continuousWorld: false,
        noWrap: true,
        minZoom: 2
      });

      vis.topo = L.tileLayer(vis.topoUrl, {
        id: 'topo-image',
        attribution: vis.topoAttr,
        ext: 'png',
        continuousWorld: false,
        noWrap: true,
        minZoom: 2
      });

      vis.Stamen = L.tileLayer(vis.stUrl, {
        id: 'st-image',
        attribution: vis.stAttr,
        ext: 'png',
        continuousWorld: false,
        noWrap: true,
        minZoom: 2
      });

      var allLayers = {"ERSI" : vis.ersi,
                        "Topographic" : vis.topo,
                        "Stamen" : vis.Stamen
                      }
      
      let southWest = L.latLng(-89.98155760646617, -180);
      let northEast = L.latLng(89.99346179538875, 180);
      vis.theMap = L.map('my-map', {
        center: [0,0],
        zoom: 2,
        layers: [vis.ersi],
        maxBoundsViscosity: 1.0
      });
      L.control.layers(allLayers,null,{collapsed:false}).addTo(vis.theMap);
      vis.theMap.bounds = []
      vis.theMap.setMaxBounds(L.latLngBounds(southWest, northEast));
  
      //if you stopped here, you would just have a map
  
      //initialize svg for d3 to add to map
       L.svg({clickable:true}).addTo(vis.theMap)// we have to make the svg layer clickable
       vis.overlay = d3.select(vis.theMap.getPanes().overlayPane)
       vis.svg = vis.overlay.select('svg').attr("pointer-events", "auto")
      
      //default color type
      vis.colorType = "year";
      //handle DOT color....duhh
      vis.handleDotColor = function (data,colorType) {
        if(colorType == "phylum"){
          switch(data.phylum){
            case "Myxomycota":
              return "green";
              break;
            case "Ascomycota":
              return "red";
              break;
            case "Basidiomycota":
              return "blue";
              break;
            case "Amoebozoa":
              return "yellow";
              break;
            case "Chytridiomycota":
              return "purple";
              break;
            case "Zygomycota":
              return "orange";
              break;
            case "Oomycota":
              return "pink";
              break;
            case "Blastocladiomycota":
              return "brown";
              break;
            default:
              return "black";
          }
        }
        else if (colorType == "year"){
          return data.yearGradientColor;
        }
        else if (colorType == "day"){
          return data.dayGradientColor;
        }
      }
  
      //these are the city locations, displayed as a set of dots 
      vis.Dots = vis.svg.selectAll('circle')
                      .data(vis.data) 
                      .join('circle')
                          .attr("fill", d => vis.handleDotColor(d, vis.colorType)) 
                          .attr("stroke", "black")
                          //Leaflet has to take control of projecting points. Here we are feeding the latitude and longitude coordinates to
                          //leaflet so that it can project them on the coordinates of the view. Notice, we have to reverse lat and lon.
                          //Finally, the returned conversion produces an x and y point. We have to select the the desired one using .x or .y
                          .attr("cx", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).x)
                          .attr("cy", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).y) 
                          .attr("r", 3)
                          .on('mouseover', function(event,d) { //function to add mouseover event
                              d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
                                .duration('150') //how long we are transitioning between the two states (works like keyframes)
                                /*.attr("fill", "white") *///change the fill
                                .attr('r', vis.theMap.getZoom() + 10); //change radius
  
                              //create a tool tip
                              d3.select('#tooltip-map')
                                  .style('opacity', 1)
                                  .style('z-index', 1000000)
                                    // Format number with million and thousand separator THESE R THE VARS: ${d.city} ${d3.format(',')(d.population)}
                                  .html(`<div class="tooltip-map-label">Collected: ${d.year} <br>
                                                                    Recorded By: ${d.recordedBy} <br>
                                                                    Kingdom: ${d.kingdom} <br>
                                                                    Phylum: ${d.phylum} <br>
                                                                    Habitat: ${d.habitat}</div>`);
  
                            })
                          .on('mousemove', (event) => {
                              //position the tooltip
                              d3.select('#tooltip-map')
                               .style('left', (event.pageX + 10) + 'px')   
                                .style('top', (event.pageY + 10) + 'px');
                           })              
                          .on('mouseleave', function() { //function to add mouseover event
                              d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
                                .duration('150') //how long we are transitioning between the two states (works like keyframes)
                                .attr("fill", d => vis.handleDotColor(d,vis.colorType)) //change the fill
                                .attr('r', vis.theMap.getZoom() + 1) //change radius
  
                              d3.select('#tooltip-map').style('opacity', 0);//turn off the tooltip
  
                            })
                          .on('click', (event, d) => { //experimental feature I was trying- click on point and then fly to it
                             // vis.newZoom = vis.theMap.getZoom()+2;
                             // if( vis.newZoom > 18)
                             //  vis.newZoom = 18; 
                             // vis.theMap.flyTo([d.latitude, d.longitude], vis.newZoom);
                            });
      
      //handler here for updating the map, as you zoom in and out           
      vis.theMap.on("zoomend", function(){
        vis.updateVis();
      });
  
    }
  
    updateVis() {
      let vis = this;
  
      //want to see how zoomed in you are? 
      // console.log(vis.map.getZoom()); //how zoomed am I
      
      //want to control the size of the radius to be a certain number of meters? 
      vis.radiusSize = vis.theMap.getZoom() + 1; 
      // if( vis.theMap.getZoom > 15 ){
      //   metresPerPixel = 40075016.686 * Math.abs(Math.cos(map.getCenter().lat * Math.PI/180)) / Math.pow(2, map.getZoom()+8);
      //   desiredMetersForPoint = 100; //or the uncertainty measure... =) 
      //   radiusSize = desiredMetersForPoint / metresPerPixel;
      // }
     
     //redraw based on new zoom- need to recalculate on-screen position
      vis.Dots
        .attr("cx", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).x)
        .attr("cy", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).y)
        .attr("r", vis.radiusSize)
        .attr("fill", d => vis.handleDotColor(d,vis.colorType));
  
    }
  
  
    renderVis() {
      let vis = this;
  
      //not using right now... 
   
    }

    //HELPER FUNCTIONS BELOW

    //from legend select
    updateDots(colorType){
      let vis = this;
      vis.colorType = colorType;
      this.updateVis();
    }
  }