// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var quakes = new L.layerGroup();
var fault = new L.layerGroup();

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



var quakeMarkers = [];

d3.json(queryUrl, function (response) {



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
      .addTo(quakes)
    );
  }


  // console.log(myCircle);
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function () {



    var div = L.DomUtil.create("div", "info legend");
    var grades = [0, .5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5];
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

var faultlines = [];

d3.json(link, function (data) {
  // Creating a GeoJSON layer with the retrieved data
  faultlines = L.geoJson(data, {
    style: function (feature) {
      return {
        stroke: true,
        color: "red",
        weight: 5
      };
    }
  })
    .addTo(fault);
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

var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});


var outdoormap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY
});

var pencilmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.pencil",
  accessToken: API_KEY
});


// Define a baseMaps object to hold our base layers
var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap,
  "Light Map": lightmap,
  "Satellite Map": satellitemap,
  "Outdoors Map": outdoormap,
  "Pencil Map": pencilmap
};

// Create overlay object to hold our overlay layer
var overlayMaps = {
  "Earthquakes": quakes,
  "Fault Lines": fault
};

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 4,
  layers: [streetmap, quakes, fault]
});

// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);
