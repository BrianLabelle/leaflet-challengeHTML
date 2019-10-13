// C:\Rice\Class-MW-Rice-Cookers\17-Mapping-Web\1\Activities\10-Stu_Geo-Json\Solved


// Store our API endpoint inside queryUrl
//let queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
//  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
// picked Past 1 Days (Updated every minute. )
// Store our API endpoint inside queryUrl
let earthquakes_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
let earthquakes_url_hour = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";
let earthquakes_url_day = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
let earthquakes_url_7days = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let earthquakes_url_30days = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";


// URLS to get additional checkbox layers.
let faultlines_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";
let boundaries_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// PB2002_steps.json' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes
//let steps_url = "http://brianlabelle.com/geojson/PB2002_steps.json";
//let steps_url = "http://brianlabelle.com/geojson/PB2002_steps.geojson";
let orogens_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_orogens.json";


//let volcanos_url = "http://brianlabelle.com/geojson/harvard-glb-volc-geojson.geojson";
//let volcanos_url = "http://brianlabelle.com/geojson/volcanos.geojson";


	let faultlines_layer = new L.LayerGroup();
	let boundaries_layer = new L.LayerGroup();
	//let steps_layer = new L.LayerGroup();
	let orogens_layer = new L.LayerGroup();
	//let volcanos_layer = new L.LayerGroup();

	//let earthquakes_layer = new L.LayerGroup();
	let earthquakes_layer_hour = new L.LayerGroup();
	//let earthquakes_layer_day = new L.LayerGroup();
	let earthquakes_layer_7days = new L.LayerGroup();
	let earthquakes_layer_30days = new L.LayerGroup();



// Perform a GET request to the query URL
d3.json(earthquakes_url_day, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});


function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array


  // Function to create the circle radius based on the magnitude
  function earthquakeRadiusSize(magnitude) {
    return magnitude * 20000;
  }

  // Function to set the circle color based on the magnitude
  function earthquakePointColor(magnitude) {
    switch (true) {
    	case magnitude > 5: return "red";
		case magnitude > 4: return "orangered";
		case magnitude > 3: return "orange";
		case magnitude > 2: return "gold";
		case magnitude > 1: return "yellow";
		default:return "green";
    }
  }


	
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(earthquakeData, latlng) {
      return L.circle(latlng, {
        radius: earthquakeRadiusSize(earthquakeData.properties.mag),
        color: earthquakePointColor(earthquakeData.properties.mag),
        fillOpacity: 1
      });
    },
    onEachFeature: onEachFeature
  });

	
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  let satellite_layer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  let gray_layer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });
	
	let dark_layer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });
	
	
	let outdoor_layer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });
	
	let streets_layer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

	

	
  // Define a baseMaps object to hold our base layers
  let baseMaps = {
	"Satellite Map": satellite_layer,
    "Light Map": gray_layer,
    "Dark Map": dark_layer,
    "Outdoors Map": outdoor_layer,
	"Streets Map": streets_layer
  };
	


  // Create overlay object to hold our overlay layer
  let overlayMaps = {
	  FaultLines: faultlines_layer,
	  "Earthquakes Last Hour": earthquakes_layer_hour,
	  "Earthquakes Last Day": earthquakes,
	  "Earthquakes Last 7 days": earthquakes_layer_7days,
	  "Earthquakes Last 30 days": earthquakes_layer_30days,
	  Boundaries: boundaries_layer,
	  //Steps: steps_layer,
	  Orogens: orogens_layer
	  //volcanos: volcanos_layer
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  let myMap = L.map("map", {
    center: [
      29.925600, -95.193930
    ],
    zoom: 3,
    layers: [satellite_layer, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
	
	
	
	
// pull in a second data set and visualize it along side your original set of data. Data on tectonic plates can be found 
// https://github.com/fraxen/tectonicplates/tree/master/GeoJSON

d3.json(earthquakes_url_hour, function(data) {
	L.geoJSON(data, {style: function() {
		return {color: "orange", fillOpacity: 0
			   }
	}
}).addTo(earthquakes_layer_hour)})


d3.json(earthquakes_url_30days, function(data) {
	L.geoJSON(data, {
		style: function() {
			return {color: "orange", fillOpacity: 0
				   }
		}
}).addTo(earthquakes_layer_30days)})	
	

d3.json(faultlines_url, function(data) {L.geoJSON(data, {style: function() {return {color: "orange", fillOpacity: 0}}
}).addTo(faultlines_layer)})
	
	
d3.json(boundaries_url, function(data) {L.geoJSON(data, {style: function() {return {color: "blue", fillOpacity: 50}}
}).addTo(boundaries_layer)})
	
	
//d3.json(steps_url, function(data) {L.geoJSON(data, {style: function() {return {color: "orange", fillOpacity: 0}}
//}).addTo(steps_layer)})
	
	
d3.json(orogens_url, function(data) {L.geoJSON(data, {style: function() {return {color: "red", fillOpacity: 0}}
}).addTo(orogens_layer)})

	
//d3.json(volcanos_url, function(data) {L.geoJSON(data, {style: function() {return {color: "red", fillOpacity: 0}}
//}).addTo(volcanos_layer)})


	
	
}