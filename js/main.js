
//color gradient nonsense, credit here: https://jsfiddle.net/002v98LL/ 
function interpolateColor(color1, color2, factor) {
    if (arguments.length < 3) { 
        factor = 0.5; 
    }
    var result = color1.slice();
    for (var i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
};
function interpolateColors(color1, color2, steps) {
    var stepFactor = 1 / (steps - 1),
        interpolatedColorArray = [];

    color1 = color1.match(/\d+/g).map(Number);
    color2 = color2.match(/\d+/g).map(Number);

    for(var i = 0; i < steps; i++) {
        interpolatedColorArray.push(interpolateColor(color1, color2, stepFactor * i));
    }

    return interpolatedColorArray;
}
//got color ideas from: https://colordesigner.io/gradient-generator
const blueRed = interpolateColors("rgb(0, 3, 199)", "rgb(212, 13, 18)", 80)
const redYellow = interpolateColors("rgb(212, 13, 18)", "rgb(255, 234, 0)", 79)
const yearGradientColorArray = blueRed;
yearGradientColorArray.push.apply(yearGradientColorArray,redYellow);

d3.csv('data/processed_fixed.csv')
.then(data => {
    data.forEach(d => {

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

        //start day nonsense

        //this is just an if statement, finds the day from eventDate if d.day doesnt work out
        (d.day === "null") ? d.day = +d.eventDate.slice(-2) : d.day = +d.day;
        d.year = +d.year;

        //writes rgb color for year gradient for later
        d.yearGradientColor = "rgb("+ yearGradientColorArray[d.year - 1859][0] + ", " + yearGradientColorArray[d.year - 1859][1] + ", " +  yearGradientColorArray[d.year - 1859][2] + ")"; //ew
        if(d.year == 2017){
            console.log(d.yearGradientColor);
        }
        
    });

    console.log(data);//ok, got my data!

    // Initialize chart and then show it
    leafletMap = new LeafletMap({ parentElement: '#my-map'}, data);
    timeLine = new TimeLine({ parentElement: '#timeline'}, data);
    barChartWhen = new BarChartWhen({ parentElement: '#barchartWhen'}, data);


  })
  .catch(error => console.error(error));

//Select function for Legend
function updateMapCircleColor(value){
    leafletMap.updateDots(value);
}