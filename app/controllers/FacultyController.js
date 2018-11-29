(function () {
  var app = angular.module("rooms");

  var FacultyController = function ($scope, $http, $compile, $routeParams, $location) {
    $scope.updateView = false;
    $scope.teacher = {};
    $scope.loading = true;
    $scope.events = [];
    $scope.courses;
    $scope.currentNumericYear;

    $http.get("/calendar/getPeriods").then(
      function (response) {
        $scope.periods = response.data;
        $scope.periodInfo = response.data;
        $scope.filterOptions = getFilterOptions($scope.periods);
        $scope.filterOptions.unshift({
          value: [6, 'current'],
          text: 'Όλες οι περίοδοι'
        });
        // At first use default values
        $scope.selectedPeriod = $scope.filterOptions[0];
        $scope.period = $scope.selectedPeriod.value[0];
        $scope.year = $scope.selectedPeriod.value[1];
        $scope.currentPeriod = $scope.period;
        $scope.currentYear = $scope.year;
        $scope.currentNumericYear = $scope.periods[0].year;
        getAllFacultyCourses($scope.period);
      },
      function () {
        console.error('Could not fetch period data!');
      });


    $scope.periodChange = function periodChange() {
      $scope.period = $scope.selectedPeriod.value[0];
      $scope.year = $scope.selectedPeriod.value[1];
      // Go to new url
      $location.url("faculty/" + $routeParams["apmId"] + "?period=" + $scope.period + "&year=" + $scope.year);
      //getAllFacultyCourses($scope.period);
    }

    $scope.getDay = function (dayId) {
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

      if (!events && !$scope.courses) {
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

      // continue with courses
      for (var key in $scope.courses) {
        var course = $scope.courses[key];

        if (periodEvents[course.classperiod]) {
          periodEvents[course.classperiod].push([course]);
        } else {
          periodEvents[course.classperiod] = [
            [course]
          ];
        }
      }

      return periodEvents;
    }


    function checkUrl() {
      $scope.loading = true;
      $scope.showError = false;

      let routeParamsLength = Object.keys($routeParams).length;
      if (routeParamsLength !== 3) {
        if (!$routeParams.period) {
          $routeParams.period = $scope.currentPeriod;
        }
        if (!$routeParams.year) {
          $routeParams.year = $scope.currentYear;
        }
      }
      routeParamsLength = Object.keys($routeParams).length
      if (routeParamsLength === 3) {

        if ($routeParams.period !== undefined && $routeParams.year !== undefined) {

          $scope.selectedPeriod = getPeriodFromParameters($scope.filterOptions, $routeParams.period);
          $scope.period = $scope.selectedPeriod.value[0];
          $scope.year = $scope.selectedPeriod.value[1];
        }

        var url = "/calendar/getFacultyCourses/" + $routeParams["apmId"];
        if ($scope.period != 6) {
          url += "?period=" + $scope.period;
        }

        $http.get(url).then(function (events) {
          $scope.events = events.data;
          if ($scope.period == 6) {
            $scope.events = groupEventsByPeriod(events.data);
          } else {
            $scope.events = events.data;
            //
            if ($scope.period <= 2) {
              var newObj = {};
              for (var key in $scope.courses) {
                let courseid = $scope.courses[key].courseid
                if ($scope.events[courseid]) { //if exists - ignore - don't merege
                  newObj[courseid] = $scope.events[courseid];
                } else {
                  newObj[courseid] = [$scope.courses[key]];
                }
              }
              if (Object.keys(newObj).length != 0) {
                $scope.events = newObj;
              }
            }
          }
          //
          if ($scope.events.length <= 0) {
            $scope.showError = true;
          }

          $scope.loading = false;

        }, function () {
          $scope.loading = false;
          $scope.showError = true;
          console.error("Error while getting event data!");
        });



        $http.get("https://ws-ext.it.auth.gr/open/getPersonInfo/" + $routeParams["apmId"]).then(function (response) {
          var data = response.data;
          $scope.teacher.name = data.first + ' ' + data.last;
          $scope.teacher.title = data.labels.title;
          $scope.teacher.department = data.dept;
          $scope.teacher.deptCode = data.deptCode;
          // $scope.teacher.qa_page = '<a class="btn btn-primary" href="https://qa.auth.gr/el/cv/" + username + role="button">Σελίδα μέλους ΔΕΠ</a>';
        }, (error) => {
          $scope.loading = false;
        });

      }
    }

    ///////
    function getAllFacultyCourses(period) {
      var urlAll = "/calendar/getAllFacultyCourses/" + $routeParams["apmId"] + "/" + $scope.currentNumericYear + "/" + period;
      // console.log(urlAll);
      $http.get(urlAll).then(function (courses) {
        $scope.courses = courses.data;
        checkUrl();
      }, function () {
        $scope.loading = false;
        $scope.showError = true;
        console.error("Error while getting course data!");
      });
    }
    ///////

  };

  app.controller("FacultyController", ["$scope", "$http", "$compile", "$routeParams", "$location", FacultyController]);

}());