var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"

// create features for our map
function createFeatures (earthquakesData) {

    // create popup for each data point that shows when the point is clicked
    // popup includes: title (including magnitude) and coordinates
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.title}</h3><hr><p>Latitude: ${feature.geometry.coordinates[1]}</p><p>Longtiude: ${feature.geometry.coordinates[0]}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    };

    // create circles indicating where each earthquake happened
    function pointToLayer (feature) {
        let options = {
            color: 'black',
            opacity: .7,
            fillOpacity: 0.9,
            weight: 1,

            // magnitude of the earthquake determines the radius
            radius: Math.sqrt(feature.properties.mag) * 4,
            // radius: feature.properties.mag * 10000,

            // depth of earthquake determines fill color
            fillColor: getColor(feature.geometry.coordinates[2]),
        }

        // create each circle
        return new L.CircleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], options);
        // return new L.Circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], options);

    };

    // create geoJSON layer "earthquakes"
    var earthquakes = L.geoJSON(earthquakesData, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
    });

    // call the function to create the map using the earthquakes layer
    createMap(earthquakes);
};

// create the map
function createMap(earthquakes) {

    // create the street base layer and baseMaps object
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var baseMaps = {
        "Street Map": street,
    };

    // create overlay object to hold earthquake layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // create map with layers "on" when first loaded
    var myMap = L.map("map", {
        center: [
        0, 0
        ],
        zoom: 2.5,
        layers: [street, earthquakes]
    });

    // create layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // create legend and add to map
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

// function that takes the depth coordinate and returns a color for the fill of the circle
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
    };
};

// fetch the data and then call our function
// to create the features then create the map
d3.json(url).then(function (data) {
    createFeatures(data.features)
});




