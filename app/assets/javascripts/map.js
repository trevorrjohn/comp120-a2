function init() {
  var request;
  var map;
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


    // Try W3C Geolocation (Preferred)
    if(navigator.geolocation) {
      browserSupportFlag = true;
      navigator.geolocation.getCurrentPosition(function(position) {
        console.log("got location using W3C");
        initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        map.setCenter(initialLocation);
        marker(initialLocation, map);
        send_to_controller(position.coords.latitude, position.coords.longitude);

        }, function() {
        handleNoGeolocation(browserSupportFlag);
      });
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

      /* place map */
      map.setCenter(initialLocation);
      marker(initialLocation, map);
      // To add the marker to the map, call setMap();
      mark.setMap(map);
    }

    function marker(initialLocation, map) {
      mark = new google.maps.Marker({
        position: initialLocation,
        title:"Your location"
      });
    }

    function send_to_controller(lat, lng) {
      console.log("in send to controller");
      $.get("/maps/find_nearest_restaurants", { lat: lat, lng: lng }, function(data){
        var result = JSON.parse(data);
        console.log(result);
            });
    }
}
      /*
      request = new XMLHttpRequest();
      request.open("GET", "/maps/find_nearest_restaurants", true);
      request.onreadstatechange = function(){
        if(request.readystate == 4) {
          results = request.resoponsetext;
          console.log(JSON.parse(results));
        }
      }
    }
  }*/
