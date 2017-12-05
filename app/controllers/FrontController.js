(function(){

    var app = angular.module("rooms");

    var FrontController = function($scope, $http, $window) {
      $scope.loading = true;

      if ($window.innerWidth / $window.innerHeight < 0.75 || $window.innerWidth < 600) {
        $scope.mobile = true;
      }

      $http.get("https://ws-ext.it.auth.gr/calendar/getPeriods").then(
        function(response){
          $scope.periods = response.data;
          $scope.filterOptions = getFilterOptions($scope.periods);
          $scope.selected = $scope.filterOptions[getCurrentPeriodIndex($scope.periods)];
          $scope.period = $scope.selected.value[0];
          $scope.year = $scope.selected.value[1];
          $scope.update();
        },
        function() {
          console.error("Could not fetch period data!");
        });

        $scope.update = function updateUnitList(selected){
            $scope.period = $scope.selected.value[0];
            $scope.year = $scope.selected.value[1];

            var unitsUrl = "https://ws-ext.it.auth.gr/calendar/getCalendarUnits/tree?period=" + $scope.period;
            $scope.loading = true;
            $http.get(unitsUrl).then(onUnitSuccess, onUnitError);
        }

        function onUnitSuccess(response){
            $scope.units = response.data;
            $scope.loading = false;
        }

        function onUnitError(){
            console.error('Could not fetch unit data');
            $scope.loading = false;
        }

    }

    app.controller("FrontController", ["$scope", "$http", "$window", FrontController]);

}());
