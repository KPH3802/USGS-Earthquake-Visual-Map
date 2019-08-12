//  API endpoint to a variable queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(response) {
    
    // console.log(response.features[0].properties);
    // console.log(response.features[0].geometry.coordinates[0]);
    var earthquakeArr = [];
    var earthquakelocation = [];

    for (var i = 0; i < response.features.length; i++)
            earthquakelocation.push([response.features[i].geometry.coordinates[1], response.features[i].geometry.coordinates[0]]);
    console.log(earthquakelocation);
    for (var i = 0; i < earthquakelocation.length; i++)

                L.circle(earthquakelocation[i]).addTo(myMap);
    
            
  });





// Creating the initial map object
var myMap = L.map('map', {
    center : [36.778259, -119.417931],
    zoom : 5
});

//  Adding a tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);