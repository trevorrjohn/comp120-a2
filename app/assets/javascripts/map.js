var initialLocation;
var browserSupportFlag =  new Boolean();
var gotLocation = new Boolean();
var lat = null;
var lng = null;
var img = "/assets/restaurant-71.png";
var map;
var restaurant_data = null;
var marks = new Array();
var infoWindow;

function init() {
  gotLocation = false;
  initialize_map();
}


function fillmap(){
  your_marker();
  get_restaurant_data();
}

function setMark(latitude, longitude, name, index, ref){
  pos = new google.maps.LatLng(latitude, longitude);
  marks[index]= new google.maps.Marker({
    position: pos,
    map: map,
    icon: img,
    title: name
  });
  google.maps.event.addListener(marks[index], 'click', function(){
    $.get("/maps/get_restaurant_details", {ref: ref}, function(data){
      console.log(data.result.name);
      var content = '<h1>' + data.result.name + '</h1>' +
                    '<p>' + data.result.formatted_address +
                    '</br>' + data.result.formatted_phone_number + '</br>' +
                    "Rating: " + data.result.rating + '</p>';
      infoWindow = new google.maps.InfoWindow( {
        content: content
      });
      infoWindow.open(map, marks[index]);




    });
  });
}

function get_restaurant_data(){
  $.get("/maps/find_nearest_restaurants", {lat: lat, lng: lng}, function(data){
      restaurant_data = data;
      console.log(data);
      for(var index = 0; index < restaurant_data.results.length; index++) {
          setMark(restaurant_data.results[index].geometry.location.lat,
          restaurant_data.results[index].geometry.location.lng,
          restaurant_data.results[index].name, index,
          restaurant_data.results[index].reference);
      }

      google.maps.event.addListener(mark, 'click', function() {
        map.setCenter(pos);
      });

  });
}

function your_marker(){
  pos = new google.maps.LatLng(lat,lng);
  mark = new google.maps.Marker({
    position: pos,
    map: map,
    title: "Your location"
  });
}

function initialize_map() {
  var siberia = new google.maps.LatLng(60, 105);
  var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
  var myOptions = {
    zoom: 14,
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
      fillmap();
    }, function() {
      handleNoGeolocation(browserSupportFlag);
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
