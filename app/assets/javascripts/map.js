function init() {
  var request;
  var src = "http://maps.googleapis.com/maps/api/js?sensor=true";
  var map;
  var image = new Image();
  image.src = "restaurant-71.png"
  var data;
  var initialLocation;
  var siberia = new google.maps.LatLng(60, 105);
  var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
  var browserSupportFlag =  new Boolean();
  var mark;
  var lat;
  var lng;

    var myOptions = {
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);


    // Try W3C Geolocation (Preferred)
    if(navigator.geolocation) {
      browserSupportFlag = true;
      navigator.geolocation.getCurrentPosition(function(position) {
        console.log("got location using W3C");
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        map.setCenter(initialLocation);
        marker(initialLocation, map);

        }, function() {
        handleNoGeolocation(browserSupportFlag);
      });
    } else {
    browserSupportFlag = false;
    handleNoGeolocation(browserSupportFlag);
    }

      /* place map */
      map.setCenter(initialLocation);
      marker(initialLocation, map);
      // To add the marker to the map, call setMap();
      mark.setMap(map);

      if(browserSupportFlag == true) {
        console.log("support flag == true");
        send_to_controller(lat, lng);
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
      console.log("in send to controller");
      $.get("/maps/find_nearest_restaurants", { lat: lat, lng: lng }, function(data){
        place_on_map(data);
      });
    }

    function place_on_map(data) {
      var pos;
       for(var i = 0; i < data.results.length; i++)
        {
          console.log(data.results[i].name);
          pos = new google.maps.LatLng(data.results[i].geometry.location.lat, data.results[i].geometry.lng);
         restMark = new google.maps.Marker ({
           position: pos,
           icon: image,
           map: map,
           title: data.results[i].name
         });
         console.log(restMark);
         restMark.setMap(map);

        }
    }





}
