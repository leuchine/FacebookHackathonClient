var IMG_START = 'https://raw.githubusercontent.com/google/material-design-icons/a6145e167b4a3a65640dd6279319cbc77a7e4e96/av/2x_web/ic_play_arrow_black_36dp.png';
var IMG_STOP = 'https://raw.githubusercontent.com/google/material-design-icons/master/av/2x_web/ic_pause_black_36dp.png';

function getParameterByName(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function formatDate(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
}

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

var rectangles = new Array();
function showHeatMap(map) {
  for (var i = 0; i < 8; i++)
  {
    for (var j = 0; j < 8; j++)
    {
      var newRect = new google.maps.Rectangle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 0,
        fillColor: '#FF0000',
        fillOpacity: 0.4 - (i*71%131 + j*157%203)*0.002,
        map: map,
        bounds: {
          north: 1.3 - i*0.003,
          south: 1.3 - (i+1)*0.003,
          east: 103.860 - j*0.003,
          west: 103.860 - (j+1)*0.003
        }
      });

      rectangles.push(newRect);
    }
  }
}

function hideHeatMap() {
  for (var i = 0; i < rectangles.length; i++)
  {
    rectangles[i].setMap(null);
  }
}

function createInfoWindow(place, infoWindow, $scope) {
  var iwframe = document.createElement('div');
  iwframe.setAttribute('class', 'iwframe');

  var title = document.createElement('strong');
  title.setAttribute('class', 'place-title');
  title.innerHTML = place.name;
  iwframe.appendChild(title);

  var br = document.createElement('br');
  iwframe.appendChild(br);

  var desc = document.createElement('p');
  desc.setAttribute('class', 'place-desc');
  desc.innerHTML = place.description;
  iwframe.appendChild(desc);

  var date = document.createElement('em');
  date.setAttribute('class', 'place-date');
  date.innerHTML = formatDate(new Date(place.date));
  iwframe.appendChild(date);

  br = document.createElement('br')
  iwframe.appendChild(br);

  var info = document.createElement('em');
  info.setAttribute('class', 'place-info');
  info.innerHTML = place.duration + ' hours, ' + place.points + ' points';
  iwframe.appendChild(info);

  br = document.createElement('br')
  iwframe.appendChild(br);

  var address = document.createElement('span');
  var addressLabel = document.createElement('strong');
  addressLabel.innerHTML = 'Address: ';
  address.appendChild(addressLabel);
  var addressValue = document.createElement('span');
  addressValue.innerHTML = place.address + ', ' + place.postcode;
  address.appendChild(addressValue);
  iwframe.appendChild(address);

  br = document.createElement('br')
  iwframe.appendChild(br);

  var phone = document.createElement('span');
  var phoneLabel = document.createElement('strong');
  phoneLabel.innerHTML = 'Phone: ';
  phone.appendChild(phoneLabel);
  var phoneValue = document.createElement('span');
  phoneValue.innerHTML = place.phone;
  phone.appendChild(phoneValue);
  iwframe.appendChild(phone);

  br = document.createElement('br')
  iwframe.appendChild(br);

  var btn = document.createElement('button');
  btn.setAttribute('class', 'btn-work');
  btn.dataset.working = place.working;
  btn.innerHTML = place.working
              ? '<img src="' + IMG_STOP + '">'
              : '<img src="' + IMG_START + '">';
  iwframe.appendChild(btn);

  btn.addEventListener('click', function () {
    startWork(place.id, btn, $scope);
    if (btn.dataset.working == 0) {
      infoWindow.close();
    }
  });

  return iwframe;
}

var heatmap = false;

angular.module('starter.controllers')

.controller('MapCtrl', function($scope, $state, Tasks, Location) {

  var options = {timeout: 10000, enableHighAccuracy: true};

  /*
  var pos = {
    coords: {
      latitude: 1.2952625,
      longitude: 103.85657169999999
    }
  };
  */

  navigator.geolocation.getCurrentPosition(function (pos) {

    var lat = pos.coords.latitude;
    var lng = pos.coords.longitude;
    Location.set(lat, lng);

    console.log('position:', lat, lng);

    var latLng = new google.maps.LatLng(lat, lng);

    var mapOptions = {
      center: latLng,
      zoom: 18,
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

      var icons = {
        'Photo': 'https://dl.dropboxusercontent.com/u/9957216/fbhack/ic_venue.png',
        'Helper': 'https://dl.dropboxusercontent.com/u/9957216/fbhack/ic_venue_violet.png',
        'Craft': 'https://dl.dropboxusercontent.com/u/9957216/fbhack/ic_venue_teal.png',
        'Tech': 'https://dl.dropboxusercontent.com/u/9957216/fbhack/ic_venue_green.png'
      };

      Tasks.get(function (places) {
          places.forEach(function (place) {
            var latLng = new google.maps.LatLng(place.latitude, place.longitude);

            var icon = {
              url: icons[place.type],
              scaledSize: new google.maps.Size(36, 36)
            };
            var marker = new google.maps.Marker({
                map: $scope.map,
                position: latLng,
                icon: icon
            });

            var infoWindow = new google.maps.InfoWindow();
            var content = createInfoWindow(place, infoWindow, $scope);
            infoWindow.setContent(content);

            //infoWindow.setContent(infoWindow.getContent());

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open($scope.map, marker);

                if ($scope.lastInfoWindow) {
                  $scope.lastInfoWindow.close();
                }
                $scope.lastInfoWindow = infoWindow;
            });
          });
      });
    });


    var controlContainer = document.createElement('div');
    controlContainer.setAttribute('class', 'btn-container');


    var addBtn = document.createElement('div');
    addBtn.setAttribute('class', 'btn-control btn-add');
    addBtn.innerHTML = '&#xf218;';
    controlContainer.appendChild(addBtn);

    var arBtn = document.createElement('div');
    arBtn.setAttribute('class', 'btn-control btn-ar');
    arBtn.innerHTML = '&#xf24e;';
    controlContainer.appendChild(arBtn);

    var locateBtn = document.createElement('div');
    locateBtn.setAttribute('class', 'btn-control btn-locate');
    locateBtn.innerHTML = '&#xf2e9;';
    controlContainer.appendChild(locateBtn);

    google.maps.event.addDomListener(addBtn, 'click', function () {
      console.log('add');
      $state.go('add');
    });

    google.maps.event.addDomListener(locateBtn, 'click', function () {
      $scope.map.setCenter(latLng);
    });


    $scope.map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(controlContainer);

    var points = getParameterByName('points') || 3000;
    var pointsEl = document.createElement('div');
    pointsEl.setAttribute('class', 'points');
    pointsEl.innerHTML = points;
    $scope.map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(pointsEl);


    var heatmapBtn = document.createElement('div');
    heatmapBtn.setAttribute('class', 'btn-heatmap');
    controlContainer.appendChild(heatmapBtn);
    google.maps.event.addDomListener(heatmapBtn, 'click', function () {
      console.log('heatmap');
      if (heatmap) {
        heatmap = false;
        hideHeatMap();
      } else {
        heatmap = true;
        showHeatMap($scope.map);
      }
    });

    $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(heatmapBtn);

  }, function (err) {
    console.log('err', err);
  }, options);

});
