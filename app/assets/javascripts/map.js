var initialLocation;
var browserSupportFlag =  new Boolean();
var gotLocation = new Boolean();
var lat = null;
var lng = null;
var image = new Image();
    image.src = "/assets/restaurant-71.png";
var map;
var restaurant_data = null;

function init() {
  gotLocation = false;
  initialize_map();
  fillmap();
}

function pause(){

}

function fillmap(){
    if(lat == null && lng == null){
      setTimeout(fillmap, 50);
    } else {
      your_marker();
      get_restaurant_data();
    for(var i = 0; i < restaurant_data.results.length; i++)
      {
        console.log(restaurant_data.results[i].geometry.lat +", "+ restaurant_data.results[i].geometry.lng);
      }
    }
  }


function get_restaurant_data(){
  $.get("/maps/find_nearest_restaurants", {lat: lat, lng: lng}, function(data){
    restaurant_data = data;
    console.log(restaurant_data.results.length);
  });
  wait();
  function wait(){
    if(restaurant_data == null){
      setTimeout(wait, 50);
    }
  }
}

function your_marker(){
  pos = new google.maps.LatLng(lat,lng);
  mark = new google.maps.Marker({
    position: pos,
    map: map,
    title: "Your location"
  });
  mark.setMap(map);
  console.log(mark);
}
function initialize_map() {
  var siberia = new google.maps.LatLng(60, 105);
  var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
  var myOptions = {
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

  // Try W3C Geolocation (Preferred)
  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      lat = position.coords.latitude;
      lng = position.coords.longitude;
      gotLocation = true;
      map.setCenter(initialLocation);
      console.log(lat + ", " + lng);
    }, function() {
      handleNoGeolocation(browserSupportFlag);
    });
    // Try Google Gears Geolocation
  } else if (google.gears) {
    browserSupportFlag = true;
    var geo = google.gears.factory.create('beta.geolocation');
    geo.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.latitude,position.longitude);
      lat = position.coords.latitude;
      lng = position.coords.longitude;
      map.setCenter(initialLocation);
    }, function() {
      handleNoGeoLocation(browserSupportFlag);
    });
    // Browser doesn't support Geolocation
  } else {
    browserSupportFlag = false;
    handleNoGeolocation(browserSupportFlag);
  }

  function handleNoGeolocation(errorFlag) {
    if (errorFlag == true) {
      alert("Geolocation service failed.");
      initialLocation = newyork;
    } else {
      alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
      initialLocation = siberia;
    }
    map.setCenter(initialLocation);
    //console.log(lat + ", " + lng);

  }
}
