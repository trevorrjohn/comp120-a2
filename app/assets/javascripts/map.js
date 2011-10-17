function init() {
  var request;
      src = "http://maps.googleapis.com/maps/api/js?sensor=true";
  var map;
  var image = new Image();
      image.src = "/assets/images/restaurant-71.png"
  var data;
  var initialLocation;
  var siberia = new google.maps.LatLng(60, 105);
  var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
  var browserSupportFlag =  new Boolean();
  var mark;

  var myOptions = {
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);


  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
    initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
    console.log("Line 30: initial location " + position.coords.latitude + ", " + position.console.longitude);
    map.setCenter(position.coords.latitude, position.coords.longitude);
    console.log(map);
    marker(initialLocation, map);

    });
  }
   else {
  browserSupportFlag = false;
  handleNoGeolocation(browserSupportFlag);
  }
  /* place map */
  map.setCenter(initialLocation);
  marker(initialLocation, map);
  // To add the marker to the map, call setMap();
  mark.setMap(map);

  if(browserSupportFlag == true) {
  //  console.log("Line49: browser support flag = t" + initialLocation.latitude + ", " + initialLocation.longitude);
    send_to_controller(position.coords.latitude, position.coords.longitude);
  }

  function handleNoGeolocation(errorFlag) {
    if (errorFlag == true) {
      alert("Geolocation service failed.");
      initialLocation = newyork;
    } else {
      alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
      initialLocation = siberia;
    }
  }

  function marker(initialLocation, map) {
    mark = new google.maps.Marker({
      position: initialLocation,
      map: map,
      icon: image,
      title:"Your location"
    });
  }

  function send_to_controller(lat, lng) {
    console.log("Line 73: in send to controller" + lat + ", " + lng);
    $.get("/maps/find_nearest_restaurants", { lat: lat, lng: lng }, function(data){
      console.log("Line 75: Data returned: " + data);
      place_on_map(data);
    });
  }

  function place_on_map(data) {
    console.log("Line 81: in place on map:" +   data);
    var pos;
    for(var i = 0; i < data.results.length; i++) {
      console.log(data.results[i].name);
      pos = new google.maps.LatLng(data.results[i].geometry.location.lat, data.results[i].geometry.lng);
     restMark = new google.maps.Marker ({
       position: pos,
       icon: image,
       map: map,
       title: data.results[i].name
     });
     restMark.setMap(map);

    }
  }
}
