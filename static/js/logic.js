//  API endpoint to a variable queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(response) {
    
    // var earthquakeArr = [];
    // var earthquakelocation = [];
    console.log(response.features[1]);

    for (var i = 0; i < response.features.length; i++){
    //         earthquakelocation.push([response.features[i].geometry.coordinates[1], response.features[i].geometry.coordinates[0]]);
    // console.log(earthquakelocation);
    // for (var i = 0; i < earthquakelocation.length; i++)
        
        var color = "";
        if (response.features[i].properties.mag <= .5){
            color = "white";
        }
        else if (response.features[i].properties.mag <= 1.0){
            color = "#FFFF00"
        }
        else if (response.features[i].properties.mag <= 1.5){
            color = "#FFCC00"
        }
        else if (response.features[i].properties.mag <= 2.0){
            color = "#FF9900"
        }
        else if (response.features[i].properties.mag <= 2.5){
            color = "#FF6600"
        }
        else if (response.features[i].properties.mag <= 3.0){
            color = "#FF3300"
        }
        else {
            color = "#FF0000"
        }
        var USGSlink = response.features[i].properties.url
        
                L.circle([response.features[i].geometry.coordinates[1], response.features[i].geometry.coordinates[0]],{
                        color : color,
                        fillOpacity: 1.0,
                        radius : response.features[i].properties.mag * 25000,
                        fillColor : color

                }).bindPopup("<h1>Place: " + response.features[i].properties.place + 
                "</h1> <hr> <h3>Time: " + new Date(response.features[i].properties.time) + "</h3><h3>Magnitude: " + response.features[i].properties.mag + " " + 
                response.features[i].properties.magType + "</h3> <h3>Depth: " + 
                response.features[i].geometry.coordinates[2] + " km</h3><h6>For more information go to: " + response.features[i].properties.url+ "</h6>")
                .addTo(myMap);
    }
            
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