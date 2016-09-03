angular.module('starter.services', [])

.factory('Tasks', function ($http) {
  return {
    get: function (callback) {
      return $http.get('http://128.199.147.239/getTask.php').success(callback);
    }
  }
})

.factory('Treasures', function ($http) {
  return {
    insert: function (data, callback) {
      var params = $.param(data);
      var config = {
        'headers': {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
      return $http.post('http://128.199.147.239/addTreasure.php', params, config).success(callback);
    },

    get: function (callback) {
      return $http.get('http://128.199.147.239/getTreasure.php').success(callback);
    }
  }
})

.factory('Location', function () {
  var location = {
    lat: 0,
    lon: 0
  };
  return {
    set: function (lat, lon) {
      location.lat = lat;
      location.lon = lon;
    },
    get: function () {
      return location;
    }
  }
})

.factory('Points', function () {
  var points = 0;
  return {
    set: function (pts) {
      points = pts;
    },
    get: function () {
      return points;
    }
  }
});
