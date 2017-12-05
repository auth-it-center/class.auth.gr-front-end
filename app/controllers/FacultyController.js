(function() {
  var app = angular.module("rooms");

  var FacultyController = function($scope, $http, $compile, $routeParams, $location){
    $scope.updateView = false;
    $scope.teacher = {};
    $scope.loading = true;

    $http.get("https://ws-ext.it.auth.gr/calendar/getPeriods").then(
        function(response) {
            $scope.periods = response.data;
            $scope.periodInfo = response.data;
            $scope.filterOptions = getFilterOptions($scope.periods);
            $scope.filterOptions.unshift({value: [6, 'current'], text: 'Όλες οι περίοδοι'});
            // At first use default values
            $scope.selectedPeriod = $scope.filterOptions[0];
            $scope.period = $scope.selectedPeriod.value[0];
            $scope.year = $scope.selectedPeriod.value[1];
            $scope.currentPeriod = $scope.period;
            $scope.currentYear = $scope.year;
            checkUrl();
        }, function () {
          console.error('Could not fetch period data!');
      });

    $scope.periodChange = function periodChange() {
        console.log("period change");
        $scope.period = $scope.selectedPeriod.value[0];
        $scope.year = $scope.selectedPeriod.value[1];
        // Go to new url
        $location.url("faculty/" + $routeParams["apmId"] + "?period=" + $scope.period + "&year=" + $scope.year);
    }

    $scope.getDay = function(dayId) {
      switch (dayId) {
        case 1:
          return "Κυριακή";
          break;
        case 2:
          return "Δευτέρα";
          break;
        case 3:
          return "Τρίτη";
          break;
        case 4:
          return "Τετάρτη";
          break;
        case 5:
          return "Πέμπτη";
          break;
        case 6:
          return "Παρασκευή";
          break;
        case 7:
          return "Σάββατο";
          break;
        default:
          return "Ημέρα";
      }
    }

    $scope.getPeriodString = getPeriodString;

    function groupEventsByPeriod(events) {
      if (!events) {
        return [];
      }

      var periodEvents = {};
      for (var i = 0; i < events.length; i++) {
        var event = events[i];
        if (periodEvents[event[0].period]) {
          periodEvents[event[0].period].push(event);
        } else {
          periodEvents[event[0].period] = [event];
        }
      }
      return periodEvents;
    }

    function checkUrl() {
      $scope.loading = true;
      console.log("Check url");
      $scope.showError = false;

      if (Object.keys($routeParams).length !== 3) {
        if (!$routeParams.period) {
          $routeParams.period = $scope.currentPeriod;
        }
        if (!$routeParams.year) {
          $routeParams.year = $scope.currentYear;
        }
      }

      if (Object.keys($routeParams).length === 3) {

        if ($routeParams.period !== undefined && $routeParams.year !== undefined) {

          $scope.selectedPeriod = getPeriodFromParameters($scope.filterOptions, $routeParams.period);
          $scope.period = $scope.selectedPeriod.value[0];
          $scope.year = $scope.selectedPeriod.value[1];
        }

        var url = "https://ws-ext.it.auth.gr/calendar/getFacultyCourses/" + $routeParams["apmId"];
        if ($scope.period != 6) {
          url += "?period=" + $scope.period;
        }

        $http.get(url).then(function(events) {
          if ($scope.period == 6) {
            $scope.events = groupEventsByPeriod(events.data);
          } else {
            $scope.events = events.data;
          }
          if ($scope.events.length <= 0) {
            $scope.showError = true;
          }
          $scope.loading = false;
        }, function() {
          $scope.loading = false;
          $scope.showError = true;
          console.error("Error while getting event data!");
        });

        $http.get("https://ws-ext.it.auth.gr/open/getPersonInfo/" + $routeParams["apmId"]).then(function(response){
          var data = response.data;
          $scope.teacher.name = data.first + ' ' + data.last;
          $scope.teacher.title = data.labels.title;
          $scope.teacher.department = data.dept;
          $scope.teacher.deptCode = data.deptCode;
          // $scope.teacher.qa_page = '<a class="btn btn-primary" href="https://qa.auth.gr/el/cv/" + username + role="button">Σελίδα μέλους ΔΕΠ</a>';
        });

      }

    }

  };

  app.controller("FacultyController", ["$scope", "$http", "$compile", "$routeParams", "$location", FacultyController]);

}());
