var IMG_START = 'https://raw.githubusercontent.com/google/material-design-icons/a6145e167b4a3a65640dd6279319cbc77a7e4e96/av/2x_web/ic_play_arrow_black_36dp.png';
var IMG_STOP = 'https://raw.githubusercontent.com/google/material-design-icons/a6145e167b4a3a65640dd6279319cbc77a7e4e96/av/2x_web/ic_stop_black_36dp.png';

function startWork(id, btn) {
  var src;
  if (btn.dataset.working == 1) {
    console.log('stopping work ' + id);
    btn.dataset.working = 0;
    src = IMG_START;
  } else {
    console.log('starting work ' + id);
    btn.dataset.working = 1;
    src = IMG_STOP;
  }
  btn.innerHTML = '<img src="' + src + '">';
}

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
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      streetViewControl: false,
      mapTypeControl: false,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP
      }
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    google.maps.event.addListenerOnce($scope.map, 'idle', function() {
      var icon = {
        url: 'https://dl.dropboxusercontent.com/u/9957216/fbhack/ic_position.png',
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
        'id': 1,
        'title': 'Test Place',
        'description': 'Lorem Ipsum',
        'lat': 1.2912674,
        'lng': 103.85644629999999,
        'working': 1
      }];

      places.forEach(function (place) {
        var latLng = new google.maps.LatLng(place.lat, place.lng);
        var icon = {
          url: 'https://dl.dropboxusercontent.com/u/9957216/fbhack/ic_venue.png',
          scaledSize: new google.maps.Size(36, 36)
        };
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: latLng,
            icon: icon
        });

        var title = place.working
          ? '<img src="' + IMG_STOP + '">'
          : '<img src="' + IMG_START + '">';
        var infoWindow = new google.maps.InfoWindow({
            content: '<b>' + place.title + '</b><br>'
              + place.description + '<br>'
              + '<button onClick="startWork(' + place.id + ', this)" class="btn-work" data-working="' + place.working + '">' + title + '</button>'
        });

        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open($scope.map, marker);
        });
      });
    });


    var controlContainer = document.createElement('div');
    controlContainer.setAttribute('class', 'btn-container');

    var locateBtn = document.createElement('div');
    locateBtn.setAttribute('class', 'btn-control btn-locate');
    locateBtn.innerHTML = '&#xf2e9;';
    controlContainer.appendChild(locateBtn);

    var arBtn = document.createElement('div');
    arBtn.setAttribute('class', 'btn-control btn-ar');
    arBtn.innerHTML = '&#xf24e;';
    controlContainer.appendChild(arBtn);

    var addBtn = document.createElement('div');
    addBtn.setAttribute('class', 'btn-control btn-add');
    addBtn.innerHTML = '&#xf218;';
    controlContainer.appendChild(addBtn);


    google.maps.event.addDomListener(locateBtn, 'click', function () {
        $scope.map.setCenter(latLng);
    });

    $scope.map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(controlContainer);

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
  $scope.preferences = {
    'reward': {
      'books': true,
      'vouchers': false
    },
    'volunteering': {
      'plant_trees': true,
      'teaching': false,
      'tech_support': true,
      'photography': true
    }
  };
  $scope.all = {
    'reward': false,
    'volunteering': false
  };
  $scope.checkAll = function (section) {
    for (var key in $scope.preferences[section]) {
      if ($scope.preferences[section].hasOwnProperty(key)) {
        $scope.preferences[section][key] = $scope.all[section];
      }
    }
  }
});
