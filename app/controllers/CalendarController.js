(function() {

    var app = angular.module("rooms");

    var CalendarController = function($scope, $http, $compile, $routeParams, $location, $window, uiCalendarConfig) {
        var requestedPath = $location.$$path;
        // At first use default values
        $scope.semesters = []; // List of semesters for current unit. Also depends on period being winter or spring
        $scope.eventSources = []; // Array of event sources. Will contain just the json feed object
        $scope.nEvents = 0; // Number of events for current unit and period
        $scope.resources = [];
        $scope.showWeekends = false;
        $scope.unitHasCalendar = true;
        $scope.loading = true;

        if (requestedPath == "/teacherCalendar") {
          $scope.hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
          $scope.hoursAll = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
          $scope.minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
        }

        $scope.updateView = false;
        // This is the json feed object that is used as event source. By using it, there is no need to manually make the
        // ajax call when there is a change in view or we move forward and backward in time; fullcalendar takes care of it
        $scope.jsonFeed = {
            startParam: "fromDate",
            endParam: "toDate",
            data: function() {
              if (requestedPath == "/calendar") {
                return {unit: $scope.unit.id, period: $scope.period};
              } else {
                return {period: $scope.period};
              }
            },
            beforeSend: function(jqXHR, settings) {
                console.log("Preparing to retrieve event data");
                $scope.loading = true;
                $(".popover").remove();
                if (requestedPath == "/calendar") {
                  settings.url = settings.url.replace("?", "");
                  settings.url = settings.url.replace("unit=", "");
                  settings.url = settings.url.replace("&period=", "/");
                  settings.url = settings.url.replace("&", "?");
                }
            },
            success: function(events) {
                console.log("Event data retrieved successfully!");
                console.log("Events: " + events.length);
                $scope.nEvents = 0;
                $scope.resources = [];
                var calendar = uiCalendarConfig.calendars.calendar;
                // reset calendar view with weekdays only
                if ( calendar.fullCalendar( 'getView' ).name == "agendaWeek" ) {
                  calendar.fullCalendar( 'changeView', 'workWeek' );
                  $scope.showWeekends = false;
                }

                // start generating resources rooms array
                for (var i = 0; i < events.length; i++) {
                    // generate rooms resources
                    var resource = {
                        title: events[i].roomData.name,
                        roomCode: events[i].roomData.codeName,
                        id: events[i].roomData.id,
                        buildingId: events[i].roomData.buildingId
                    };
                    events[i].resourceId = resource.id.toString();
                    $scope.resources.push(resource);

                    // if a single event is at weekend enable calendar weekends
                    if (calendar.fullCalendar( 'getView' ).name == "workWeek" && (events[i].dayId == 1 || events[i].dayId == 7)) {
                      calendar.fullCalendar( 'changeView', 'agendaWeek' );
                      $scope.showWeekends = true;
                    }

                    // set the event background color based on its examId property
                    events[i].color = getRandomColor(events[i].unitId, events[i].examId);
                }

                calendar.fullCalendar('refetchResources');

                console.log("Moving to rendering");

                // tell calendar to jumt to date (based on flag)
                if ($scope.updateView) {
                    calendar.fullCalendar('gotoDate', $scope.periodInfo[$scope.period - 1].startDate);
                    $scope.updateView = false;
                }
            }
        };

        switch (requestedPath) {
          case "/teacherCalendar":
          case "/myCalendar":
            $scope.jsonFeed.url = "/backend/myCalendar.php";
            break;
          case "/calendar":
            $scope.jsonFeed.url = "https://ws-ext.it.auth.gr/calendar/getCalendarEvents/";
            break;
        }

        // Fullcalendar ui configuration object
        $scope.uiConfig = {
            calendar: {
                //lazyFetching: false,
                schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month, agendaWeek, workWeek, eventDay, resourceDay'
                },
                buttonText: {
                    today: 'Σήμερα',
                    month: 'Μήνας',
                    week: 'Εβδομάδα',
                    workWeek: 'Εργάσιμες',
                    eventDay: 'Ημέρα',
                    resourceDay: 'Αίθουσες'
                },
                firstHour: 8,
                minTime: '08:00',
                maxTime: '23:00',
                slotMinutes: 30,
                defaultView: 'agendaWeek',
                lang: 'el',
                axisFormat: 'HH:mm',
                allDaySlot: false,
                resourceLabelText: 'Αίθουσα',
                resources: function(callback) {
                    callback($scope.resources);
                },
                views: {
                    resourceDay: {
                        type: 'agendaDay',
                    },
                    eventDay: {
                        type: 'agendaDay',
                        groupByDateAndResource: false,
                    },
                    workWeek: {
                      type: 'agendaWeek',
                      hiddenDays: [0, 6]
                    }
                },
                resourceText: function(resource) {
                  return resource.title;
                },
                resourceRender: function(resourceObj, labelTds, bodyTds) {
                  var image = "";
                  var title = "";
                  image += '<th><a href="/#/room/' + resourceObj.id + '" role="button">';
                  image += '<img class="img-thumbnail img-responsive" width="100" height="100" src="https://classschedule.auth.gr/img/photos/' + resourceObj.roomCode + '.jpg" alt="">';
                  image += '</a></th>';
                  title += '<a href="/#/room/' + resourceObj.id + '" role="button">';
                  title += resourceObj.title;
                  title += '</a>';
                  labelTds.html(title);
                  if ($("#room-images").length === 0) {
                    labelTds.parent().parent().append('<tr id="room-images"><th></th></tr>');
                  }
                  $("#room-images").append(image);
                },
                eventRender: function(event, element) {
                    console.log("Render Event");
                    // If semester filter has value and current event does not belong to that semester
                    // don't render it (return false)
                    if ($scope.semester) {
                        if (event.examId < 250 && event.examId != $scope.semester) {
                            return false;
                        } else if (event.examId == 251 && $scope.semester % 2 === 0) {
                            return false;
                        } else if (event.examId == 252 && $scope.semester % 2 !== 0) {
                            return false;
                        }
                    }
                    $scope.nEvents += 1;
                },
                eventAfterAllRender: function(view) {
                    console.log("Events rendered");
                    $scope.loading = false;
                },
                eventAfterRender: function(event, element) {
                    // After rendering each event
                    var dataContent = "";

                    if (event.courseCode !== null && event.courseCode != "undefined" && event.courseCode !== '') {
                      if (event.courseData.courseId) {
                        dataContent += '<div>' + '<label>Κωδικός:</label> ' + '<a target="_blank" href="/#/course/' + event.courseData.courseId + '?period=' + $scope.period + '" role="button">' + event.courseCode + '</a>' + '</div>';
                      } else {
                    	  if (event.courseData.courseId != "undefined" && event.courseData.courseId !== '' && 
                          		event.courseData.courseId != '0') {
                    		  dataContent += '<div>' + '<label>Κωδικός:</label> ' + event.courseData.courseId + '</div>';
                    	  }
                      }
                    }
                    if (event.comment != "undefined" && event.comment !== '') {
                        dataContent += '<div>' + '<label>Σχόλιο:</label> ' + event.comment + '</div>';
                    }
                    if (event.examId != "undefined" && event.examId !== '') {
                        dataContent += '<div>' + '<label>Εξάμηνο:</label> ' + examIdToString(event.examId) + '</div>';
                    }
                	if (event.courseData.instructors != "undefined" && event.courseData.instructors !== '' && 
                		event.courseData.instructors !== '-') {
                		dataContent += '<div>' + '<label>Διδάσκων:</label> ' + getTeacherLinks(event.staffData, $scope.period) + '</div>';
                	}
                    if (event.roomData.name != "undefined" && event.roomData.name !== '') {
                        dataContent += '<div>' + '<label>Χώρος:</label> ' + '<a target="_blank" href="/#/room/' + event.roomData.id + '" role="button">' + event.roomData.name + '</a> ' + '</div>';
                    }
                    if (event.duration != "undefined" && event.duration !== '') {
                        dataContent += '<div>' + '<label>Διάρκεια:</label> ' + event.duration + '</div>';
                    }
                    if (event.unitName) {
                      dataContent += '<div>' + '<label>Τμήμα:</label> ' + event.unitName + '</div>';
                    }


                    // If the event is a lesson, swap to code,
                    // else, swap to the title again (...)
                    var event_content = "";
                    if (event.courseCode) {
                        event_content = '<span class="event_title">' + event.title + '</span><span class="event_code">' + event.courseCode + '</span>';
                    } else {
                        event_content = '<span class="event_title">' + event.title + '</span><span class="event_code">' + event.title + '</span>';
                    }

                    if (requestedPath == "/teacherCalendar") {
                      event.date = Math.round(new Date(event.start).getTime()/1000);
                      dataContent += '<button type="button" data-title='+event.title+' data-date='+event.date+' data-event-id='+event.id+' class="btn btn-delete btn-danger">Ακύρωση</button>';
                    }


                    element.find('.fc-title').html(event_content);
                    element.attr({
                      'data-event-type': event.typeId,
                      'data-toggle': 'popover',
                      'data-trigger': 'manual',
                      'data-html': 'true',
                      'data-container': 'body',
                      'data-title': event.title,
                      'data-date': event.date,
                      'data-event-id': event.id,
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
                dayClick: function(date, jsEvent, view) {
                  if (requestedPath != "/teacherCalendar") {
                    return;
                  }
                  $("[data-toggle='popover']").popover('hide');
                  $scope.hour = parseInt(date.format('HH'));
                  $scope.minute = parseInt(date.format('mm'));
                  $scope.date = date;
                  $scope.durationHours = 2;
                  $scope.durationMinutes = 0;
                  $scope.comment = "";
                  var options = {
                    show: true
                  };
                  $scope.updateDuration();
                  getTeacherCourses();
                  $('#createEventModal').modal(options);
                },
                height: "auto"
            }
        };

        // If detect mobile screen force calendar default view to dateAgenda
        if ($window.innerWidth / $window.innerHeight < 0.75 || $window.innerWidth < 600) {
          $scope.uiConfig.calendar.defaultView = 'eventDay';
          $scope.uiConfig.calendar.header.right = '';
          $("#collapseSettings").collapse('hide');
          $scope.mobile = true;
        }

        /**
         * Used to format the Unit data for the HTML page.
         * It populates each unit with the parentName field.
         */
        function formatUnitData(units) {
            console.log("Format Unit Data");
            var newUnits = [];
            units.forEach(function(faculty, index, array) {
                if (faculty.departments) {
                    faculty.departments.forEach(function(department, index, array) {
                        department.parentName = faculty.name;
                        newUnits.push(department);
                    });
                }
            });
            return newUnits;
        }

        function getUnitsDropDown() {
          console.log("Get Units for dropdown menu");
          var unitsUrl = "https://ws-ext.it.auth.gr/calendar/getCalendarUnits/tree?period=" + $scope.period;
          $http.get(unitsUrl).then(function(response) {
              console.log("Got Units for dropdown");
              $scope.unitsDropdown = formatUnitData(response.data);
              var flag = false;
              for (var i = 0; i < $scope.unitsDropdown.length; i++) {
                if ( $scope.unitsDropdown[i].id === $scope.unit.id) {
                  flag = $scope.unitsDropdown[i].hasCalendar == 1;
                  break;
                }
              }
              $scope.unitHasCalendar = flag;
          }, function() {
            console.error('Could not fetch unit data for the dropdown!');
            $scope.loading = false;
          });
        }

        function getUnitList() {
            console.log("Get Unit list");
            var unitsUrl = "https://ws-ext.it.auth.gr/calendar/getCalendarUnits/tree"; // TODO: Hit real servers
            $http.get(unitsUrl).then(
                function(response) {
                    console.log("Got units list");
                    $scope.units = formatUnitData(response.data);
                    checkUrl();
                }, function() {
                  console.error('Could not fetch unit data!');
                  $scope.loading = false;
                });
        }

        function getPeriodInfo() {
            console.log("Get period info");
            var periodsUrl = "https://ws-ext.it.auth.gr/calendar/getPeriods";
            $http.get(periodsUrl).then(
                function(response) {
                    $scope.periodInfo = response.data;
                    // Now get unit list
                    if (requestedPath == "/calendar") {
                      getUnitList();
                    } else {
                      checkUrl();
                    }
                }, function() {
                  console.error('Could not fetch period data!');
                  $scope.loading = false;
                });
        }

        function updateSemesterList() {
            console.log("Update semester list");
            if (requestedPath == "/calendar") {
              getUnitsDropDown();
              var start = 1; // Change this depending on current period
              if ($scope.period == 2 || $scope.period == 3){
                  start = 2;
              }

              $scope.semesters.length = 0;
              for (var i = start; i <= $scope.unit.exams; i += 2){
                  $scope.semesters.push(i);
              }
            } else {
              if ($scope.period == 2 || $scope.period == 4) {
                $scope.semesters = [2, 4, 6, 8, 10];
              } else if ($scope.period == 1 || $scope.period == 3) {
                $scope.semesters = [1, 3, 5, 7, 9];
              } else {
                $scope.semesters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
              }
            }
            $scope.loading = false;
        }

        function checkUrlPersonal() {
          if (Object.keys($routeParams).length === 0) {
            $routeParams.period = $scope.currentPeriod;
            $routeParams.year = $scope.currentYear;
          }
          if (Object.keys($routeParams).length === 2) {

            if ($routeParams.period !== undefined && $routeParams.year !== undefined) {
              $scope.selectedPeriod = getPeriodFromParameters($scope.filterOptions, $routeParams.period);
              $scope.period = $scope.selectedPeriod.value[0];
              $scope.year = $scope.selectedPeriod.value[1];
              if ($routeParams.period != $scope.currentPeriod || $routeParams.year != $scope.currentYear) {
                $scope.updateView = true;
              }
              updateSemesterList();
            }

            if ($scope.eventSources.length === 0) {
              $scope.eventSources.push($scope.jsonFeed);
            }
          }
        }

        function checkUrlCalendar() {

          if ($routeParams.unitId !== undefined && isNaN($routeParams.unitId)) {
            var codeList = $scope.units.map( function (unit) { return unit.code; });
            var idList = $scope.units.map( function (unit) { return unit.id; });
            var unitIndex = codeList.indexOf( $routeParams.unitId );
            $scope.unit = $scope.units[unitIndex];
          } else if ($routeParams.unitId !== undefined) {
            var idList = $scope.units.map( function (unit) { return unit.id; });
            var unitIndex = idList.indexOf( Number( $routeParams.unitId ) );
            $scope.unit = $scope.units[unitIndex];
          }

          if ( !$routeParams.period ) {
            $routeParams.period = $scope.currentPeriod;
          }

          if ( $routeParams.year ) {
            $routeParams.year = $scope.currentYear;
          }
          $scope.selectedPeriod = getPeriodFromParameters($scope.filterOptions, $routeParams.period);
          $scope.period = $scope.selectedPeriod.value[0];
          $scope.year = $scope.selectedPeriod.value[1];

          if ($routeParams.period != $scope.currentPeriod || $routeParams.year != $scope.currentYear) {
              $scope.updateView = true;
          }

          updateSemesterList();

          if ($scope.eventSources.length === 0) {
              $scope.eventSources.push($scope.jsonFeed);
          }
        }

        function checkUrl() {
          console.log("Check url parameters");
          switch (requestedPath) {
            case "/teacherCalendar":
            case "/myCalendar":
              checkUrlPersonal();
              break;
            case "/calendar":
              checkUrlCalendar();
              break;
          }
        }

        function cancelEvent(id, date, name) {
          var tempDate = new Date(date * 1000);
          if (confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε το μάθημα " + name + " στις " + tempDate.toLocaleDateString() + " ;")) {
            var url = "/backend/manage.php";
            var data = {'action': 'cancel', 'id': id, 'date': date};
            $http.post(url, data)
            .then(function(){
              alert("Το μάθημα διαγράφτηκε με επιτυχία!");
              var calendar = uiCalendarConfig.calendars.calendar;
              calendar.fullCalendar('refetchEvents');
            }, function(){
              alert("Υπήρξε πρόβλημα με την διαγραφή του μαθήματος, παρακαλώ επικοινωνήστε με τους διαχειριστές.");
            });
          }
        }

        function getTeacherCourses() {
          $scope.loading = true;
          $http.get("backend/?method=getRegisteredCourses&period=" +$scope.period)
            .then(function(response) {
              $scope.loading = false;
              $scope.courses = response.data;
              if (response.data.length == 0) {
                $scope.error = true;
                alert("Δεν έχει δηλωθεί μάθημα στο ΑΕΜ σας για αυτό το εξάμηνο. Επικοινωνήστε με τον διαχεριστή τμήματος για να σας κάνει κράτηση.");
              }
            }, function() {
              console.error("Error while getting your courses!");
              $scope.loading = false;
            });
        }

        $scope.updateDuration = function() {
          $scope.loading = true;
          $http.get("backend/?method=getEmptyRooms&date=" + $scope.date.format('DD-MM-YYYY HH:mm') + "&durationHours=" + $scope.durationHours + "&durationMinutes=" + $scope.durationMinutes)
          .then(function(response) {
            $scope.loading = false;
            $scope.rooms = response.data;
            if ($scope.rooms.length > 0) {
              $scope.room = $scope.rooms[0];
            }
          }, function(error) {
            console.error("Error while getting empty rooms!");
            $scope.loading = false;
          });
        };

        $scope.periodChange = function periodChange() {
            console.log("Period change");
            $scope.period = $scope.selectedPeriod.value[0];
            $scope.year = $scope.selectedPeriod.value[1];
            updateSemesterList();
            // Go to new url
            if (requestedPath == "/calendar") {
              $location.url("/calendar?unitId=" + $scope.unit.id + "&period=" + $scope.period + "&year=" + $scope.year);
            } else {
              $location.url(requestedPath + "?period=" + $scope.period + "&year=" + $scope.year);
            }

        };

        $scope.unitChange = function unitChange() {
            console.log("Unit change");
            if ($scope.eventSources.length === 0){
                $scope.eventSources.push($scope.jsonFeed);
            }
            // Go to new url
            $location.url("/calendar?unitId=" + $scope.unit.id + "&period=" + $scope.period + "&year=" + $scope.year);
            updateSemesterList();
        };

        $scope.semesterChange = function semesterChange() {
            console.log("Semester change");
            $scope.nEvents = 0;
            var calendar = uiCalendarConfig.calendars.calendar;
            calendar.fullCalendar('rerenderEvents');
        };

        $scope.createEvent = function() {
          var url = "backend/manage.php";
          if (!$scope.course) {
            alert("Παρακαλώ επιλέξτε μάθημα. Αν δεν έχετε μαθήματα στην λίστα επικοινωνήστε με τους διαχερείστες συστήματος.");
            return;
          }
          var data = {
            action: 'create',
            date: $scope.date.format("DD-MM-YYYY HH:mm"),
            durationHours: $scope.durationHours,
            durationMinutes: $scope.durationMinutes,
            comment: $scope.comment,
            eventId: $scope.course.eventId,
            roomId: $scope.room.id
          };
          $http.post(url, data).then(function () {
            alert("Η νέα εγγραφή δημιουργήθηκε με επιτυχία!!");
            var calendar = uiCalendarConfig.calendars.calendar;
            calendar.fullCalendar('refetchEvents');
          }, function() {
            alert("Υπήρξε πρόβλημα με την δημιουργία εγγραφής του μαθήματος, παρακαλώ επικοινωνήστε με τους διαχειριστές.");
          });
        };

        // Automatically generate the period filter options, based on current period
        $http.get("https://ws-ext.it.auth.gr/calendar/getPeriods").then(
            function(response) {
                $scope.periods = response.data;
                $scope.filterOptions = getFilterOptions($scope.periods);
                // At first use default values
                $scope.selectedPeriod = $scope.filterOptions[getCurrentPeriodIndex($scope.periods)];
                $scope.period = $scope.selectedPeriod.value[0];
                $scope.year = $scope.selectedPeriod.value[1];
                $scope.currentPeriod = $scope.period;
                $scope.currentYear = $scope.year;
                getPeriodInfo();
            }, function () {
              console.error('Could not fetch period data!');
              $scope.loading = false;
            }
        );

    };

    app.controller("CalendarController", ["$scope", "$http", "$compile", "$routeParams", "$location", "$window", "uiCalendarConfig", CalendarController]);

}());
