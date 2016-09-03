angular.module('starter.controllers')

.controller('ProfileCtrl', function($scope) {
  $scope.preferences = {
    'reward': {
      'books': true,
      'vouchers': false
    },
    'volunteering': {
      'plant_trees': false,
      'helper': true,
      'teaching': true,
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
