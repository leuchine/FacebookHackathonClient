angular.module('starter.controllers', [])

.controller('PowerUpCtrl', function($scope) {

  var options = {timeout: 10000, enableHighAccuracy: true};

  navigator.geolocation.getCurrentPosition(function (pos) {
    var lat = pos.coords.latitude;
    var lng = pos.coords.longitude;
    console.log('position:', lat, lng);

    var latLng = new google.maps.LatLng(lat, lng);

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    google.maps.event.addListenerOnce($scope.map, 'idle', function() {
      var icon = {
        url: '/img/ic_directions_walk_black_36dp_2x.png',
        scaledSize: new google.maps.Size(36, 36)
      };

      var marker = new google.maps.Marker({
          map: $scope.map,
          position: latLng,
          icon: icon
      });

      var infoWindow = new google.maps.InfoWindow({
          content: "Here I am!"
      });

      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);
      });

      // fetch places
      var places = [{
        'title': 'Test Place',
        'description': 'Lorem Ipsum',
        'lat': 1.2912674,
        'lng': 103.85644629999999
      }];

      places.forEach(function (place) {
        var latLng = new google.maps.LatLng(place.lat, place.lng);
        var icon = {
          url: '/img/ic_room_black_36dp_2x.png',
          scaledSize: new google.maps.Size(36, 36)
        };
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: latLng,
            icon: icon
        });
        var infoWindow = new google.maps.InfoWindow({
            content: '<b>' + place.title + '</b><br>' + place.description
        });

        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open($scope.map, marker);
        });
      });
    });


    var controlUI = document.createElement('div');
    controlUI.setAttribute('class', 'btn-locate');
    controlUI.innerHTML = '&#xf2e9;';

    google.maps.event.addDomListener(controlUI, 'click', function () {
        $scope.map.setCenter(latLng);
    });

    $scope.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlUI);

  }, function (err) {
    console.log('err', err);
  }, options);

})

.controller('HuntCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('ProfileCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
