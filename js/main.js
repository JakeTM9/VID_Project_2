d3.csv('data/processed_fixed.csv')
.then(data => {
    data.forEach(d => {
      //d.latitude = +d.lat; //make sure these are not strings
      //d.longitude = +d.lng; //make sure these are not strings
    });

    console.log(data);//ok, got my data!

    // Initialize chart and then show it
    leafletMap = new LeafletMap({ parentElement: '#my-map'}, data);


  })
  .catch(error => console.error(error));