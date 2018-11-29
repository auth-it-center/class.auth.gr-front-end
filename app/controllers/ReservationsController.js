(function() {

    var app = angular.module("rooms");

    var ReservationsController = function($scope, $http, $compile, $routeParams, $location, $window, uiCalendarConfig) {
        var requestedPath = $location.$$path;
        // At first use default values
        $scope.holidays= []; // List of holidays days
        $scope.eventSources = []; // Array of event sources. Will contain just the json feed object
        $scope.nEvents = 0; // Number of events for current unit and period
        $scope.resources = [];
        $scope.courses = []; //list of courses of selected department
        $scope.rooms = []; //list of courses of selected department
        $scope.loading = true;
        // $( "#dialog-1" ).dialog({
             // autoOpen: false,
        // });
		$scope.selectedUnit = 0;
	 	$scope.unit = 0;
		$scope.selectedUnitDescription = "";
		$scope.currentPeriod = -1;
		$scope.currentYear = -1;
		$scope.selectedClassSections = [];
		$scope.selectedClassTeachers = [];
		$scope.typeId = -1;
		$scope.nowDate = null;
		$scope.periods = [];
		$scope.periodsOriginal = [];
		$scope.periodTypes = [];
		$scope.unitPeriods = [];
		$scope.selectedPeriod = 0;
		$scope.selectedPeriodText = "";
		$scope.selectedPeriodStartDate = "";
		$scope.selectedPeriodEndDate = "";
		$scope.eventTypes =  ['Τακτική', 'Έκτακτη', 'Ακυρωμένη'];
		$scope.courseTypes =  ['Εκδήλωση', 'Συνέλευση', 'Δημόσια Υποστήριξη', 'Προφορική εξέταση μαθήματος', 'Γραπτή εξέταση μαθήματος'];
		$scope.weekDays = [{id: 1, text: 'Κυριακή'}, {id: 2, text: 'Δευτέρα'}, {id: 3, text : 'Τρίτη'}, {id: 4, text : 'Τετάρτη'}, {id: 5, text : 'Πέμπτη'}, {id: 6, text : 'Παρασκευή'}, {id: 7, text : 'Σάββατο'}];
		$scope.selectedEventId = -1;
		$scope.numOfEvents = 0;
		$scope.repeatedDates = [];
		$scope.cancelleddDates = [];
		$scope.selectedType = 2;
		///////////////////////////////////////

		angular.element(document.getElementById("noUnitsWarning").innerHTML = "");

		$("#unitsSelect").select2({
			placeholder: 'Επιλέξτε Μονάδα'
		});

	    $('#typeSelect').select2({
		  placeholder: "Επιλέξτε τον τύπο",
	    	// data: $scope.eventTypes
		});
	    $('#daySelect').select2({
		  placeholder: "Επιλέξτε Ημέρα",
		  data: $scope.weekDays
		});

		$scope.goToList = function() {
	        window.location.assign(encodeURI(window.location.origin + "/#/reservationsList"  + "?unitId="+$scope.selectedUnit+ "&period=" +$scope.selectedPeriod));
	    };

		// Period Types
        $http.get('/calendar/getPeriodTypes').then(
        	function(response) {
              	$scope.periodTypes = response.data;
            }, function(response) {
            	$scope.error_periodtypes = "Error while getting period type data!";
              	$scope.loading = false;
        });

        // Get global periods
		$http.get('/calendar/getPeriods').then(
        	function(response) {
              	$scope.periodsOriginal = response.data;
  	           	$scope.periods = getPeriodsWithYear(response.data);
            	$scope.currentPeriod = response.data[getCurrentPeriodIndex(response.data)].id;
            	// console.log("currentperiod: " + $scope.currentPeriod);
             	$scope.currentYear = response.data[getCurrentPeriodIndex(response.data)].year;

            }, function(response) {
            	$scope.error_period = "Error while getting period data!";
              	$scope.loading = false;
        });


		$scope.userInit = function(apm) {
		 	$http.get('https://ws-ext.it.auth.gr/isClassUser/' + apm).then(
        	function(response) {
              	$scope.userinfo = response.data['user'];
    			// if user exists
              	if ($scope.userinfo.length > 0 ){
              		// if not admin
              		if ($scope.userinfo[0].isAdmin == "0"){
              			$scope.unitsUrl = "/calendar/getSimpleCalendarUnitsForUser/" + $scope.userinfo[0].id ;
              		} else {
              			$scope.unitsUrl = "/calendar/getSimpleCalendarUnits";
              		}
              		getUnitsList($scope.unitsUrl);
              		return $scope.unitsUrl;
              	}
              	else {
              		// no use found by apm
              		console.log("Wrong APM for user");
          			angular.element(document.getElementById("unitsSelect").style.display = 'none');
  					angular.element(document.getElementById("noUnitsWarning").innerHTML = "Δεν έχει αντιστοιχηθεί κάποιο τμήμα - μονάδα στο λογαριασμό σας");
				}

            }, function(response) {
            	$scope.error_units = "Error while getting university unit data!";
           	    $scope.loading = false;
         })
		};

		function getUnitsList(unitsUrl) {
			$http.get(unitsUrl).then(
	        	function(response) {
	        		$scope.univUnits = response.data;
					//
			        var options = [];
    				angular.forEach($scope.univUnits, function(value, key) {
    					var option = new Option(value.name, value.id);
					 	options.push(option);
					});
					$("#unitsSelect").append(options);
					//
			    	if ($scope.univUnits.length ==  0) {
		        		console.log("No units matched for user");
	          			angular.element(document.getElementById("unitsSelect").style.display = 'none');
	  					angular.element(document.getElementById("noUnitsWarning").innerHTML = "Δεν έχει αντιστοιχηθεί κάποιο τμήμα - μονάδα στο λογαριασμό σας");
		        	}
		        	else {
		        		if ($routeParams.unitId!=null){

							angular.forEach($scope.univUnits, function(value, key) {
								if (value.id == $routeParams.unitId){
									$scope.selectedUnit = value.id;
									$scope.unit = value.id;
									$scope.selectedUnitDescription = value.name;
									$('#unitsSelect').val($scope.selectedUnit);
									$('#unitsSelect').trigger('change'); // Notify any JS components that the value changed
								}
							});
						}
						if ($routeParams.period!=null && $routeParams.period < $scope.periodTypes.length+1){
							$scope.selectedPeriod = $routeParams.period
							getClasses(); // load classes-courses along with data
							getRoomListForUnit($scope.selectedUnit); // load rooms along with data
							getUnitPeriods();
							$scope.getCalendarEvents();
						}
		        	}
					loading = false;
	            }, function(response) {
	        		$scope.error_units = "Error while getting university unit data!";
					$scope.loading = false;
	    	 });
       	}


		$('#unitsSelect').on('change', function() {
      		$scope.selectedUnit = $('#unitsSelect').val();
      		$scope.unit = $('#unitsSelect').val();
  			// console.log("onUnitChange:" +  $scope.selectedUnit);
			// reset periods
		 	$('#periodsSelect').val(null);
			$('#periodsSelect').trigger('change');
			getUnitPeriods(); // Here call periods
	    });

		Array.prototype.diff = function(a) {
		    return this.filter(function(i) {return a.indexOf(i) < 0;});
		};

		// @TODO
		// When on calendar user admin can view only things inside his period scope.
		// E.g. when I reserver a FAVORITE room from another unit which has different period scope possibly the admin of the other unit will not be able to see my reservation
		function getUnitPeriods() {
			console.warn('getUnitData', $scope.selectedUnit)

		  	// First check for unit's periods
			 $http.get("/calendar/getUnitPeriods/" + $scope.selectedUnit).then(
	            function(response) {
	            	$scope.unitPeriods = response.data;
            		if ($scope.unitPeriods.length > 0){ // If unit has its own periods - not empty array
			      	////////////////////////////////////////////////////////////////////////////////////////////////////
				      	if ($scope.unitPeriods.length < $scope.periodTypes.length){ // need to fill the rest from $scope.periods
				      		var periodTypeIndeces = [];
				      		angular.forEach($scope.periodTypes, function(value, key) {
				      			periodTypeIndeces.push(value.id);
				      		});

				      		var unitPeriodIndeces = [];
				      		angular.forEach($scope.unitPeriods, function(value, key) {
				      			unitPeriodIndeces.push(value.id);
				      		});
				      		// console.log(unitPeriodIndeces);
				      		var typesDiff = periodTypeIndeces.diff(unitPeriodIndeces);

				      		// First push in periods the unit periods
				      		var periodsTmp = [];
				      		angular.forEach($scope.unitPeriods, function(value, key) {
		      		 			periodsTmp.push(value);
		      		 		});
		      		 		for (var i=0; i < typesDiff.length; i++){
		      		 				// console.log(typesDiff[i]);
		      		 				angular.forEach($scope.periodsOriginal, function(value, key) {
		      		 					if (value.id == typesDiff[i]){
		      		 						periodsTmp.push(value);
		      		 					}
		      		 				});
		      		 		}
		      		 		$scope.periods = getPeriodsWithYear(periodsTmp);
		      		 	}
				      	else { // unit periods length == periodTypes length
				      		$scope.periods = getPeriodsWithYear($scope.unitPeriods);
				      	}

			      	////////////////////////////////////////////////////////////////////////////////////////////////////
	            	}
	            	// console.log($scope.periods);
	            	$("#periodsSelect").select2({
					      placeholder: 'Καθορίστε την περίοδο',
					      data: $scope.periods
				    });
	    			if ($scope.selectedPeriod > 0){
						// Get other variables
						angular.forEach($scope.periods, function(value, key) {
							// console.log(value);
							 if (value.id == $scope.selectedPeriod){
							 	$scope.selectedPeriodText = value.text;
								$scope.selectedPeriodStartDate = value.startDate.substring(0,10); // remove 00:00:00
								$scope.selectedPeriodEndDate = value.endDate.substring(0,10); // remove 00:00:00
								$('#periodsSelect').val($scope.selectedPeriod);
								$('#periodsSelect').trigger('change'); // Notify any JS components that the value changed
							 }
						});
					}

            	}, function () {
	              console.error('Could not fetch period data!');
	              $scope.loading = false;
	            }
	        );
		}

		$('#periodsSelect').on('change', function() {
      		$scope.selectedPeriod = $('#periodsSelect').val();

   			if($scope.selectedPeriod > 0 ){
				// console.log("onPeriodChange:" +  $scope.selectedPeriod);
	   			window.location.assign(encodeURI(window.location.origin + "/#/reservations"  + "?unitId="+$scope.selectedUnit+ "&period=" +$scope.selectedPeriod));
	   			// set again the currentYear - based on selected period
	   			$scope.currentYear = $scope.periods[$scope.selectedPeriod-1].year;
   			}
        });

	    $scope.getCalendarEvents = function() {
	    	$scope.loading = true;
	    	// console.log("/calendar/getCalendarEvents/" + $scope.selectedUnit + "/" + $scope.selectedPeriod);
         	$http.get("/calendar/getAdminCalendarEvents/" + $scope.selectedUnit + "/" + $scope.selectedPeriod).then(
			function(resource) {
				var events = resource.data;
				// console.log(events);
				console.log("Event data retrieved successfully!");
                console.log("Events: " + events.length);
                $scope.numOfEvents = events.length;
             	$scope.nEvents = 0;
             	$scope.resources = [];
				var calendar = uiCalendarConfig.calendars.calendar;
				calendar.fullCalendar('removeEvents')
                // reset calendar view with weekdays only
                // calendar.fullCalendar('changeView','agendaWeek');
                // reset calendar view with weekdays only
				// if (calendar.fullCalendar('getView').name == "agendaWeek") {
					// calendar.fullCalendar('changeView', 'workWeek');
					// $scope.showWeekends = false;
				// }
                            // // start generating resources rooms array
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
                    // set the event background color based on its examId property
            		if (calendar.fullCalendar('getView').name == "workWeek" && (events[i].dayId == 1 || events[i].dayId == 7)) {
						calendar.fullCalendar('changeView', 'agendaWeek');
						$scope.showWeekends = true;
					}

					if (events[i].typeId == 3){
                		 events[i].color = 'red'; // cancelled
	                } else {
	                	 events[i].color = getRandomColor(events[i].unitId, events[i].examId);
	                }

                }
                getHolidays();
                calendar.fullCalendar('refetchResources');
				$scope.eventSources.push(events);

                var jumpToDate = new Date();
                if ($scope.selectedPeriod != $scope.currentPeriod){
                	// periods should be ordered ASC by type!!!
                	jumpToDate = $scope.periods[$scope.selectedPeriod-1].startDate;
                }
                calendar.fullCalendar('gotoDate', jumpToDate);
        	}, function(resource) {
            	$scope.error_events = "Error while getting events!";
              	$scope.loading = false;
     		});
	  	};

	    $scope.checkIfHoliday = function(date) {
    		var nameVacation = "";
           	for(var i=0;i<$scope.holidays.length;i++){
                if(date.format("YYYY-MM-DD")===format($scope.holidays[i].start)){
                  flag=false;
                  nameVacation=$scope.holidays[i].title;
                  // return nameVacation;
                  break;
                }
                else if(date.format("YYYY-MM-DD")>format($scope.holidays[i].start) && date.format("YYYY-MM-DD")<=format($scope.holidays[i].end)){
                  flag=false;
                  nameVacation=$scope.holidays[i].title;
                  // return nameVacation;
                  break;
                }
              }
              return nameVacation;
        };

	    // Fullcalendar ui configuration object
		$scope.uiConfig = {
			calendar : {
				//lazyFetching: false,
				schedulerLicenseKey : 'CC-Attribution-NonCommercial-NoDerivatives',
				// editable : true, // enable drag-n-drop
				header : {
					left : 'prev,next today',
					center : 'title',
					right : 'month, agendaWeek, workWeek, eventDay, resourceDay'
				},
				buttonText : {
					today : 'Σήμερα',
					month : 'Μήνας',
					week : 'Εβδομάδα',
					workWeek : 'Εργάσιμες',
					eventDay : 'Ημέρα',
					resourceDay : 'Αίθουσες'
				},
				firstHour : 8,
				minTime : '08:00',
				maxTime : '23:00',
				slotMinutes : 30,
				defaultView : 'agendaWeek',
				lang : 'el',
				axisFormat : 'HH:mm',
				allDaySlot : false,
				resourceLabelText : 'Αίθουσα',
				eventSources: [
                  $scope.resources,
                  $scope.holidays
                ],
				resources : function(callback) {
					callback($scope.resources);
				},
				views : {
					resourceDay : {
						type : 'agendaDay',
					},
					eventDay : {
						type : 'agendaDay',
						groupByDateAndResource : false,
					},
					workWeek : {
						type : 'agendaWeek',
						hiddenDays : [0, 6]
					}
				},
				resourceText : function(resource) {
					return resource.title;
				},
				resourceRender : function(resourceObj, labelTds, bodyTds) {
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
				editable:true, // drag & drop
				eventAllow: function(dropLocation, draggedEvent) {
					// console.log("dragged event :" + draggedEvent.id);
					// console.log("dropLocation :" + dropLocation.start);
					// Disable drag & drop for cancelled events (typeId = 3)
					if (draggedEvent.typeId == 3) {
						return false;
				  	}
				},
				/**
				 * On drag & drop changes the date and event & start - the duration remains the same
				 * changed parameters: dayId, date, hourId, minutes
				 */
				eventDrop: function(event, delta, revertFunc) {
					var displayMessage = "";
					if (event.typeId == 1 &&  event.dayId != (event.start._d.getDay()+1)){
						displayMessage = " στην " + $scope.weekDays[event.start._d.getDay()].text + ";";
					}
					else { // event.typeId == 2
						displayMessage = " στις " + event.start.format("DD-MM-YYYY HH:mm") + ";";
					}
					if (confirm("Είστε σίγουροι οτι θέλετε να μεταφέρετε το " + event.title + displayMessage)) {
			            $scope.updateEventDate(revertFunc, event);
			        }
			        else {
						revertFunc();
    				}
				},
				eventResize: function(event, delta, revertFunc) {
				    var h = addZero(event.end.format("H"));
				    var m = addZero(event.end.format("m"));
				   	var upTo = h + ":" + m ;

				    // update duration
				   	var timeDiff = new Date(event.end).getTime() - new Date(event.start).getTime();
				   	var diffInSeconds = timeDiff/1000; // seconds here
					var min = Math.floor(diffInSeconds / 60);
					var newDuration = convertMS(diffInSeconds);
					//

				    if (confirm("Είστε σίγουροι οτι θέλετε να τελειώνει το " + event.title + " στις " + upTo)) {
			      		// update Event
			      		$scope.updateEventDuration(revertFunc, event.id, event.roomData.id, event.period, event.start.format("DD-MM-YYYY"), addZero(event.hourId), addZero(event.minutes), event.durationHours, event.durationMinutes, newDuration.substr(0,2), newDuration.substr(3,2), event.typeId, event.start._d.getDay() + 1, event.unitId);
				    }
				    else {
				    	revertFunc();
				    }
				},
				eventRender : function(event, element) {
					// console.log(event);
					$scope.nEvents += 1;
				},
				eventAfterAllRender : function(view) {
					// console.log("Events rendered");
					$scope.loading = false;
				},
				eventAfterRender : function(event, element) {
					// After rendering each event
					var dataContent = "";
					// console.log(event);

					if (event.courseCode !== null && event.courseCode != "undefined" && event.courseCode !== '') {
						if (event.courseData.courseId) {
							dataContent += '<div>' + '<label>Κωδικός:</label> ' + '<a target="_blank" href="/#/course/' + event.courseData.courseId + '?period=' + $scope.period + '" role="button">' + event.courseCode + '</a>' + '</div>';
						} else {
							if (event.courseData.courseId != "undefined" && event.courseData.courseId !== '' && event.courseData.courseId != '0') {
								dataContent += '<div>' + '<label>Κωδικός::</label> ' + event.courseData.courseId + '</div>';
							}
						}
					}
					if (event.comment != "undefined" && event.comment !== '') {
						dataContent += '<div>' + '<label>Σχόλιο:</label> ' + event.comment + '</div>';
					}
					if (event.examId != "undefined" && event.examId !== '') {
						dataContent += '<div>' + '<label>Εξάμηνο:</label> ' + examIdToString(event.examId) + '</div>';
					}
					if (event.courseData.instructors != "undefined" && event.courseData.instructors !== '' && event.courseData.instructors !== '-') {
						dataContent += '<div>' + '<label>Διδάσκων:</label> ' + getTeacherLinks(event.staffData, $scope.selectedPeriod) + '</div>';
					}
					if (event.roomData.name != "undefined" && event.roomData.name !== '') {
						dataContent += '<div>' + '<label>Χώρος:</label> ' + '<a target="_blank" href="/#/room/' + event.roomData.id + '" role="button">' + event.roomData.name + '</a> ' + '</div>';
					}
					if (event.duration != "undefined" && event.duration !== '') {
						dataContent += '<div>' + '<label>Διάρκεια:</label> ' + event.duration + '</div>';
					}
					if (event.unitName) {
						if ($scope.selectedUnit == event.unitId){
							dataContent += '<div>' + '<label>Τμήμα:</label> ' + event.unitName + '</div>';
						}
						else {
							dataContent += '<div><strong>' + '<label>Τμήμα:</label> *' + event.unitName + '*</strong></div>';
						}

					}
					if (event.typeId) {
						dataContent += '<div>' + '<label>Τύπος:</label> ' + $scope.eventTypes[event.typeId-1] + '</div>';
					}
					if (event.status) {
						var status = "<font color='green'>Ενεργή</font>";
						if (event.status == "pending"){
							status = "<font color='gray'>Εκκρεμής</font>";
						}
						else if(event.status == "rejected"){
							status = "<font color='red'>Απορρίφθηκε</font>";
						}

						dataContent += '<div>' + '<label>Κατάσταση:</label> ' + status + '</div>';
					}

					// If the event is a lesson, swap to code,
					// else, swap to the title again (...)
					var event_content = "";
					if (event.courseCode) {
						event_content = '<span class="event_title">' + event.title + '</span><span class="event_code">' + event.courseCode + '</span>';
					} else {
						event_content = '<span class="event_title">' + event.title + '</span><span class="event_code">' + event.title + '</span>';
					}

             	   if (requestedPath == "/reservations") {
              	   		event.date = Math.round(new Date(event.start).getTime()/1000);
              	   		// check that buttons are available if selected unit is equal to event's unit
              	   		if ($scope.selectedUnit == event.unitId){ // can edit
	  	   			   	 	if (event.typeId<3) {
		                  		dataContent += '<button title="Διόρθωση" type="button" data-title='+event.title+' data-date='+event.date+' data-event-id='+event.id+' class="btn btn-edit btn-primary btn-sm"><span class="glyphicon glyphicon-pencil"></span></button>&nbsp';
	              		     	dataContent += '<button title="Διαγραφή" type="button" data-event-id='+event.id + ' class="btn btn-danger btn-sm btn-delete"><span class="glyphicon glyphicon-trash"></span></button>';
	              			}
	              			else {
	                    		dataContent += '<button title="Επαναφορά" type="button" data-event-id='+event.id + ' class="btn btn-warning btn-sm btn-delete">Επαναφορά</button>';
	                    	}
	                    	if (event.typeId == 1){
	                    		dataContent += ' <button title="Ακύρωση" type="button" data-event-id='+event.id + ' class="btn btn-default btn-sm btn-cancel"><span class="glyphicon glyphicon-remove"></span></button>';
	                    	}
              	   		}
              	   		else { // accept or reject
              	   			if (event.status=='pending'){
              	   				dataContent += ' <button title="Αποδοχή" type="button" data-event-id='+event.id + ' class="btn btn-default btn-sm btn-success acceptEvent">Αποδοχή</button>';
              	   				dataContent += ' <button title="Απόρριψη" type="button" data-event-id='+event.id + ' class="btn btn-default btn-sm btn-danger rejectEvent">Απόρριψη</button>';
              	   			}
              	   			else if (event.status=='active'){
              	   				dataContent += ' <button title="Απόρριψη" type="button" data-event-id='+event.id + ' class="btn btn-default btn-sm btn-danger rejectEvent">Απόρριψη</button>';
              	   			}
          	   				else if (event.status=='rejected'){
              	   				dataContent += ' <button title="Αποδοχή" type="button" data-event-id='+event.id + ' class="btn btn-default btn-sm btn-success acceptEvent">Αποδοχή</button>';
              	   			}

              	   		}

                	}

					element.find('.fc-title').html(event_content);
					element.attr({
						'data-event-type' : event.typeId,
						'data-toggle' : 'popover',
						'data-trigger' : 'manual',
						'data-html' : 'true',
						'data-container' : 'body',
						'data-title' : event.courseData.courseId < 5 ? $scope.courseTypes[event.courseData.courseId] :event.title,
						'data-date' : event.date,
						'data-event-id' : event.id,
						'data-code' : event.courseCode,
						'data-content' : dataContent,
						'data-placement' : 'top',
						'data-exam' : event.examId
					});

					element.popover({
						html : true
					}).on("mouseenter", function(ev) {
						var self = this;
						$(this).popover("show");
						$(".popover").on("mouseleave", function() {
							$(self).popover('hide');
						});
						$(".btn-delete").click(function() {
							var id = $(this).attr('data-event-id');
							//
							var courseTitle = event.title;
							if (event.courseData.courseId < 5){ // εκδήλωση, συνέλευση, δημόσια υποστήριξη, e.t.c.
								// if (event.courseData.courseId == 0)
									// courseTitle = "Εκδήλωση";
								// else if (event.courseData.courseId == 1)
									// courseTitle = "Συνέλευση";
								// else if (event.courseData.courseId == 2)
									// courseTitle = "Δημόσια Υποστήριξη";
								courseTitle = $scope.courseTypes[event.courseData.courseId];
							}
							//
							var sections = "";
							angular.forEach(event.classsections, function(value, key) {
		    					sections+=value.secname + ", ";
							});
							if (sections.length > 1){
								sections = sections.substr(0, sections.length-2);
							}
							//
							var roomName = "";
							if (event.roomData.name != "undefined" && event.roomData.name !== '') {
								roomName = '<a target="_blank" href="/#/room/' + event.roomData.id + '" role="button">' + event.roomData.name + '</a> ' + '</div>';
							}
							//
							// console.log(event.id);
							$scope.deleteEvent(id, courseTitle, sections, event.courseData.instructors, event.comment, roomName, event.roomData.id, $scope.selectedPeriodText, event.typeId, event.start.format("DD-MM-YYYY"), event.dayId, event.hourId, event.minutes, event.duration, event.courseData.courseId);
						});
						$(".btn-edit").click(function() {
							$scope.editEvent(event);
						});
						$(".btn-cancel").click(function() {
							var id = $(this).attr('data-event-id');
							//
							$scope.cancelEvent(event);
						});
						$(".acceptEvent").click(function() {
							var id = $(this).attr('data-event-id');
							//
							$scope.acceptEvent(id);
						});
						$(".rejectEvent").click(function() {
							var id = $(this).attr('data-event-id');
							// Here call popup first // modify 10-Aug-2018
							$scope.loadRejectModal(id);
							//
							// $scope.rejectEvent(id);
						});
					}).on('mouseleave', function() {
						var self = this;
						setTimeout(function() {
							if (!$(".popover:hover").length) {
								$(self).popover("hide");
							}
						}, 60);
					});
				},
                dayClick: function(date, jsEvent, view) { // popup opens when clicking on day

                  	$("[data-toggle='popover']").popover('hide');
                	$scope.nowDate = date.format("YYYY-MM-DD");
          	 		// console.log($scope.nowDate);
				    var h = addZero(date.format("H"));
				    var m = addZero(date.format("m"));
				    $scope.nowTime = h + ":" + m ;
				    $('.clockpicker').clockpicker({
					    placement: 'bottom',
					    align: 'left',
					    donetext: 'Επιλογή',
					    autoclose: true
					});
					//
					var durationHours = Array.from(Array(13).keys());
				    $("#durationHours").select2({
				      data: durationHours
				    });
				    $("#durationHours").select2("val", "1"); // set default value
				    var durationMinutes = [0, 10, 20, 30, 40, 50, 60];
					$("#durationMinutes").select2({
				      data: durationMinutes
				    });


					var calendar = uiCalendarConfig.calendars.calendar;
         	    	var inactive = false;
         	    	// console.log(date);
                  	var nameVacation = $scope.checkIfHoliday(date);
                  	if (nameVacation!=""){
                  		inactive = true;
              		}

                 	if(inactive == false){
                    	// get courses-classses, class sections, class teachers
	                    $("#classSection option[value]").remove();
	                 	$("#classTeachers option[value]").remove();
						$("#reservationReason").select2({
							placeholder: 'Επιλέξτε λόγο κράτησης'
						});
					    $("#classSection").select2({
					      placeholder: 'Επιλέξτε Τμήμα',
					      allowClear: true
					    });
			    	   	$('#classSection').on('change', function() {
					    	$scope.selectedClassSections = $('#classSection').val();
						});

		    		    $("#classTeachers").select2({
					      placeholder: 'Επιλέξτε Υπεύθυνο',
					      allowClear: true
					    });
					    $('#classTeachers').on('change', function() {
					    	$scope.selectedClassTeachers = $('#classTeachers').val();
						});
                   		$("#reservationReason").on("change", function () {
				    	var selectedClassId = $scope.courses[$(this).val()].classID;
			    	   	var selectedCourseId = $scope.courses[$(this).val()].courseID;
				    	// console.log("selected classid: "+ selectedClassId);

				      	/////////// get class sections ///////////////
				      	var selectedClassDivIds = [];
				      	// console.log(selectedClassId);
				      	$http.get("/calendar/getClassSections/" + selectedClassId).then(
		        		function(response) {
		        			var rangeOptions = [];
			        		var classdivs = response.data;

		    				angular.forEach(classdivs, function(value, key) {
		    					var option = new Option(value.secname, value.secnum);
							 	rangeOptions.push(option);
							 	selectedClassDivIds.push(value.secnum);
							});
//
							 $("#classSection option[value]").remove();
							 $("#classSection").append(rangeOptions).val("").trigger("change");
							 $('#classSection').val(selectedClassDivIds);
							 $('#classSection').trigger('change');
//
			            }, function(response) {
			        		$scope.error_classsections = "Error while getting class section data!";
							$scope.loading = false;
			    	 	});
			    	 	/////////// get class teachers ///////////////
			    	 	var selectedClassTeacherIds = [];
			    	 	$http.get("/calendar/getTeachersForCourse/" + selectedCourseId + "/" + $scope.currentYear + "/" + $scope.selectedPeriod).then(
			        		function(response) {
			        			var rangeOptions = [];
				        		var classteachers = response.data;
			    				angular.forEach(classteachers, function(value, key) {
			    					var option = new Option(value.name, value.staffID);
								 	rangeOptions.push(option);
								 	selectedClassTeacherIds.push(value.staffID);
								});
								 $("#classTeachers option[value]").remove();
								 $("#classTeachers").append(rangeOptions).val("").trigger("change");
								 $('#classTeachers').val(selectedClassTeacherIds);
								 $('#classTeachers').trigger('change');

				            }, function(response) {
				        		$scope.error_classsections = "Error while getting class teachers data!";
								$scope.loading = false;
			    	 	});
			    	 	/////////// get class teachers ///////////////
				    });
           		   	/////////// get department rooms ///////////////
                	var reservationDateDiv = document.getElementById("reservationDate");
                  	var reservationDateDiv2 = document.getElementById("reservationDate2");
                    reservationDateDiv.style.display = "none";
             		reservationDateDiv2.style.display = "none";
             		// if period in 1,2 then enabled all typeSelect options otherwise disable repeated option
             		if ($scope.selectedPeriod > 2){
             			 $('#typeSelect').val(2);
						 $('#typeSelect').trigger('change');
						 $("#typeSelect").prop("disabled", true);
				 	 	 reservationDateDiv.style.display = "block";
        		 		 // $('#repeated').prop('disabled', !$('#repeated').prop('disabled'));
         		 	}

           		   	$('#typeSelect').on('change', function() {
				      $scope.selectedType =  $('#typeSelect').val()
				      if ($scope.selectedType == 2){
				      	 reservationDateDiv.style.display = "block";
			      	 	 reservationDateDiv2.style.display = "none";
				      }
				      if ($scope.selectedType == 1){
				      	 reservationDateDiv.style.display = "none";
				      	 reservationDateDiv2.style.display = "block";
				      }
			      	});
                    // getRoomListForUnit($scope.selectedUnit);
					//
					var unitsdata = $.map($scope.univUnits, function (obj) {
						obj.text = obj.text || obj.name; // replace name with the property used for the text
						return obj;
					});
                    $('#unitsSelectAdd').select2({
					  disabled : true,
					  placeholder: "Επιλέξτε Μονάδα",
					  data: unitsdata
					});
					$('#unitsSelectAdd').val($scope.selectedUnit);
					$('#unitsSelectAdd').trigger('change'); // Notify any JS components that the value changed
					//
					$('#periodSelectAdd').select2({
					  disabled : true,
					  placeholder: "Επιλέξτε Περίοδο",
					  data: $scope.periods
					});
					$('#periodSelectAdd').val($scope.selectedPeriod);
					$('#periodSelectAdd').trigger('change'); // Notify any JS components that the value changed

					$('#classRoom').val("");
					$('#classRoom').trigger('change');

		 		    angular.element(document.querySelector('#roomBusy')).hide();
                 	// angular.element(document.querySelector('#addReservation')).modal('show');

					angular.element(document.querySelector('#addOutOfPeriodScope')).hide();
					angular.element(document.querySelector('#fieldsError')).hide();
                 	$('#addReservation').modal('show');
                  }
                  else {
                    alert("Η ημέρα είναι αργία: "+nameVacation);
                  }
             	},
                eventClick: function(event, jsEvent, view) {
                	// should be able to click on that only if the same unit is selected
                  	if ($scope.selectedUnit == event.unitId)
                		$scope.editEvent(event);
                },

				height : "auto"
			}
		};


   		$scope.loadRejectModal = function(id){
   			$scope.rejectionEventId = id;
			angular.element(document.getElementById("rejectMsgWarning").innerHTML = "");
			angular.element(document.querySelector('#rejectModal')).modal('show');
   		};

		$('.modal').on('hidden.bs.modal', function(){
			$('#typeSelect').val(-1);
			$('#typeSelect').trigger('change');
			$("#reservationForm")[0].reset();
			$(this).data('bs.modal', null);
		 });

        function format(date) {
          date = new Date(date);

          var day = ('0' + date.getDate()).slice(-2);
          var month = ('0' + (date.getMonth() + 1)).slice(-2);
          var year = date.getFullYear();
          return year + '-' + month + '-' + day;
        }

        /* Οι γενικές αργίες και οι αργίες του συγκεκριμένου τμήματος.
        */
        function getHolidays(){
          var unitsUrl = "/calendar/getInactiveDates";
          $scope.holidays.length = 0;
          $http.get(unitsUrl).then(function(response) {
              var holidays = formatHolidayData(response.data);
              for (var i = 0; i < holidays.length; i++) {
                var object={
                  title: holidays[i].name,
                  start: holidays[i].startDate,
                  end:  holidays[i].endDate,
                  allDay:true,
                  color:"red",
                  rendering: 'background'
                }
                $scope.holidays.push(object);
              }
          }, function() {
            console.error('Could not fetch inactive dates data!');
          });
          var unitsUrl = "/calendar/getInactiveDatesForDepartment/"+$scope.selectedUnit;
          $http.get(unitsUrl).then(function(response) {
              var holidays = formatHolidayData(response.data);
              for (var i = 0; i < holidays.length; i++) {
                var object={
                  title: holidays[i].name,
                  start: holidays[i].startDate,
                  end: holidays[i].endDate,
                  allDay:true,
                  color:"red",
                  rendering: 'background'
                }
                $scope.holidays.push(object);
              }
          }, function() {
            console.error('Could not fetch unit data for the dropdown!');
          });
          // console.log($scope.holidays);
          return $scope.holidays;
        }

        function formatHolidayData(holidays) {
            var newUnits = [];
            holidays.forEach(function(faculty, index, array) {
                newUnits.push(faculty);
            });
            return newUnits;
        }
        // If detect mobile screen force calendar default view to dateAgenda
        // if ($window.innerWidth / $window.innerHeight < 0.75 || $window.innerWidth < 600) {
          // $scope.uiConfig.calendar.defaultView = 'eventDay';
          // $scope.uiConfig.calendar.header.right = '';
          // $("#collapseSettings").collapse('hide');
          // $scope.mobile = true;
        // } @TODO


        //Get All the classes of the selected unit from selected period and year
        function getClasses() {
        	// console.log($scope.currentYear);
  	        $http.get("/calendar/getClassesForDepartment/" + $scope.selectedUnit + "/"+ $scope.currentYear + "/" + $scope.selectedPeriod).then(
            function(response) {
                $scope.courses = response.data;
                //
				var coursesData = $.map($scope.courses, function (obj, index) {
					if (obj.coursecode)
						obj.text = obj.coursetitle + "(" + obj.coursecode + ")";
					else
						obj.text = obj.coursetitle;
					obj.id =  index; // replace pk with your identifier
					return obj;
				});

      	  		$('#reservationReason').select2({
					placeholder: "Επιλέξτε λόγο κράτησης",
	 				data: coursesData
				});

      	  		$('#reservationReasonOnEdit').select2({
					placeholder: "Επιλέξτε λόγο κράτησης",
	 				data: coursesData
				});
				// console.log(coursesData);

            }, function () {
              console.error('Could not fetch classes data!');
              $scope.loading = false;
            }
        );
       }

      	function getRoomListForUnit(unitId) {
			$http.get("/calendar/getGisRoomFavoriteForDepartment/" + unitId).then(
	        	function(response) {
	        		$scope.rooms = response.data;
	        		// units select2
					var roomsData = $.map($scope.rooms, function (obj) {
						obj.text = obj.text || obj.name; // replace name with the property used for the text
						obj.id = obj.roomId;
						return obj;
					});
					$('#classRoom').select2({
					  placeholder: "Επιλέξτε Αίθουσα",
					  // allowClear: true,
					  data: roomsData
					});

					$('#classRoomOnEdit').select2({
					  placeholder: "Επιλέξτε Αίθουσα",
					  // allowClear: true,
					  data: roomsData
					});
			    }, function(response) {
	        		$scope.error_rooms = "Error while getting university room data!";
					$scope.loading = false;
	    	 });
       	}

		$scope.showImportForm = function () {
			angular.element(document.querySelector('#importReservations')).modal('show');
		}

		// add calendarEvent
	    $scope.add = function() {

    		// Validations
			angular.element(document.getElementById("commentWarning").innerHTML = "");
			angular.element(document.getElementById("reservationDateWarning").innerHTML = "");
			angular.element(document.getElementById("reservationDate2Warning").innerHTML = "");
			angular.element(document.querySelector('#addOutOfPeriodScope')).hide();
			angular.element(document.querySelector('#fieldsError')).hide();

			var status = "active";
			if ($scope.selectedType == 2){ // Έκτακτη
				if ($scope.reservationDate == "" || !checkDate($scope.reservationDate)){
					document.getElementById("reservationDateWarning").innerHTML = '<font color="red">Η ημερομηνία δεν είναι σωστή!</font>';
					return;
				}
				// check if selected date is in period scope (between selectedPeriodStartDate and selectedPeriodEndDate)
				if ($scope.reservationDate!=""){
					var reservationDateReverse = $scope.reservationDate.substring(6,10) + "-" + $scope.reservationDate.substring(3,5) + "-" + $scope.reservationDate.substring(0,2);
					if (reservationDateReverse < $scope.selectedPeriodStartDate || reservationDateReverse >  $scope.selectedPeriodEndDate){
						angular.element(document.querySelector('#addOutOfPeriodScope')).show();
						return;
					}
				}
			}

			if ($scope.selectedType == 1){ // Τακτική
				if(!document.getElementById("daySelect").value){
					document.getElementById("reservationDate2Warning").innerHTML = '<font color="red">Δεν έχετε επιλέξει ημέρα!</font>';
					return;
				}
				if(!document.getElementById("comment").value){
					document.getElementById("commentWarning").innerHTML = '<font color="red">Δεν έχετε συμπληρώσει τα σχόλια της κράτησης!</font>';
					return;
				}
			}

			var url = "/admin/createEvent";
			try {
				var data = {
					'date' : $scope.reservationDate,
					'unitId' : $scope.selectedUnit,
					'dayId': document.getElementById("daySelect").value,
					'hourId' : document.getElementById('tick').value.substring(0,2),
					'minutes' : document.getElementById('tick').value.substring(3,5),
					'roomId': document.getElementById('classRoom').value,
					'courseId': $scope.courses[document.getElementById('reservationReason').value].courseID,
					'classId': $scope.courses[document.getElementById('reservationReason').value].classID,
					'periodTypeId': $scope.selectedPeriod,
					'durationHours': document.getElementById('durationHours').value,
					'durationMinutes': document.getElementById('durationMinutes').value,
					'typeId':  $scope.selectedType,
					'status': status,
					'comment': document.getElementById('comment').value,
					'year': $scope.currentYear,
					'selectedPeriodStartDate': $scope.selectedPeriodStartDate,
					'selectedPeriodEndDate': $scope.selectedPeriodEndDate,
					'classSections' : $scope.selectedClassSections,
					'classTeachers' : $scope.selectedClassTeachers
				};
			} catch (error) {
				angular.element(document.querySelector('#fieldsError')).show();
				return;
			}

			// console.log(data);
			$http.post(url, data).success(function(data) {
				// alert(data);
	 			if (data){ // data is true (reservation added)
					angular.element(document.querySelector('#addSuccess')).show();
					setTimeout(function() {
				    	angular.element(document.querySelector('#addSuccess')).hide();
			    		// if Success close modal window
				    	angular.element(document.querySelector('#addReservation')).modal('hide');
				    	$scope.getCalendarEvents();
			    	}, 3000);
	 			}
	 			else {
	 				angular.element(document.querySelector('#roomBusy')).show();
	 				setTimeout(function() {
	 					angular.element(document.querySelector('#roomBusy')).hide();
 					}, 3000);
 				}
		 	}).error(function(error) {
		 		// alert(error);
		 		//alert("Υπήρξε πρόβλημα με την δημιουργία νέας κράτησης!");
				angular.element(document.querySelector('#addError')).show();
				setTimeout(function() {
					angular.element(document.querySelector('#addError')).hide();
			    }, 3000);
			});


	    };


	    $scope.calculateRepeatedDates = function(courseId, hourId, minutes, roomId){
	   		var datesArray = [];
			var cancelledDatesArray = [];

    		angular.forEach($scope.eventSources[0], function(value, key) {
    			if (value['courseData'].courseId == courseId && value['hourId'] == hourId && value['minutes'] == minutes && value['roomData'].id == roomId){ // should not compare with eventId because the canceled events hove other eventId @TODO tofix
    				var stringDate = value['start'].substr(0,10);
    				// console.log(value['typeId']);
    				if (value['typeId']==3){
    					cancelledDatesArray.push("<option>" + stringDate.substr(8,10) + "-" + stringDate.substr(5,2) + "-" + stringDate.substr(0,4) +"</option>");
    				}
    				else {
	   					datesArray.push("<option>" + stringDate.substr(8,10) + "-" + stringDate.substr(5,2) + "-" + stringDate.substr(0,4) +"</option>");
   					}
				}
			});
			// var list = $('#repeatedDatesSelect').select2({
			// placeholder: "Ακυρωμένες ημερομηνίες",
			// data:datesArray,
		 	// minimumResultsForSearch: Infinity,
			// dropdownParent: $('#mydates'),
			// // allowClear: true,
	  	    // closeOnSelect: false,
			// }).on("select2:closing", function(e) {
			  // e.preventDefault();
			// }).on("select2:closed", function(e) {
			  // list.select2("open");
			// });
			// list.select2("open");
			$scope.repeatedDates = datesArray;
			$scope.cancelledDates = cancelledDatesArray;
	    }

	    $scope.editEvent = function(event){
	    	$scope.selectedEventId = event.id;
	    	$scope.selectedType = event.typeId;
	    	document.getElementById("editReservationTitle").innerHTML = "Διόρθωση κράτησης";
	    	document.getElementById("periodOnEdit").innerHTML = $scope.selectedPeriodText;
	    	document.getElementById("typeOnEdit").innerHTML = $scope.eventTypes[event.typeId-1];
    		// var myDatesOnEdit = document.getElementById("mydatesOnEdit");
	    	///////////// get department courses for unit and period ///////////////
	    	angular.forEach($scope.courses, function(value, key) {
				if (value.courseID == event.courseData.courseId){
					$('#reservationReasonOnEdit').val(value.id);
					$('#reservationReasonOnEdit').trigger('change');
				}
			});
			/////////// LOAD EXISTING VALUES //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 		/////////// get class sections //////////////////
 		  	$("#sectionsOnEdit").select2({
			      placeholder: 'Επιλέξτε Τμήμα',
			      allowClear: true
	    	});
	    	var selectedClassDivIds = [];
	      	angular.forEach(event.classsections, function(value, key) {
				 selectedClassDivIds.push(value.secnum);
			});
			$('#sectionsOnEdit').on('change', function() {
		    	$scope.selectedClassSections = $('#sectionsOnEdit').val();
			});
	      	$http.get("/calendar/getClassSections/" + event.courseData.classId).then(
      		function(response) {
    			var rangeOptions = [];
        		var classdivs = response.data;

				angular.forEach(classdivs, function(value, key) {
					var option = new Option(value.secname, value.secnum);
				 	rangeOptions.push(option);
				});

				$("#sectionsOnEdit option[value]").remove();
				$("#sectionsOnEdit").append(rangeOptions).val("").trigger("change");
				$('#sectionsOnEdit').val(selectedClassDivIds);
				$('#sectionsOnEdit').trigger('change');
				$scope.selectedClassSections = selectedClassDivIds;

            }, function(response) {
        		$scope.error_classsections = "Error while getting class section data!";
				$scope.loading = false;
    	 	});
    	 	/////////// get class teachers ///////////////
		    $("#classTeachersOnEdit	").select2({
		      placeholder: 'Επιλέξτε Υπεύθυνο',
		      allowClear: true
		    });
    	 	var selectedClassTeacherIds = [];
    	 	angular.forEach(event.staffData, function(value, key) {
				 selectedClassTeacherIds.push(value.staffId);
			});
	  	    $('#classTeachersOnEdit').on('change', function() {
		    	$scope.selectedClassTeachers = $('#classTeachersOnEdit').val();
			});
    	 	$http.get("/calendar/getTeachersForCourse/" + event.courseData.courseId + "/" + $scope.currentYear + "/" + $scope.selectedPeriod).then(
 			function(response) {
        			var rangeOptions = [];
	        		var classteachers = response.data;
	        		angular.forEach(classteachers, function(value, key) {
    					var option = new Option(value.name, value.staffID);
					 	rangeOptions.push(option);
					});
					$("#classTeachersOnEdit option[value]").remove();
					$("#classTeachersOnEdit").append(rangeOptions).val("").trigger("change");
					$('#classTeachersOnEdit').val(selectedClassTeacherIds);
					$('#classTeachersOnEdit').trigger('change');
	            }, function(response) {
	        		$scope.error_classsections = "Error while getting class teachers data!";
					$scope.loading = false;
    	 	});

	 		// Get new staff & section values on class change
	 		$("#reservationReasonOnEdit").on("change", function () {
				var selectedClassId = $scope.courses[$(this).val()].classID;
	    	   	var selectedCourseId = $scope.courses[$(this).val()].courseID;

	    	   	/////////// get new class sections ///////////////
		      	var selectedClassDivIds = [];
		      	// console.log(selectedClassId);
		      	$http.get("/calendar/getClassSections/" + selectedClassId).then(
        		function(response) {
        			var rangeOptions = [];
	        		var classdivs = response.data;

    				angular.forEach(classdivs, function(value, key) {
    					var option = new Option(value.secname, value.secnum);
					 	rangeOptions.push(option);
					 	selectedClassDivIds.push(value.secnum);
					});
//
					 $("#sectionsOnEdit option[value]").remove();
					 $("#sectionsOnEdit").append(rangeOptions).val("").trigger("change");
					 $('#sectionsOnEdit').val(selectedClassDivIds);
					 $('#sectionsOnEdit').trigger('change');
//
	            }, function(response) {
	        		$scope.error_classsections = "Error while getting class section data!";
					$scope.loading = false;
	    	 	});
   	    	 	/////////// get class teachers ///////////////
	 			var selectedClassTeacherIds = [];
	    	 	$http.get("/calendar/getTeachersForCourse/" + selectedCourseId + "/" + $scope.currentYear + "/" + $scope.selectedPeriod).then(
	        		function(response) {
	        			var rangeOptions = [];
		        		var classteachers = response.data;
	    				angular.forEach(classteachers, function(value, key) {
	    					var option = new Option(value.name, value.staffID);
						 	rangeOptions.push(option);
						 	selectedClassTeacherIds.push(value.staffID);
						});
						 $("#classTeachersOnEdit option[value]").remove();
						 $("#classTeachersOnEdit").append(rangeOptions).val("").trigger("change");
						 $('#classTeachersOnEdit').val(selectedClassTeacherIds);
						 $('#classTeachersOnEdit').trigger('change');

		            }, function(response) {
		        		$scope.error_classsections = "Error while getting class teachers data!";
						$scope.loading = false;
	    	 	});

    	   	});
    	 	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    	 	// Comments
    	 	$scope.commentOnEdit = event.comment;
    	 	// Rooms
    	 	angular.forEach($scope.rooms, function(value, key) {
				if (value.id == event.roomData.id){
					$('#classRoomOnEdit').val(value.id);
					$('#classRoomOnEdit').trigger('change');
				}
			});
			// DATE
		    $('#daySelectOnEdit').select2({
			  placeholder: "Επιλέξτε Ημέρα",
			  data: $scope.weekDays
			});
    	 	// Reservation Date for type == 2
    	 	var reservationDateOnEditDiv = document.getElementById("reservationDateOnEdit");
    	 	reservationDateOnEditDiv.style.display = "none";
    	 	// Reservation Date for type == 1
			var reservationDateOnEdit2Div = document.getElementById("reservationDateOnEdit2");
    	 	reservationDateOnEdit2Div.style.display = "none";

    	 	$scope.eventDate = event.start.format("YYYY-MM-DD");

	 	 	if (event.typeId == 2){
	 	 		reservationDateOnEditDiv.style.display = "block";
				reservationDateOnEdit2Div.style.display = "none";
				// myDatesOnEdit.style.display = "none";
				angular.element(document.querySelector('#reservationDateOnEditDiv')).show();
				angular.element(document.querySelector('#reservationDateOnEdit2Div')).hide();
		  	}
		    if (event.typeId == 1){
		    	$('#daySelectOnEdit').val($scope.weekDays[event.dayId-1].id);
				$('#daySelectOnEdit').trigger('change');
				reservationDateOnEditDiv.style.display = "none";
				reservationDateOnEdit2Div.style.display = "block";
				// myDatesOnEdit.style.display = "block";
				//
				// $scope.calculateRepeatedDates(event.courseData.courseId, event.start.format("H"), event.start.format("m"), event.roomData.id);
				// var innerSelectRepeatedDatesHtml="";
				// console.log($scope.repeatedDates);
				// angular.forEach($scope.repeatedDates, function(value, key) {
					// innerSelectRepeatedDatesHtml+= value;
				// });
				// document.getElementById("repeatIdOnEdit").innerHTML = innerSelectRepeatedDatesHtml;
				// var innerSelectCancelledDatesHtml="";
				// angular.forEach($scope.cancelledDates, function(value, key) {
					// innerSelectCancelledDatesHtml+= value;
				// });
				// document.getElementById("cancelledIdOnEdit").innerHTML = innerSelectCancelledDatesHtml;
				//
				angular.element(document.querySelector('#reservationDateOnEditDiv')).hide();
				angular.element(document.querySelector('#reservationDateOnEdit2Div')).show();
		  	}
			// HOUR
			var hour = addZero(event.start.format("H"));
		  	var minutes = addZero(event.start.format("m"));
			$scope.nowTime = hour + ":" + minutes;
	    	$('.clockpicker').clockpicker({
				    placement: 'bottom',
				    align: 'left',
				    donetext: 'Επιλογή',
				    autoclose: true
			});
			// DURATION
			var durationHoursOnEdit = Array.from(Array(13).keys());
	    	$("#durationHoursOnEdit").select2({
		     	data: durationHoursOnEdit
			});
			$('#durationHoursOnEdit').val(event.durationHours);
			$('#durationHoursOnEdit').trigger('change');
			//
			var durationMinutesOnEdit = [0, 10, 20, 30, 40, 50, 60];
			$("#durationMinutesOnEdit").select2({
			  data: durationMinutesOnEdit
		    });
		    $('#durationMinutesOnEdit').val(event.durationMinutes);
			$('#durationMinutesOnEdit').trigger('change');

    	 	angular.element(document.querySelector('#roomBusyOnEdit')).hide();
		    angular.element(document.querySelector('#editoutOfPeriodScope')).hide();
			angular.element(document.querySelector('#editReservation')).modal('show');
	    }

    	$scope.deleteEvent = function(eventId, title, sections, instructors, comments, roomName, roomId, period, typeId, date, day, hourId, minutes, duration, courseId) {
			$scope.selectedEventId = eventId;
			document.getElementById("eventTitleOnDelete").innerHTML = title;
			document.getElementById("sectionsOnDelete").innerHTML = sections;
			document.getElementById("instructorsOnDelete").innerHTML = instructors;
			document.getElementById("commentsOnDelete").innerHTML = comments;
			document.getElementById("roomOnDelete").innerHTML = roomName;
			document.getElementById("periodOnDelete").innerHTML = period;
			document.getElementById("typeOnDelete").innerHTML = $scope.eventTypes[typeId-1];
			document.getElementById("deleteReservationTitle").innerHTML = "Διαγραφή κράτησης";

			var myDates = document.getElementById("mydates");

			if (typeId == 1) {
				$scope.calculateRepeatedDates(courseId, hourId, minutes, roomId);
				var innerSelectRepeatedDatesHtml="";
				angular.forEach($scope.repeatedDates, function(value, key) {
					innerSelectRepeatedDatesHtml+= value;
				});
				document.getElementById("repeatId").innerHTML = innerSelectRepeatedDatesHtml;
				var innerSelectCancelledDatesHtml="";
				angular.forEach($scope.cancelledDates, function(value, key) {
					innerSelectCancelledDatesHtml+= value;
				});
				document.getElementById("cancelledId").innerHTML = innerSelectCancelledDatesHtml;
				// console.log($scope.cancelledDates);
				document.getElementById("dayOnDelete").innerHTML = $scope.weekDays[day-1].text;
				angular.element(document.querySelector('#reservationDateDelete')).hide();
				angular.element(document.querySelector('#reservationDateDelete2')).show();
				myDates.style.display = "block";
				$("#submitDelete").show();
				$("#submitRestore").hide();
				// ---------------------------------------------------------------------------
				angular.element(document.querySelector('#reservationDateDelete2')).show();
			}
			else if (typeId == 2) {
				document.getElementById("dateOnDelete").innerHTML = date;
				angular.element(document.querySelector('#reservationDateDelete')).show();
				angular.element(document.querySelector('#reservationDateDelete2')).hide();
				myDates.style.display = "none";
				$("#submitDelete").show();
				$("#submitRestore").hide();

			}
			else if (typeId == 3){
				document.getElementById("deleteReservationTitle").innerHTML = "Επαναφορά κράτησης";
				// console.log(date);
				document.getElementById("dayOnDelete").innerHTML = $scope.weekDays[day-1].text + " (" + date +")"; // plus selected date
				angular.element(document.querySelector('#reservationDateDelete')).hide();
				angular.element(document.querySelector('#reservationDateDelete2')).show();
				myDates.style.display = "none";
				$("#submitDelete").hide();
				$("#submitRestore").show();
			}

			document.getElementById("hourOnDelete").innerHTML = addZero(hourId) + ":"+ addZero(minutes);
			document.getElementById("durationOnDelete").innerHTML = duration;

			angular.element(document.querySelector('#deleteReservation')).modal('show');
    	}

		// edit calendarEvent
	    $scope.edit = function() {
	    	// Validations
			angular.element(document.getElementById("commentWarningOnEdit").innerHTML = "");
			angular.element(document.getElementById("durationOnEditWarning").innerHTML = "");
			angular.element(document.getElementById("reservationDateOnEditWarning").innerHTML = "");
			angular.element(document.getElementById("reservationDateOnEdit2Warning").innerHTML = "");
			angular.element(document.querySelector('#editOutOfPeriodScope')).hide();

			var status = "active";
			if ($scope.selectedType == 2){ // Έκτακτη
				if ($scope.reservationDateOnEdit == "" || !checkDate($scope.reservationDateOnEdit)){
					document.getElementById("reservationDateOnEditWarning").innerHTML = '<font color="red">Η ημερομηνία δεν είναι σωστή!</font>';
					return;
				}
				// Check if reservationDateOnEdit is in holidays scope
				var myDate = $scope.reservationDateOnEdit.substring(6,10) + "-" + $scope.reservationDateOnEdit.substring(3,5) + "-" + $scope.reservationDateOnEdit.substring(0,2);
				for(var i=0;i<$scope.holidays.length;i++){
					if(myDate===format($scope.holidays[i].start)){ // single date
						// fill warning
						document.getElementById("reservationDateOnEditWarning").innerHTML = '<font color="red">Η ημερομηνία είναι αργία: ' + $scope.holidays[i].title + '</font>';
		                return;
                  	}
                  	if(myDate > format($scope.holidays[i].start) && myDate<=format($scope.holidays[i].end)){ // date in scope
                  		document.getElementById("reservationDateOnEditWarning").innerHTML = '<font color="red">Η ημερομηνία είναι αργία: ' + $scope.holidays[i].title + '</font>';
                 		return;
                	}
				}

				// check if selected date is in period scope (between selectedPeriodStartDate and selectedPeriodEndDate)
				if ($scope.reservationDateOnEdit!=""){
					var reservationDateReverse = $scope.reservationDateOnEdit.substring(6,10) + "-" + $scope.reservationDateOnEdit.substring(3,5) + "-" + $scope.reservationDateOnEdit.substring(0,2);
					if (reservationDateReverse < $scope.selectedPeriodStartDate || reservationDateReverse >  $scope.selectedPeriodEndDate){
						angular.element(document.querySelector('#editOutOfPeriodScope')).show();
						return;
					}
				}
			}

			if ($scope.selectedType == 1){ // Τακτική
				if(!document.getElementById("daySelectOnEdit").value){
					document.getElementById("reservationDateOnEdit2Warning").innerHTML = '<font color="red">Δεν έχετε επιλέξει ημέρα!</font>';
					return;
				}
				if(!document.getElementById("commentOnEdit").value){
					document.getElementById("commentWarningOnEdit").innerHTML = '<font color="red">Δεν έχετε συμπληρώσει τα σχόλια της κράτησης!</font>';
					return;
				}
			}
			// Duration should not be zero
			if (document.getElementById('durationHoursOnEdit').value == 0 && document.getElementById('durationMinutesOnEdit').value == 0){
				document.getElementById("durationOnEditWarning").innerHTML = '<font color="red">Η διάρκεια της κράτησης δε μπορεί να είναι μηδενική!</font>';
				return;
			}

	    	var url = "/admin/editEvent";
			var data = {
				'id' : $scope.selectedEventId,
				'date' : $scope.reservationDateOnEdit,
				'unitId' : $scope.selectedUnit,
				'dayId': document.getElementById("daySelectOnEdit").value,
				'hourId' : document.getElementById('tickOnEdit').value.substring(0,2),
				'minutes' : document.getElementById('tickOnEdit').value.substring(3,5),
				'roomId': document.getElementById('classRoomOnEdit').value,
				'courseId': $scope.courses[document.getElementById('reservationReasonOnEdit').value].courseID,
				'classId': $scope.courses[document.getElementById('reservationReasonOnEdit').value].classID,
				'periodTypeId': $scope.selectedPeriod,
				'durationHours': document.getElementById('durationHoursOnEdit').value,
				'durationMinutes': document.getElementById('durationMinutesOnEdit').value,
				'typeId':  $scope.selectedType,
				'status': status, // ? to check
				'comment': $scope.commentOnEdit,
				'year': $scope.currentYear,
				'classSections' : $scope.selectedClassSections,
				'classTeachers' : $scope.selectedClassTeachers,
				'selectedPeriodStartDate': $scope.selectedPeriodStartDate,
				'selectedPeriodEndDate': $scope.selectedPeriodEndDate,
				'userId' : $scope.userinfo[0].id
			};
			// console.log(data);
			$http.post(url, data).success(function(data) {
				// alert(data);
	 			if (data){ // if true
	 				angular.element(document.querySelector('#editSuccess')).show();
	 				if ($scope.selectedType == 1) {
						angular.element(document.querySelector('#editSuccessDifferentDayTimeDuration')).show();
	 				}
					setTimeout(function() {
				    	angular.element(document.querySelector('#editSuccess')).hide();
				    	angular.element(document.querySelector('#editSuccessDifferentDayTimeDuration')).hide();
			    		// if Success close modal window
				    	window.location.assign(encodeURI(window.location.origin + "/#/reservations"  + "?unitId="+$scope.selectedUnit+ "&period=" +$scope.selectedPeriod));
				    	$scope.getCalendarEvents();
			    	}, 3000);
	 			}
	 			else {
	 				angular.element(document.querySelector('#roomBusyOnEdit')).show();
 				}
		 	}).error(function(error) {
		 		angular.element(document.querySelector('#editError')).show();
				setTimeout(function() {
			        angular.element(document.querySelector('#editError')).hide();
			    }, 3000);
			});
	    };


	    /**
	     * Called with eventResize
		 * @param {Function} revertFunc: used for reverting calendar object if resize not valied (e.g. when room already busy)
	     */
	    $scope.updateEventDuration = function(revertFunc, eventId, roomId, periodTypeId, date, hourId, minutes, originalDurationHours, originalDurationMinutes, durationHours, durationMinutes, typeId, dayId, unitId) {
	    	var url = "/admin/updateDuration";
	    	var differentDuration = (originalDurationHours!=durationHours || originalDurationMinutes!=durationMinutes) ? 'true' : 'false';
	    	if (differentDuration == 'true'){
				var data = {
					'id' : eventId,
					'roomId' : roomId,
					'periodTypeId' : periodTypeId,
					'date': date,
					'hourId': hourId,
					'minutes': minutes,
					'originalDurationHours': originalDurationHours,
					'originalDurationMinutes': originalDurationMinutes,
					'durationHours': durationHours,
					'durationMinutes': durationMinutes,
					'typeId': typeId,
					'dayId': dayId,
					'unitId': unitId,
					'selectedPeriodStartDate': $scope.selectedPeriodStartDate,
					'selectedPeriodEndDate': $scope.selectedPeriodEndDate
				};
				// console.log(data);
				$http.post(url, data).success(function(data) {
					if (data) {
		 				angular.element(document.querySelector('#editSuccessOnResize')).show();
		 				if (typeId == 1){
		 					angular.element(document.querySelector('#editSuccessOnUpdateDuration')).show();
		 				}
						setTimeout(function() {
					    	angular.element(document.querySelector('#editSuccessOnResize')).hide();
		    		    	angular.element(document.querySelector('#editSuccessOnUpdateDuration')).hide();
					    	$scope.getCalendarEvents();
				    	}, 3000);
		 			}
		 			else {
		 				angular.element(document.querySelector('#roomBusyOnResize')).show();
		 				revertFunc();
	 				}
			 	}).error(function(error) {
			 		angular.element(document.querySelector('#editErrorOnResize')).show();
					setTimeout(function() {
				        angular.element(document.querySelector('#editErrorOnResize')).hide();
				    }, 3000);
				    revertFunc();
				});
			}
	    };

	      /**
	     * Called with eventDrop
		 * @param {Function} revertFunc: used for reverting calendar object if resize not valied (e.g. when room already busy)
	     */
	    $scope.updateEventDate = function(revertFunc, event) {
			// When dropping event should check if new date is inside period scope (same thing should happen when on 'edit' - basically only for type==2 will apply since type==1 goes by day)
    		if (event.typeId > 0){ // Έκτακτη && Τακτική
	    		var destinationDate = event.start.format("YYYY-MM-DD");
	    		console.log(destinationDate);
				if (destinationDate!=""){
					if (destinationDate < $scope.selectedPeriodStartDate || destinationDate >  $scope.selectedPeriodEndDate){
						angular.element(document.querySelector('#dragOutOfPeriodScope')).show();
						revertFunc();
						return;
					}
				}
			}

			var url = "/admin/updateEventDate";
			console.warn(event)
	    	var data = {
				'id' : event.id,
				'roomId' : event.roomData.id,
				'periodTypeId' : event.period,
				'date': event.start.format("DD-MM-YYYY"),
				'dayId': event.start._d.getDay() + 1,
				'hourId': event.start.format("HH"),
				'minutes': event.start.format("mm"),
				'durationHours': event.durationHours,
				'durationMinutes': event.durationMinutes,
				'typeId': event.typeId,
				'unitId': event.unitId,
				// 'differentDay': event.dayId != (event.start._d.getDay()+1) ? "true"  : "false",
				'selectedPeriodStartDate': $scope.selectedPeriodStartDate,
				'selectedPeriodEndDate': $scope.selectedPeriodEndDate
			};
			// console.log(data);
			$http.post(url, data).success(function(data) {
				// alert(data);
				// console.log(data);
				if (data){ // if true
	 				angular.element(document.querySelector('#editSuccessOnDragAndDrop')).show();
	 				// if (event.dayId != (event.start._d.getDay()+1) && event.typeId == 1) { // differentDay and if cancelled events existing
	 				if (event.typeId == 1) {
 						angular.element(document.querySelector('#editSuccessOnDragAndDropDifferentDay')).show();
	 				}
					setTimeout(function() {
				    	angular.element(document.querySelector('#editSuccessOnDragAndDrop')).hide();
				    	angular.element(document.querySelector('#editSuccessOnDragAndDropDifferentDay')).hide();
				    	$scope.getCalendarEvents();
			    	}, 3000);
	 			}
	 			else {
	 				angular.element(document.querySelector('#roomBusyOnDragAndDrop')).show();
	 				revertFunc();
 				}
		 	}).error(function(error) {
		 		angular.element(document.querySelector('#editErrorOnDragAndDrop')).show();
				setTimeout(function() {
			        angular.element(document.querySelector('#editErrorOnDragAndDrop')).hide();
			    }, 3000);
			    revertFunc();
			});
      	};

		// delete calendarEvent
	    $scope.delete = function() {
    		var url = "/admin/deleteEvent";

			var data = {
				'calendarId' : $scope.selectedEventId
			};

			$http.post(url, data).success(function(data) {
				if (data){ // deleted row -- should be == 1 (row)
					angular.element(document.querySelector('#deleteSuccess')).show();
					setTimeout(function() {
				    	angular.element(document.querySelector('#deleteSuccess')).hide();
			    		// if Success close modal window
				    	angular.element(document.querySelector('#deleteReservation')).modal('hide');
				    	$scope.getCalendarEvents();
			    	}, 3000);
	 			}
		 	}).error(function(error) {
		 		angular.element(document.querySelector('#deleteError')).show();
				setTimeout(function() {
			        angular.element(document.querySelector('#deleteError')).hide();
			    }, 3000);
			});
	    };

	    $scope.cancelEvent = function(event){
	    	var url = "/admin/cancelEvent";

			var data = {
				'parentEventId' : event.id,
				'date': event.start.format("YYYY-MM-DD"),
				'unitId': event.unitId,
				'dayId': event.dayId,
				'hourId': event.hourId,
				'minutes': event.minutes,
				'roomId': event.roomData.id,
				'courseId': event.courseData.courseId,
				'periodTypeId': event.period,
				'durationHours': event.durationHours,
				'durationMinutes': event.durationMinutes,
				'typeId': 3,
				'status': event.status,
				'comment': event.comment,
				'year': $scope.currentYear,
				'userId' : $scope.userinfo[0].id

			};
			// console.log(data);
			$http.post(url, data).success(function(data) {
	 			if (data){ // if true
	 				alert("Ακυρώθηκε η κράτηση!");
			    	$scope.getCalendarEvents();
	 			}
		 	}).error(function(error) {
				alert("Σφάλμα με την ακύρωση της κράτησης!");
			});
	    }

      	$scope.acceptEvent = function(id){
    		var url = "/admin/acceptEvent";
    		var data = {
				'id': id
			};
			// console.log(data);
			$http.post(url, data).success(function(data) {
	 			if (data){ // if true
	 				alert("Έγινε αποδεκτή η κράτηση!");
			    	$scope.getCalendarEvents();
	 			}
		 	}).error(function(error) {
				alert("Σφάλμα με την αποδοχή της κράτησης!");
			});
    	}


      	$scope.rejectEvent = function(id, msg){

      		if(!document.getElementById("rejectionMsg").value){
				document.getElementById("rejectMsgWarning").innerHTML = '<font color="red">Δεν έχετε συμπληρώσει τo λόγο της κράτησης!</font>';
				return;
			}
    		var url = "/admin/rejectEvent";
    		var data = {
				'id': id,
				'message': msg
			};
			// console.log(data);
			$http.post(url, data).success(function(data) {
				// alert(data);
	 			if (data){ // if true
					angular.element(document.querySelector('#rejectSuccess')).show();
					setTimeout(function() {
				    	angular.element(document.querySelector('#rejectSuccess')).hide();
			    		// if Success close modal window
				    	angular.element(document.querySelector('#rejectModal')).modal('hide');
				    	$scope.getCalendarEvents();
		    		}, 3000);
	 			}
		 	}).error(function(error) {
		 		angular.element(document.querySelector('#rejectError')).show();
				setTimeout(function() {
			        angular.element(document.querySelector('#rejectError')).hide();
			    }, 3000);
			});
    	}

	     // VALIDATIONS
	 	$scope.reservationDateError = false;
		$scope.$watch('formData.reservationDateError', function (value) {
		    if (checkDate(value) || value == null){
		    	$scope.reservationDateError = false;
		    } else {
		      $scope.reservationDateError = "Η ημερομηνία δεν είναι σωστή";
		     }
		});
		$scope.reservationDateOnEditError = false;
		$scope.$watch('formData.reservationDateOnEditError', function (value) {
			if (checkDate(value) || value == null){
		    	$scope.reservationDateOnEditError = false;
		    } else {
		      $scope.reservationDateOnEditError = "Η ημερομηνία δεν είναι σωστή";
		    }

		});

    };
    app.controller("ReservationsController", ["$scope", "$http", "$compile", "$routeParams", "$location", "$window", "uiCalendarConfig", ReservationsController]);

}());
