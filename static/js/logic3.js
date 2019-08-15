// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function getColor(d) {
    var color = "";
    if (d <= 0.5) {
        color = "white";
    }
    else if (d <= 1.0) {
        color = "#FFFF00"
    }
    else if (d <= 1.5) {
        color = "#FFCC00"
    }
    else if (d <= 2.0) {
        color = "#FF9900"
    }
    else if (d <= 2.5) {
        color = "#FF6600"
    }
    else if (d <= 3.0) {
        color = "#FF3300"
    }
    else if (d <= 3.5) {
        color = "#FF0000"
    }
    else {
        color = "#990000"
    }
    return color;
};

// // Perform a GET request to the query URL
// d3.json(queryUrl, function(data) {
//   // Once we get a response, send the data.features object to the createFeatures function
//   createFeatures(data.features);
// });

// function createFeatures(earthquakeData) {

//   // Define a function we want to run once for each feature in the features array
//   // Give each feature a popup describing the place and time of the earthquake
//   function onEachFeature(feature, layer) {
//     var layer = L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
//         color: getColor(feature.properties.mag),
//         fillOpacity: 1.0,
//         radius: feature.properties.mag * 25000,
//         fillColor: getColor(feature.properties.mag)

//     }).bindPopup("<h1>Place: " + feature.properties.place +
//     "</h1> <hr> <h3>Time: " + new Date(feature.properties.time) + "</h3><h3>Magnitude: " + feature.properties.mag + " " +
//     feature.properties.magType + "</h3> <h3>Depth: " +
//     feature.geometry.coordinates[2] + " km</h3>");
//   }

//   // Create a GeoJSON layer containing the features array on the earthquakeData object
//   // Run the onEachFeature function once for each piece of data in the array
//   var earthquakes = L.geoJSON(earthquakeData, {
//     onEachFeature: onEachFeature
//   });

  // Sending our earthquakes layer to the createMap function
//   createMap(earthquakes);
// }
d3.json(queryUrl, function (response) {

var quakeMarkers = [];

  for (var i = 0; i < response.features.length; i++) {

      quakeMarkers.push(L.circle([response.features[i].geometry.coordinates[1], response.features[i].geometry.coordinates[0]], {
          color: getColor(response.features[i].properties.mag),
          fillOpacity: 0.75,
          radius: response.features[i].properties.mag * 25000,
          fillColor: getColor(response.features[i].properties.mag)

      }).bindPopup("<h1>Place: " + response.features[i].properties.place +
          "</h1> <hr> <h3>Time: " + new Date(response.features[i].properties.time) + "</h3><h3>Magnitude: " + response.features[i].properties.mag + " " +
          response.features[i].properties.magType + "</h3> <h3>Depth: " +
          response.features[i].geometry.coordinates[2] + " km</h3>")
          .addTo(myMap));
  }


  // console.log(myCircle);
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function () {

    

      var div = L.DomUtil.create("div", "info legend");
      var grades = [0, .5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5];
      // labels = ['<strong> THE TITLE </strong>'];
    // adding label to the div
    div.innerHTML += ['<strong> Earthquake Scale</strong><br>']; 

      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background-color:' + getColor(grades[i + 1]) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }

      return div;

  };
  legend.addTo(myMap);
});

var link = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// d3.json(link, function(data){
//   L.geoJson(data).addTo(map);

// });

d3.json(link, function(data) {
  // Creating a GeoJSON layer with the retrieved data
L.geoJson(data, {
    style: function(feature) {
      return {
        stroke: true,
        color: "red",
        weight: 5
      };
    }
  }).addTo(myMap);
});


  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });
  // mapbox://styles/mapbox/outdoors-v11

  // mapbox.mapbox-incidents-v1

  // mapbox://styles/kph3802/cjzc0hh6g1qnd1cp7jw914vom

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Light Map": lightmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    // "Earthquakes": quakes,
    // "Fault Lines" : faultlines
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [streetmap]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
