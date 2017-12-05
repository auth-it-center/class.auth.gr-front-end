(function(){

    var app = angular.module("rooms");

    var ExportController = function($scope, $window) {
      $scope.downloadUrl = "/backend/export.php?";
      $scope.exportOptions = [
        {name: "iCalendar", id: 0},
        {name: "CSV", id: 1},
        {name: "HTML", id: 2},
        {name: "PDF", id: 3}
      ];

      $scope.exportMyCalendar = function exportMyCalendar(type) {
        var downloadUrl = "/backend/myExport.php?";
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

      $scope.exportCalendar = function download(type){
          var downloadUrl = $scope.downloadUrl;
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
          downloadUrl +="&unitId=" + $scope.unit.id + "&period=" + $scope.period;
          $window.open(downloadUrl, "_blank");
      }
    }

    app.controller("ExportController", ["$scope", "$window", ExportController]);

}());
