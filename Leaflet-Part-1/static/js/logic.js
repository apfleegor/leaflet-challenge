var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"

function createFeatures (earthquakesData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.title}</h3><hr><p>Depth: ${feature.geometry.coordinates[2]}</p><p>${new Date(feature.properties.time)}</p>`);
    };

    var earthquakes = L.geoJSON(earthquakesData, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
    });

    function pointToLayer (feature) {
        let options = {
            radius: Math.sqrt(feature.properties.mag) * 4,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: 'black',
            opacity: .7,
            fillOpacity: 0.9,
            weight: 1
        }
        return new L.CircleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], options);
    };

    createMap(earthquakes);
};

function createMap(earthquakes) {
    // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      0, 0
    ],
    zoom: 2.5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: "bottomright"});
  legend.onAdd = function (myMap) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += '<span>-10 - 10</span><i style="background: #A0F65E"></i><br>';
    div.innerHTML += '<span>10 - 30</span><i style="background: #DAF55D"></i><br>';
    div.innerHTML += '<span>30 - 50</span><i style="background: #F6DC52"></i><br>';
    div.innerHTML += '<span>50 - 70</span><i style="background: #FCB742"></i><br>';
    div.innerHTML += '<span>70 - 90</span><i style="background: #FCA35D"></i><br>';
    div.innerHTML += '<span>90+</span><i style="background: #FF5F65"></i><br>';
    return div;
  };

  legend.addTo(myMap);

};

function getColor(depth) {
    if (depth < 10) {
        return '#A0F65E'
    }
    else if (depth < 30) {
        return '#DAF55D'
    }
    else if (depth < 50) {
        return '#F6DC52'
    }
    else if (depth < 70) {
        return '#FCB742'
    }
    else if (depth < 90) {
        return '#FCA35D'
    } else {
        return '#FF5F65'
    }
}



d3.json(url).then(function (data) {
    createFeatures(data.features)
});




