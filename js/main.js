d3.csv('data/processed_fixed.csv')
.then(data => {
    let timelineData = [];  
    data.forEach(d => {
        timelineData.push(d.year);

      //d.latitude = +d.lat; //make sure these are not strings
      //d.longitude = +d.lng; //make sure these are not strings
      //get lat/long for map        
        if(d.decimalLatitude !== "null"){
            d.latitude = +d.decimalLatitude;
        }
        else{
            d.latitude = 1000000000000000000000;
        }
        if(d.decimalLongitude !== "null"){
                d.longitude = +d.decimalLongitude;
        }
        else{
            d.longitude = 100000000000000000000;
        }
    });

    console.log(data);//ok, got my data!
    console.log('timeline data: ', timelineData)

    // Initialize chart and then show it
    leafletMap = new LeafletMap({ parentElement: '#my-map'}, data);
    timeLine = new TimeLine({ parentElement: '#timeline'}, timelineData);


  })
  .catch(error => console.error(error));