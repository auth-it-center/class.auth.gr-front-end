(function(){
	var app = angular.module("rooms");
	function HeaderController($scope, $location) 
	{ 
		$scope.isActive = function (viewLocation) { 
			return viewLocation === $location.path();
		};
	}

	app.controller("HeaderController", ["$scope", "$location", HeaderController]);

}());