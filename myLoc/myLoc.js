window.onload = getMyLocation; 

function getMyLocation() {
    //navigation.geolocation = built-in js functions
    if (navigator.geolocation) { //Test if browser supports geolocation
        //Add tracking with button click handlers
        var watchButton = document.getElementById("watch");
        watchButton.onclick = watchLocation;

        var clearWatchButton = document.getElementById("clearWatch");
        clearWatchButton.onclick = clearWatch;
    } else {
        alert ("Opps, no geolocation support");
    }
}

/*****************************************************************************************/
//----- function to watch users location -----//

var watchId = null; 

function watchLocation() {
    //Built-in methods
    watchId = navigator.geolocation.watchPosition (displayLocation, displayError);
}

/*****************************************************************************************/
//----- clearWatch handler -----//

function clearMyWatch() {
    if (watchId) {
        //Built-in methods
        navigator.geolocation.clearWatch (watchId);
        watchId = null;
    }
}

/*****************************************************************************************/
//----- Our own handlers/functions for getCurrentPosition -----//

function displayLocation (position) {
    var latitude = position.coords.latitude; //position object with coords property
    var longitude = position.coords.longitude;

    var div = document.getElementById ("location");
    div.innerHTML = "You are at Latitude: " + latitude + ", Longitude: " + longitude;
    //display accuracy information
    div.innerHTML += " (with " + position.coords.accuracy + " meters accuracy)";

    //call showMap function
    if (map == null) {
        showMap (position.coords);
    } else {
        scrollMapToPosition (position.coords);
    }
}

/*****************************************************************************************/
//----- Keeping the map centered on your location -----//

function scrollMapToPosition (coords) {
    var latitude = coords.latitude;
    var longitude = coords.longitude;
    var latlong = new google.maps.LatLng (latitude, longitude);

    map.panTo (latlong);

    addMarker (map, latlong, "Your new location", "You moved to: " + 
                latitude + ", " + longitude);
}

/*****************************************************************************************/
//----- Create/Display google map -----//

var map;

function showMap (coords) {
    //googles constructor
    var googleLatAndLong = new google.maps.LatLng(coords.latitude, coords.longitude);

    var mapOptions = {
        zoom : 10,
        center : googleLatAndLong,
        mapTypeId : google.maps.mapTypeId 
    };

    var mapDiv = document.getElementById("map");
    //googles constructor
    map = new google.maps.Map (mapDiv, mapOptions);

    //from addMarker function
    var title = "Your Location";
    var content = "You are here: " + coords.latitude + ", " + coords.longitude;
    addMarker(map, googleLatAndLong, title, content);
}

/*****************************************************************************************/
//----- Creating a marker on google maps (red pin) -----//

function addMarker (map, latlong, title, content) {
    var markerOptions = {
        position : latlong,
        map : map,
        title : title,
        clickable : true
    };

    //googles constructor
    var marker = new google.maps.Marker (markerOptions);

    var infoWindowOptions = {
        content: content,
        position: latlong
        };

        var infoWindow = new google.maps.InfoWindow(infoWindowOptions);

        google.maps.event.addListener(marker, "click", function() {
        infoWindow.open(map);
        });
} 

/*****************************************************************************************/
//----- Error Handling -----//

function displayError (error) {
    var errorTypes = { //create objects
        0 : "Unknown error",
        1 : "Permission denied by user",
        2 : "Position is not available",
        3 : "Request timed out"
    };

    var errorMessage = errorTypes[error.code]; 

    if (error.code == 0 || error.code == 2) {
        errorMessage = errorMessage + " " + error.message;
    }

    var div = document.getElementById("location");
    div.innerHTML = errorMessage;
}