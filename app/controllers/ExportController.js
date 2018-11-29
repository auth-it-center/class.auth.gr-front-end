(function(){

    var app = angular.module("rooms");

    var ExportController = function($scope, $window) {
      $scope.downloadUrl = "/calendar/export?";
      $scope.exportOptions = [
        {name: "iCalendar", id: 0},
        {name: "CSV", id: 1},
        {name: "HTML", id: 2},
        {name: "PDF", id: 3}
      ];

      $scope.exportMyCalendar = function exportMyCalendar(type) {
        var downloadUrl = "/personal/myExport?";
        switch(type) {
            case 0:
                downloadUrl += "format=ical";
                break;
            case 1:
                downloadUrl += "format=csv";
                break;
            case 2:
                downloadUrl += "format=html";
                break;
            case 3:
                downloadUrl += "format=pdf";
                break;
        }
        downloadUrl +="&period=" + $scope.period;
        $window.open(downloadUrl, "_blank");
      }

      function download(downloadUrl, type) {
        switch(type) {
            case 0:
                downloadUrl += "format=ical";
                break;
            case 1:
                downloadUrl += "format=csv";
                break;
            case 2:
                downloadUrl += "format=html";
                break;
            case 3:
                downloadUrl += "format=pdf";
                break;
        }
        if ($scope.selectedUnit && $scope.selectedPeriod) { // parameters from ReservationsController
             downloadUrl +="&unitId=" + $scope.selectedUnit + "&period=" + $scope.selectedPeriod;
        }
        else {
             downloadUrl +="&unitId=" + $scope.unit.id + "&period=" + $scope.period;
        }
       
        $window.open(downloadUrl, "_blank");
      }

      $scope.exportCalendar = function (type) {
          return download($scope.downloadUrl, type)
      }

      $scope.exportCalendarList = function (type) {
        if (type === 1) {
            return download('/admin/export?', type)
        } else {
          return download($scope.downloadUrl, type)
        }
      }
      
      
	  $scope.exportRooms = function download(){
	  	  var downloadUrl = "/calendar/roomExport?";
          downloadUrl +="unitId=" + $scope.selectedUnit;
          $window.open(downloadUrl, "_blank");
      }
      
  	  $scope.exportUnitCourses = function download(){
	  	  var downloadUrl = "/calendar/unitCoursesExport?";
          downloadUrl +="unitId=" + $scope.selectedUnit;
     	  downloadUrl +="&year=" + $scope.selectedYear;
      	  downloadUrl +="&period=" + $scope.selectedPeriod;
          $window.open(downloadUrl, "_blank");
      }
      
      
    }

    app.controller("ExportController", ["$scope", "$window", ExportController]);

}());
