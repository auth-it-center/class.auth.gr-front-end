(function() {
  var app = angular.module("rooms");

  var CourseController = function($scope, $http, $compile, $routeParams, $location){
    $scope.semesters = []; // List of semesters for current unit. Also depends on period being winter or spring
    $scope.eventSources = []; // Array of event sources. Will contain just the json feed object
    $scope.nEvents = 0; // Number of events for current unit and period
    $scope.resources = [];
    $scope.updateView = false;
    $scope.loading = true;

    $http.get("https://ws-ext.it.auth.gr/open/getCourseInfo/" + $routeParams["courseId"]).then(function(courseData){
      courseData = courseData.data.course;
      var classId = courseData.classID;

      $scope.course = {
        "title": courseData.title,
        "code": courseData.coursecode,
        "qa_page": '<a class="btn btn-primary" href="https://qa.auth.gr/el/class/1/' + classId + '" role="button">e-Οδηγός Σπουδών</a>'
      }

      if (courseData.elearning_url) {
        $scope.course.elearning = '<a class="btn btn-elearning" href="' + courseData.elearning_url + '" role="button">e-learning</a>';
      }

      $http.get("https://ws-ext.it.auth.gr/open/getClassInfo/" + classId).then(function(classData){
        var teachers = classData.data.class.qa_data.general_data.class_info.instructors;
        classData = classData.data.class.qa_data.course_information_form_data;
        if (classData.course_content_syllabus) {
          $scope.course.description = classData.course_content_syllabus.course_content.el;
        }

        // If the teachers names are not set from the event data we fallback to the qa_data
        if (!$scope.course.teachers) {
          $scope.course.teachers = teachers;
        }

      }, function(error) {
        console.error("Error while getting course information");
      });
    }, function(error) {
      console.error("Error while getting course classes information");
    });

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
        $location.url("course/" + $routeParams["courseId"] + "?period=" + $scope.period + "&year=" + $scope.year);
    }

    $scope.examIdToString = examIdToString;

    $scope.getPeriodString = getPeriodString;

    function getDay(dayId) {
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

    function eventsToWeekSchedule(events) {
      var daysOfWeek = {1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: []};
      var eventsTmp = [];
      for (var i = 0; i < events.length; i++) {
        var event = events[i];
        if (! daysOfWeek[event.dayId].find((currentEvent) => {return currentEvent.id == event.id}, event)) {
          event.day = getDay(event.dayId);
          daysOfWeek[event.dayId].push(event);
          eventsTmp.push(event);
        }
      }
      $scope.event = eventsTmp[0];
      return eventsTmp;
    }

    function groupEventsByPeriod(events) {
      if (!events) {
        return [];
      }

      var periodEvents = {};

      for (var i = 0; i < events.length; i++) {
        var event = events[i];
        if (periodEvents[event.period]) {
          periodEvents[event.period].push(event);
        } else {
          periodEvents[event.period] = [event];
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

        var url = "https://ws-ext.it.auth.gr/calendar/getCourseEvents/" + $routeParams["courseId"] +"/weekly";
        if ($scope.period != 6) {
          url += "?period=" + $scope.period;
        }

        $http.get(url).then(function(events) {
          if ($scope.period == 6) {
            $scope.events = groupEventsByPeriod(events.data);
          } else {
            $scope.events = events.data;
            if ($scope.period <= 2) {
              $scope.events = eventsToWeekSchedule($scope.events);
            }
          }
          if ($scope.events.length > 0) {
            $scope.course.title = $scope.events[0].courseData.courseTitle;
            $scope.course.code = $scope.events[0].courseData.courseCode;
            $scope.course.semester = $scope.events[0].courseData.examID;
            // we prioritize the names of the teachers that come from the event data
            if ($scope.events[0].courseData.instructors) {
              $scope.course.teachers = getTeacherLinks($scope.events[0].staffData, $scope.period);
            }
          }
          $scope.loading = false;
        }, function() {
          $scope.showError = true;
          console.error("Error while getting event data!");
        });

      }

    }

  };

  app.controller("CourseController", ["$scope", "$http", "$compile", "$routeParams", "$location", CourseController]);

}());
