(function() {

  var app = angular.module("rooms");

  var RoomController = function($scope, $http, $compile, $routeParams, $location, $window, uiCalendarConfig) {
    $scope.semesters = []; // List of semesters for current unit. Also depends on period being winter or spring
    $scope.eventSources = []; // Array of event sources. Will contain just the json feed object
    $scope.nEvents = 0; // Number of events for current unit and period
    $scope.showError = false;

    $scope.updateView = false;
    // This is the json feed object that is used as event source. By using it, there is no need to manually make the
    // ajax call when there is a change in view or we move forward and backward in time; fullcalendar takes care of it
    $scope.jsonFeed = {
      url: "/calendar/getRoomEvents/" + $routeParams["roomId"], // TODO: hit real servers
      startParam: "fromDate",
      endParam: "toDate",
      beforeSend: function(jqXHR, settings) {
        $(".popover").remove();
      },
      success: function(events) {
        $scope.nEvents = 0;
        var calendar = uiCalendarConfig.calendars["calendar"];
        if ($scope.updateView) {
          calendar.fullCalendar('gotoDate', $scope.periodInfo.startDate);
          $scope.updateView = false;
        }
        for (var i = 0; i < events.length; i++) {
          events[i].color = getRandomColor(events[i].unitId, events[i].examId);
        }
      }
    };

    // Fullcalendar ui configuration object
    $scope.uiConfig = {
      calendar: {
        //lazyFetching: false,
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month, agendaWeek, eventDay'
        },
        buttonText: {
          today: 'Σήμερα',
          month: 'Μήνας',
          week: 'Εβδομάδα',
          eventDay: 'Ημέρα'
        },
        firstHour: 8,
        minTime: '08:00',
        maxTime: '23:00',
        slotMinutes: 30,
        defaultView: 'agendaWeek',
        lang: 'el',
        axisFormat: 'HH:mm',
        // weekends: false,
        allDaySlot: false,
        views: {
          eventDay: {
            type: 'agendaDay',
            groupByDateAndResource: false,
          }
        },
        eventRender: function(event, element) {
          $scope.nEvents += 1;
        },
        eventAfterAllRender: function(view) {},
        eventAfterRender: function(event, element) {
          // After rendering each event
          var dataContent = "";

          if (event.courseCode != null && event.courseCode != "undefined" && event.courseCode != '') {
            if (event.courseData.courseId) {
              dataContent += '<div>' + '<label>Κωδικός:</label> ' + '<a target="_blank" href="/#/course/' + event.courseData.courseId + '?period=' + event.period + '" role="button">' + event.courseCode + '</a>' + '</div>';
            } else {
              dataContent += '<div>' + '<label>Κωδικός:</label> ' + event.courseData.courseId + '</div>';
            }
          }
          if (event.comment != "undefined" && event.comment != '') {
            dataContent += '<div>' + '<label>Σχόλιο:</label> ' + event.comment + '</div>';
          }
          if (event.examId != "undefined" && event.examId != '') {
            dataContent += '<div>' + '<label>Εξάμηνο:</label> ' + examIdToString(event.examId) + '</div>';
          }
          if (event.courseData.instructors != "undefined" && event.courseData.instructors != '') {
            dataContent += '<div>' + '<label>Διδάσκων:</label> ' + getTeacherLinks(event.staffData, event.period) + '</div>';
          }
          if (event.roomData.name != "undefined" && event.roomData.name != '') {
            dataContent += '<div>' + '<label>Χώρος:</label> ' + event.roomData.name + '</div>';
          }
          if (event.duration != "undefined" && event.duration != '') {
            dataContent += '<div>' + '<label>Διάρκεια:</label> ' + event.duration + '</div>';
          }
          if (event.unitName) {
            dataContent += '<div>' + '<label>Τμήμα:</label> ' + event.unitName + '</div>';
          }

          // If the event is a lesson, swap to code,
          // else, swap to the title again (...)

          if (event.courseCode) {
            var event_content = '<span class="event_title">' + event.title + '</span><span class="event_code">' + event.courseCode + '</span>';
          } else {
            var event_content = '<span class="event_title">' + event.title + '</span><span class="event_code">' + event.title + '</span>';
          }

          element.find('.fc-title').html(event_content);
          element.attr({
            'data-event-type': event.typeId,
            'data-toggle': 'popover',
            'data-trigger': 'manual',
            'data-html': 'true',
            'data-container': 'body',
            'data-title': event.title,
            'data-code': event.courseCode,
            'data-content': dataContent,
            'data-placement': 'top',
            'data-exam': event.examId
          });

          element.popover({ html : true })
          .on("mouseenter", function(ev) {
            var self = this;
            $(this).popover("show");
            $(".popover").on("mouseleave", function () {
              $(self).popover('hide');
            });
            $(".btn-delete").click(function() {
              var id = $(this).attr('data-event-id');
              var date = $(this).attr('data-date');
              var name = $(this).attr('data-title');
              cancelEvent(id, date, name);
            });
          })
          .on('mouseleave', function() {
            var self = this;
            setTimeout(function () {
              if (!$(".popover:hover").length) {
                $(self).popover("hide");
              }
            }, 60);
          });
        },
        height: "auto"

      }
    };

    // If detect mobile screen force calendar default view to dateAgenda
    if ($window.innerWidth / $window.innerHeight < 0.75 || $window.innerWidth < 600) {
      $scope.uiConfig.calendar.defaultView = 'eventDay';
      $scope.uiConfig.calendar.header.right = 'next';
      $scope.uiConfig.calendar.header.left = 'prev, today';
      $("#collapseRoomInfo").collapse('hide');
    }

    function getPeriodInfo() {
      var periodsUrl = "/calendar/getPeriods";
      $http.get(periodsUrl).then(
        function(response) {
          // console.log('periodInfo');
          $scope.periodInfo = response.data;

        },
        function() {
          console.error('Could not fetch period data!');
        });
    }

    function checkUrl() {
      $scope.period = getRoomPeriodIndex();
      $http.get('/calendar/getRoomUsageStatistics/' + $routeParams["roomId"] + "?period=" + $scope.period)
           .then(function(response) {
              $scope.roomStatistics = response.data;
           }, function(error) {
             console.error("Could not fetch room statistics data")
           });
      $scope.updateView = true;
      if ($scope.eventSources.length == 0){
        $scope.eventSources.push($scope.jsonFeed);
      }
    }

    var formatRoomData = function(room) {
      if (room.codeName) {
        room.img = '<img class="default-image img-thumbnail img-responsive" src="https://classschedule.auth.gr/img/photos/' + room.codeName + '.jpg" alt="">';
      } else {
        room.codeName = "-";
        console.warn("Invalid codeName!");
      }
      if (!room.id) {
        // room.id = 0;
        console.warn("Invalid ID");
      } else {
        room.schedule = '<a class="btn btn-default btn-sm m-right" href="/#/rooms/?id=' + room.id + '"><span class="glyphicon glyphicon-calendar"></span> Πρόγραμμα</a>';
      }
      if (!room.name) {
        room.name = "ΑΙΘΟΥΣΑ";
      }
      if (room.type === null || room.type == '-' || room.type === '') {
        room.type = "-ΧΩΡΙΣ ΔΗΛΩΜΕΝΟ ΤΥΠΟ-";
      }
      if (!room.buildingId) {
        console.warn("Invalid buildingId!");
      } else {
        room.map = '<a class="btn btn-default btn-sm m-right" target="_blank" href="https://maps.auth.gr/?lang=el&showBlds=' + room.buildingId + '&open=' + room.buildingId + '&type=1"><span class="glyphicon glyphicon-map-marker"></span> Τοποθεσία στον χάρτη</a>';
      }
      if (room.topView) {
        room.plan = '<a class="btn btn-default btn-sm m-right" target="_blank" href="https://dc.ad.auth.gr/auth_management/DATA/PDF/' + room.topView + '"><span class="glyphicon glyphicon-th"></span> Κάτοψη</a>';
      } else {
        //console.warn("Invalid pdfFolder!");
      }
      if (!room.buildingData.name) {
        console.warn("Invalid buildingDto.name!");
      }
      if (!room.unitName) {
        console.warn("Invalid unitName!");
      }
      if (room.photoFolder) {
        //console.warn("Invalid fotoFolder!");
        room.img = '<a target="_blank" href="https://dc.ad.auth.gr/auth_management/DATA/PHOTOS/' + room.photoFolder + '/index.html">' + room.img + '</a>';
      }
      return room;
    }

    $scope.getPeriodString = getPeriodString;

    $http.get('/calendar/getRoom/' + $routeParams["roomId"])
      .then(function(response) {
        $scope.room = formatRoomData(response.data);
      }, function() {
        console.error("Could not fetch room data!");
      });
    getPeriodInfo();
    checkUrl();

  }

  app.controller("RoomController", ["$scope", "$http", "$compile", "$routeParams", "$location", "$window", "uiCalendarConfig", RoomController]);

}());
