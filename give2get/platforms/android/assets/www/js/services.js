angular.module('starter.services', [])

.factory('Tasks', function ($http) {
  return {
    get: function (callback) {
      return $http.get('http://128.199.147.239/getTask.php').success(callback);
    }
  }
});
