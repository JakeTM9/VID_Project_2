
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
//from: https://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
function dayNo(y,m,d){
    return --m>=0 && m<12 && d>0 && d<29+(  
             4*(y=y&3||!(y%25)&&y&15?0:1)+15662003>>m*2&3  
           ) && m*31-(m>1?(1054267675>>m*3-6&7)-y:0)+d;
}


//got color ideas from: https://colordesigner.io/gradient-generator
//create gradient color value arays for years and days
const blueRed = interpolateColors("rgb(0, 3, 199)", "rgb(212, 13, 18)", 80)
const redYellow = interpolateColors("rgb(212, 13, 18)", "rgb(255, 234, 0)", 79)
const yearGradientColorArray = blueRed;
yearGradientColorArray.push.apply(yearGradientColorArray,redYellow);

const blueRedDays = interpolateColors("rgb(0, 3, 199)", "rgb(212, 13, 18)", 183)
const redYellowDays = interpolateColors("rgb(212, 13, 18)", "rgb(255, 234, 0)", 183)
const dayGradientColorArray = blueRedDays;
dayGradientColorArray.push.apply(dayGradientColorArray,redYellowDays);

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

        //for tooltips
        if(d.kingdom === "null") {d.kingdom = "uknown";}
        if(d.phylum === "null") {d.phylum = "uknown";}
        if(d.habitat === "null") {d.habitat = "uknown";}

        //start gradient year/month/day stuff
        //this is just an if statement, finds the day from eventDate if d.day doesnt work out
        (d.day === "null") ? d.day = Math.abs(+d.eventDate.slice(-2)) : d.day = +d.day; //abs in case it reads in a dash and then is negative
        d.year = +d.year;
        //months are weird
        if (d.month == "null") d.month = d.eventDate.slice(5,7);
        if (d.month.slice(-1)== '-') d.month = d.month.slice(0,1);
        d.month = +d.month;
        d.daysIntoYear = dayNo(d.year,d.month,d.day);
        //writes rgb color for year gradient for later
        d.yearGradientColor = "rgb("+ yearGradientColorArray[d.year - 1859][0] + ", " + yearGradientColorArray[d.year - 1859][1] + ", " +  yearGradientColorArray[d.year - 1859][2] + ")"; //ew
        d.dayGradientColor = "rgb("+ dayGradientColorArray[d.daysIntoYear - 1 ][0] + ", " + dayGradientColorArray[d.daysIntoYear - 1][1] + ", " +  dayGradientColorArray[d.daysIntoYear - 1][2] + ")"; //ew
        //end gradient year/month/day stuff

    });

    console.log(data);//ok, got my data!

    // Initialize chart and then show it
    leafletMap = new LeafletMap({ parentElement: '#my-map'}, data);
    timeLine = new TimeLine({ parentElement: '#timeline'}, data);

    barChartWhen = new BarChartWhen({ parentElement: '#barchartWhen'}, data);
    barChartCollectors = new BarChartCollectors({parentElement: '#barchartCollectors'}, data);
    barChartClasses = new BarChartClasses({parentElement: '#barchartClasses'}, data);
    
    pieChartGPS = new PieChartGPS({parentElement: '#piechartGPS'}, data);
    pieChartDate = new PieChartDate({parentElement: '#piechartDate'}, data);

  })
  .catch(error => console.error(error));

//on legend change update map dot color
function updateMapCircleColor(value){
    leafletMap.updateDots(value);
}

//change displayed legend
$(document).ready(function(){
    $('#mapLegend').on('change', function() {
        $('#year-legend').hide();
        $('#day-legend').hide();
        $('#phylum-legend').hide();
        $('#' + $(this).val() + '-legend').show();
    });
});

//Timelines for Gradient Legends Below

var svgYear = d3.select("#year-legend-axis")
  .append("svg")
    .attr("width", 850)
    .attr("height", 30)
    
// Create the scale
var x = d3.scaleTime()
    .domain([new Date("1859-01-01"), new Date("2017-01-01")])         
    .range([30, 825]);
    
// Draw the axis
svgYear
  .append("g")
  .call(d3.axisBottom(x)
        .ticks(16));


var svgDay = d3.select("#day-legend-axis")
  .append("svg")
    .attr("width", 850)
    .attr("height", 30)
    
// Create the scale
var x = d3.scaleLinear()
    .domain([1,366])         
    .range([30, 825]);
    
// Draw the axis
svgDay
  .append("g")
  .call(d3.axisBottom(x)
        .ticks(32));