//  API endpoint to a variable queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function (response) {

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

    for (var i = 0; i < response.features.length; i++) {

        var myCircle = L.circle([response.features[i].geometry.coordinates[1], response.features[i].geometry.coordinates[0]], {
            color: getColor(response.features[i].properties.mag),
            fillOpacity: 1.0,
            radius: response.features[i].properties.mag * 25000,
            fillColor: getColor(response.features[i].properties.mag)

        }).bindPopup("<h1>Place: " + response.features[i].properties.place +
            "</h1> <hr> <h3>Time: " + new Date(response.features[i].properties.time) + "</h3><h3>Magnitude: " + response.features[i].properties.mag + " " +
            response.features[i].properties.magType + "</h3> <h3>Depth: " +
            response.features[i].geometry.coordinates[2] + " km</h3>")
            .addTo(myMap);
    }
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {

        var div = L.DomUtil.create("div", "info legend"),
            grades = [0, .5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5]
        labels = ['<strong> THE TITLE </strong>'];

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background-color:' + getColor(grades[i + 1]) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;

    };
    legend.addTo(myMap);
});

// Creating the initial map object
var myMap = L.map('map', {
    center: [36.778259, -119.417931],
    zoom: 4
});

//  Adding a tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(myMap);