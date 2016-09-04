angular.module('starter.controllers')

.controller('AddTreasureCtrl', function($scope, $ionicHistory, $state, Treasures, Location) {
	$scope.treasure = {};
	$scope.submitForm = function () {
		var location = Location.get();
		var data = {
			'name': $scope.treasure.name,
			'desp': $scope.treasure.desc,
			'long': location.lon,
			'latt': location.lat,
			'points': $scope.treasure.pts,
			'owner': 'Adam',
			'type': $scope.treasure.choice
		};
		console.log(data);
		Treasures.insert(data, function () {
			// prevent adding to backstack
			$ionicHistory.nextViewOptions({
				disableBack: true
			});

			$state.go('tab.map');
		});
	}
});
