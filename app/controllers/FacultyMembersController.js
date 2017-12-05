(function() {

var app = angular.module("rooms");

var FacultyMembersController = function($http) {
  var ctrl = this;

  ctrl.searchText = '';
  ctrl.loading = true;

  function flatData(units) {
    var temp = [];
    units.forEach(function(unit) {
      temp = temp.concat(unit.facultyMembers);
    });
    return temp;
  }

  $http.get("https://ws-ext.it.auth.gr/calendar/getFacultyMembers")
    .then(
      function(response) {
        response.data.forEach(function(unit) {
          unit.facultyMembers.forEach(function(faculty) {
            faculty.nameFull = faculty.firstname + ' ' + faculty.lastname;
            faculty.fullname = faculty.lastname + ' ' + faculty.firstname;
            faculty.unitName = unit.name;
          });
        });
        ctrl.unitFacultyMembers = response.data;
        ctrl.facultyMembers = flatData(response.data);
        ctrl.loading = false;
      },
      function(error) {
        ctrl.loading = false;
        console.error("Error while geting faculty members data!");
      }
    );
};

app.controller("FacultyMembersController", ["$http", FacultyMembersController]);

}());
