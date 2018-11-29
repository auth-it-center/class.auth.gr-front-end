(function() {
  var app = angular.module("rooms");

  var CoursesListController = function ($http) {
    var ctrl = this;
    ctrl.loading = true;
    ctrl.searchText = '';
    ctrl.examIdToString = examIdToString;

    function flatArray(units) {
      var temp = [];
      units.forEach(function(unit) {
        var semesters = unit.semesters;
        semesters.forEach(function(semester) {
          var courses = semester.courses;
          courses.forEach(function(course) {
            course.unitName = unit.name;
            course.semesterId = semester.semesterId;
            temp.push(course);
          });
        });
      });
      return temp;
    }

    $http.get("/calendar/getCourses")
      .then(
        function(response) {
          ctrl.unitCourses = response.data;
          ctrl.courses = flatArray(response.data);
          ctrl.loading = false;
        },
        function (error) {
          console.error("Could not get courses information!");
          ctrl.loading = false;
        }
      );
  };

  app.controller("CoursesListController", ["$http", CoursesListController]);
}());
