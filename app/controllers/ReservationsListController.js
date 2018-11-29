angular
	.module('rooms')
	.controller('ReservationsListController', ["$scope", "$compile", "$routeParams", "$http", "$location", "filterFilter", "$window", "uiCalendarConfig", function ($scope, $compile, $routeParams, $http, $location, filterFilter, $window, uiCalendarConfig) {

		var requestedPath = $location.$$path;
		// At first use default values
		$scope.holidays = []; // List of holidays days
		$scope.eventSources = []; // Array of event sources. Will contain just the json feed object
		$scope.nEvents = 0; // Number of events for current unit and period

		$scope.courses = []; //list of courses of selected department
		$scope.rooms = []; //list of courses of selected department
		// The default page limit number
		$scope.limitNumber = {
			value: 10,
			name: '10'
		};

		// The page limit options
		$scope.itemOptions = [{
			value: 10,
			name: '10'
		}, {
			value: 20,
			name: '20'
		}, {
			value: 30,
			name: '30'
		}, {
			value: 40,
			name: '40'
		}, {
			value: 50,
			name: '50'
		}];
		var ctrl = this;
		// $scope.cevents = [];
		$scope.ceventsList = [];
		ctrl.ceventsData = [];
		$scope.loading = 0;
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
		$scope.eventTypes = ['Τακτική', 'Έκτακτη', 'Ακυρωμένη'];
		$scope.courseTypes = ['Εκδήλωση', 'Συνέλευση', 'Δημόσια Υποστήριξη', 'Προφορική εξέταση μαθήματος', 'Γραπτή εξέταση μαθήματος'];
		$scope.weekDays = [{
			id: 1,
			text: 'Κυριακή'
		}, {
			id: 2,
			text: 'Δευτέρα'
		}, {
			id: 3,
			text: 'Τρίτη'
		}, {
			id: 4,
			text: 'Τετάρτη'
		}, {
			id: 5,
			text: 'Πέμπτη'
		}, {
			id: 6,
			text: 'Παρασκευή'
		}, {
			id: 7,
			text: 'Σάββατο'
		}];
		$scope.selectedEventId = -1;
		$scope.numOfEvents = 0;
		$scope.repeatedDates = [];
		$scope.cancelleddDates = [];
		$scope.selectedType = 2;
		// $scope.userUnitsList = [];
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

		$scope.goToFullCalendar = function () {
			window.location.assign(encodeURI(window.location.origin + "/#/reservations" + "?unitId=" + $scope.selectedUnit + "&period=" + $scope.selectedPeriod));
		};
		// Period Types
		$scope.loading += 1;
		$http.get('/calendar/getPeriodTypes').then(
			function (response) {
				$scope.periodTypes = response.data;
				$scope.loading -= 1;
			},
			function (response) {
				$scope.error_periodtypes = "Error while getting period type data!";
				$scope.loading -= 1;
			});

		// Get global periods
		$scope.loading += 1;
		$http.get('/calendar/getPeriods').then(
			function (response) {
				$scope.periodsOriginal = response.data;
				$scope.periods = getPeriodsWithYear(response.data);
				$scope.currentPeriod = response.data[getCurrentPeriodIndex(response.data)].id;
				// console.log("getCurrentPeriodIndex: " + getCurrentPeriodIndex(response.data));
				$scope.currentYear = response.data[getCurrentPeriodIndex(response.data)].year;
				// console.log($scope.currentYear);
				$scope.loading -= 1;
			},
			function (response) {
				$scope.error_period = "Error while getting period data!";
				$scope.loading -= 1;
			});


		$scope.userInit = function (apm) {
			$scope.loading += 1;
			$http.get('https://ws-ext.it.auth.gr/isClassUser/' + apm).then(
				function (response) {
					$scope.loading -= 1;

					$scope.userinfo = response.data['user'];

					// if user exists
					if ($scope.userinfo.length > 0) {
						// if not admin
						if ($scope.userinfo[0].isAdmin == "0") {
							$scope.unitsUrl = "/calendar/getSimpleCalendarUnitsForUser/" + $scope.userinfo[0].id;
						} else {
							$scope.unitsUrl = "/calendar/getSimpleCalendarUnits";
						}
						getUnitsList($scope.unitsUrl);
						return $scope.unitsUrl;
					} else {
						// no use found by apm
						console.log("Wrong APM for user");
						angular.element(document.getElementById("unitsSelect").style.display = 'none');
						angular.element(document.getElementById("noUnitsWarning").innerHTML = "Δεν έχει αντιστοιχηθεί κάποιο τμήμα - μονάδα στο λογαριασμό σας");
					}

				},
				function (response) {
					$scope.error_units = "Error while getting university unit data!";
					$scope.loading -= 1;
				})
		};

		function getUnitsList(unitsUrl) {
			$scope.loading += 1;
			$http.get(unitsUrl).then(
				function (response) {
					$scope.univUnits = response.data;
					//
					var options = [];
					angular.forEach($scope.univUnits, function (value, key) {
						var option = new Option(value.name, value.id);
						options.push(option);
						// $scope.userUnitsList.push(value.id);
					});

					$("#unitsSelect").append(options);
					//
					if ($scope.univUnits.length == 0) {
						console.log("No units matched for user");
						angular.element(document.getElementById("unitsSelect").style.display = 'none');
						angular.element(document.getElementById("noUnitsWarning").innerHTML = "Δεν έχει αντιστοιχηθεί κάποιο τμήμα - μονάδα στο λογαριασμό σας");
					} else {
						if ($routeParams.unitId != null) {

							angular.forEach($scope.univUnits, function (value, key) {
								if (value.id == $routeParams.unitId) {
									$scope.selectedUnit = value.id;
									$scope.unit = value.id;
									$scope.selectedUnitDescription = value.name;
									$('#unitsSelect').val($scope.selectedUnit);
									$('#unitsSelect').trigger('change'); // Notify any JS components that the value changed
								}
							});

						}
						if ($routeParams.period != null && $routeParams.period < $scope.periodTypes.length + 1) {
							$scope.selectedPeriod = $routeParams.period;
							getClasses(); // load classes-courses along with data
							getRoomListForUnit($scope.selectedUnit); // load rooms along with data
							getUnitPeriods();
							$scope.getCalendarEvents();
						}

					}
					$scope.loading -= 1;
				},
				function (response) {
					$scope.error_units = "Error while getting university unit data!";
					$scope.loading -= 1;
				});
		}


		$('#unitsSelect').on('change', function () {
			$scope.selectedUnit = $('#unitsSelect').val();
			$scope.unit = $('#unitsSelect').val();
			// console.log("onUnitChange:" +  $scope.selectedUnit);
			// reset periods
			$('#periodsSelect').val(null);
			$('#periodsSelect').trigger('change');
			getUnitPeriods(); // Here call periods
		});

		Array.prototype.diff = function (a) {
			return this.filter(function (i) {
				return a.indexOf(i) < 0;
			});
		};

		// When on calendar user admin can view only things inside his period scope.
		// E.g. when I reserver a FAVORITE room from another unit which has different period scope possibly the admin of the other unit will not be able to see my reservation
		function getUnitPeriods() {
			console.warn('getUnitData', $scope.selectedUnit)

			// First check for unit's periods
			$scope.loading += 1;
			$http.get("/calendar/getUnitPeriods/" + $scope.selectedUnit).then(
				function (response) {
					$scope.unitPeriods = response.data;
					// console.log($scope.unitPeriods);
					if ($scope.unitPeriods.length > 0) { // If unit has its own periods - not empty array
						////////////////////////////////////////////////////////////////////////////////////////////////////
						if ($scope.unitPeriods.length < $scope.periodTypes.length) { // need to fill the rest from $scope.periods
							var periodTypeIndeces = [];
							angular.forEach($scope.periodTypes, function (value, key) {
								periodTypeIndeces.push(value.id);
							});

							var unitPeriodIndeces = [];
							angular.forEach($scope.unitPeriods, function (value, key) {
								unitPeriodIndeces.push(value.id);
							});
							// console.log(unitPeriodIndeces);
							var typesDiff = periodTypeIndeces.diff(unitPeriodIndeces);

							// First push in periods the unit periods
							var periodsTmp = [];
							angular.forEach($scope.unitPeriods, function (value, key) {
								periodsTmp.push(value);
							});
							for (var i = 0; i < typesDiff.length; i++) {
								// console.log(typesDiff[i]);
								angular.forEach($scope.periodsOriginal, function (value, key) {
									if (value.id == typesDiff[i]) {
										periodsTmp.push(value);
									}
								});
							}
							$scope.periods = getPeriodsWithYear(periodsTmp);
						} else { // unit periods length == periodTypes length
							$scope.periods = getPeriodsWithYear($scope.unitPeriods);
						}

						////////////////////////////////////////////////////////////////////////////////////////////////////
					}
					// console.log($scope.periods);
					$("#periodsSelect").select2({
						placeholder: 'Καθορίστε την περίοδο',
						data: $scope.periods
					});
					if ($scope.selectedPeriod > 0) {
						// Get other variables
						angular.forEach($scope.periods, function (value, key) {
							// console.log(value);
							if (value.id == $scope.selectedPeriod) {
								$scope.selectedPeriodText = value.text;
								$scope.selectedPeriodStartDate = value.startDate.substring(0, 10); // remove 00:00:00
								$scope.selectedPeriodEndDate = value.endDate.substring(0, 10); // remove 00:00:00
								$('#periodsSelect').val($scope.selectedPeriod);
								$('#periodsSelect').trigger('change'); // Notify any JS components that the value changed
							}
						});
					}
					$scope.loading -= 1;
				},
				function () {
					console.error('Could not fetch period data!');
					$scope.loading -= 1;
				}
			);
		}

		$('#periodsSelect').on('change', function () {
			$scope.selectedPeriod = $('#periodsSelect').val();

			if ($scope.selectedPeriod > 0) {
				// console.log("onPeriodChange:" +  $scope.selectedPeriod);
				window.location.assign(encodeURI(window.location.origin + "/#/reservationsList" + "?unitId=" + $scope.selectedUnit + "&period=" + $scope.selectedPeriod));
				// set again the currentYear - based on selected period
				$scope.currentYear = $scope.periods[$scope.selectedPeriod - 1].year;
			}
		});

		$scope.getCalendarEvents = function () {
			$scope.loading += 1;
			$scope.ceventsList = [];
			$http.get("/calendar/getAdminEventsList/" + $scope.selectedUnit + "/" + $scope.selectedPeriod).then(
				function (response) {

					// Parse result to cosntruct table
					angular.forEach(response.data, function (value, key) {
						var event = value;
						// type
						event.type = $scope.eventTypes[event.typeId - 1];
						// event date
						if (event.typeId == 2 || event.typeId == 3) {
							event.eventDate = event.date.substring(8, 10) + "-" + event.date.substring(5, 7) + "-" + event.date.substring(0, 4);
						} else { // typeId = 1
							event.eventDate = $scope.periodTypes[event.periodTypeId - 1].name;
						}
						// duration
						if (event.durationHours != '0' && event.durationMinutes != '0') {
							event.duration = event.durationHours + ' Ω & ' + event.durationMinutes + ' Λ';
						} else if (event.durationHours != '0' && event.durationMinutes == '0') {
							event.duration = event.durationHours + ' Ω';
						} else if (event.durationHours == '0' && event.durationMinutes != '0') {
							event.duration = '0 Ω & ' + event.durationMinutes + ' Λ';
						}
						// course
						if (event.courseData.courseTitle) {
							event.course = event.courseData.courseTitle;
						}
						if (event.courseId < 5) {
							event.course = $scope.courseTypes[event.courseId];
						}
						// status description
						if (event.status == 'active') {
							event.statusDescr = 'Ενεργή';
						} else if (event.status == 'rejected') {
							event.statusDescr = 'Απορρίφθηκε';
						} else {
							event.statusDescr = 'Εκκρεμής';
						}
						// date & time
						if (event.typeId == 2) {
							event.eventDateTime = new Date(event.date.substring(0, 4), event.date.substring(5, 7), event.date.substring(8, 10)).getDay();
							event.eventDateTime = $scope.weekDays[event.eventDateTime].text + " " + addZero(event.hourId) + ":" + addZero(event.minutes);
						} else { // get info from dayId
							event.eventDateTime = $scope.weekDays[event.dayId - 1].text + " " + addZero(event.hourId) + ":" + addZero(event.minutes);
						}
						// courseId
						event.eventCourseId = event.courseId!=null ? event.courseId : event.courseData.courseId;
						//sections
						event.sections = "";
						angular.forEach(event.classsections, function (value, key) {
							event.sections += value.secname + ", ";
						});
						if (event.sections.length > 1) {
							event.sections = event.sections.substr(0, event.sections.length - 2);
						}

						// Can edit record?
						event.otherUnitsEvent = false;
						if ($scope.selectedUnit != event.unitId) {
							event.otherUnitsEvent = true;
							event.eventUnitName = event.unitName ? '*' + event.unitName + '*' : '*id=' + event.unitId + '*';
						}
						// examID == semester
						if (event.courseData.examID){
							event.examID = "(" + examIdToString(event.courseData.examID) + ")";
						}

						$scope.ceventsList.push(event);
					});

					/////////////////////////////
					// $scope.ceventsList = response.data;
					ctrl.ceventsData = $scope.ceventsList; //response.data;
					// console.log($scope.ceventsList);
					console.log("Events: " + $scope.ceventsList.length);
					$scope.numOfEvents = $scope.ceventsList.length;
					$scope.nEvents = $scope.ceventsList.length;

					$scope.itemOptions = [{
						value: 10,
						name: '10'
					}, {
						value: 20,
						name: '20'
					}, {
						value: 30,
						name: '30'
					}, {
						value: 40,
						name: '40'
					}, {
						value: 50,
						name: '50'
					}];
					$scope.itemOptions.push({
						value: ctrl.ceventsData.length,
						name: 'All'
					});
					getHolidays();
					$scope.loading -= 1;
					filterData();

					// console.log($scope.ceventsList);
				},
				function (resource) {
					$scope.error_events = "Error while getting events!";
					$scope.loading -= 1;
				});

			$scope.eventSources = []
			// Load original list from calendar to get repeated values
			$scope.loading += 1;
			$http.get("/calendar/getAdminCalendarEvents/" + $scope.selectedUnit + "/" + $scope.selectedPeriod).then(
				function (resource) {
					var events = resource.data;
					$scope.eventSources.push(events);
					$scope.eventSources.push($scope.holidays);
					// console.log($scope.eventSources);
					$scope.loading -= 1;
				},
				function (resource) {
					$scope.error_events = "Error while getting events!";
					$scope.loading -= 1;
				});
		};

		var filterData = function () {
			ctrl.cevents = ctrl.ceventsData;

			if ($scope.search)
				ctrl.cevents = filterFilter(ctrl.cevents, $scope.search);
			$scope.cevents = ctrl.cevents;
			console.log("Filtered data!");
		};


		$scope.checkIfHoliday = function (date) {
			var selectedDate = date.substring(6, 10) + "-" + date.substring(3, 5) + "-" + date.substring(0, 2);
			var nameVacation = "";
			for (var i = 0; i < $scope.holidays.length; i++) {
				if (selectedDate === format($scope.holidays[i].start)) {
					flag = false;
					nameVacation = $scope.holidays[i].title;
					// return nameVacation;
					break;
				} else if (selectedDate > format($scope.holidays[i].start) && selectedDate <= format($scope.holidays[i].end)) {
					flag = false;
					nameVacation = $scope.holidays[i].title;
					// return nameVacation;
					break;
				}
			}
			return nameVacation;
		};

		$('.modal').on('hidden.bs.modal', function () {
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
		function getHolidays() {
			var unitsUrl = "/calendar/getInactiveDates";
			$scope.holidays.length = 0;
			$scope.loading += 1;
			$http.get(unitsUrl).then(function (response) {
				var holidays = formatHolidayData(response.data);
				for (var i = 0; i < holidays.length; i++) {
					var object = {
						title: holidays[i].name,
						start: holidays[i].startDate,
						end: holidays[i].endDate,
						allDay: true,
						color: "red",
						rendering: 'background'
					}
					$scope.holidays.push(object);
				}
				$scope.loading -= 1;
			}, function () {
				console.error('Could not fetch inactive dates data!');
				$scope.loading -= 1;
			});
			var unitsUrl = "/calendar/getInactiveDatesForDepartment/" + $scope.selectedUnit;
			$scope.loading += 1;
			$http.get(unitsUrl).then(function (response) {
				var holidays = formatHolidayData(response.data);
				for (var i = 0; i < holidays.length; i++) {
					var object = {
						title: holidays[i].name,
						start: holidays[i].startDate,
						end: holidays[i].endDate,
						allDay: true,
						color: "red",
						rendering: 'background'
					}
					$scope.holidays.push(object);
				}
				$scope.loading -= 1;
			}, function () {
				console.error('Could not fetch unit data for the dropdown!');
				$scope.loading -= 1;
			});
			// console.log($scope.holidays);
			return $scope.holidays;
		}

		function formatHolidayData(holidays) {
			var newUnits = [];
			holidays.forEach(function (faculty, index, array) {
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
			$scope.loading += 1;
			$http.get("/calendar/getClassesForDepartment/" + $scope.selectedUnit + "/" + $scope.currentYear + "/" + $scope.selectedPeriod).then(
				function (response) {
					$scope.loading -= 1;
					$scope.courses = response.data;
					//
					var coursesData = $.map($scope.courses, function (obj, index) {
						if (obj.coursecode)
							obj.text = obj.coursetitle + "(" + obj.coursecode + ")";
						else
							obj.text = obj.coursetitle;
						obj.id = index; // replace pk with your identifier
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

				},
				function () {
					console.error('Could not fetch classes data!');
					$scope.loading -= 1;
				}
			);
		}

		function getRoomListForUnit(unitId) {
			$scope.loading += 1;
			$http.get("/calendar/getGisRoomFavoriteForDepartment/" + unitId).then(
				function (response) {
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
					$scope.loading -= 1;
				},
				function (response) {
					$scope.error_rooms = "Error while getting university room data!";
					$scope.loading -= 1;
				});
		}

		$scope.showImportForm = function () {
			angular.element(document.querySelector('#importReservations')).modal('show');
		}

		// add calendarEvent
		$scope.add = function () {

			// Validations
			angular.element(document.getElementById("commentWarning").innerHTML = "");
			angular.element(document.getElementById("holidayWarning").innerHTML = "");
			angular.element(document.getElementById("reservationDateWarning").innerHTML = "");
			angular.element(document.getElementById("reservationDate2Warning").innerHTML = "");
			angular.element(document.querySelector('#addOutOfPeriodScope')).hide();
			angular.element(document.querySelector('#fieldsError')).hide();

			var status = "active";
			if ($scope.selectedType == 2) { // Έκτακτη
				if ($scope.reservationDate == "" || !checkDate($scope.reservationDate)) {
					document.getElementById("reservationDateWarning").innerHTML = '<font color="red">Η ημερομηνία δεν είναι σωστή!</font>';
					return;
				}
				// check if selected date is in period scope (between selectedPeriodStartDate and selectedPeriodEndDate)
				if ($scope.reservationDate != "") {
					// check for holiday
					var nameVacation = $scope.checkIfHoliday($scope.reservationDate);
					if (nameVacation != "") {
						// This is a holiday
						document.getElementById("holidayWarning").innerHTML = '<font color="red">Η ημέρα είναι αργία:' + nameVacation + '</font>';
						return;
					}
					var reservationDateReverse = $scope.reservationDate.substring(6, 10) + "-" + $scope.reservationDate.substring(3, 5) + "-" + $scope.reservationDate.substring(0, 2);
					if (reservationDateReverse < $scope.selectedPeriodStartDate || reservationDateReverse > $scope.selectedPeriodEndDate) {
						angular.element(document.querySelector('#addOutOfPeriodScope')).show();
						return;
					}
				}
			}

			if ($scope.selectedType == 1) { // Τακτική
				if (!document.getElementById("daySelect").value) {
					document.getElementById("reservationDate2Warning").innerHTML = '<font color="red">Δεν έχετε επιλέξει ημέρα!</font>';
					return;
				}
				if (!document.getElementById("comment").value) {
					document.getElementById("commentWarning").innerHTML = '<font color="red">Δεν έχετε συμπληρώσει τα σχόλια της κράτησης!</font>';
					return;
				}
			}

			var url = "/admin/createEvent";
			try {
				var data = {
					'date': $scope.reservationDate,
					'unitId': $scope.selectedUnit,
					'dayId': document.getElementById("daySelect").value,
					'hourId': document.getElementById('tick').value.substring(0, 2),
					'minutes': document.getElementById('tick').value.substring(3, 5),
					'roomId': document.getElementById('classRoom').value,
					'courseId': $scope.courses[document.getElementById('reservationReason').value].courseID,
					'classId': $scope.courses[document.getElementById('reservationReason').value].classID,
					'periodTypeId': $scope.selectedPeriod,
					'durationHours': document.getElementById('durationHours').value,
					'durationMinutes': document.getElementById('durationMinutes').value,
					'typeId': $scope.selectedType,
					'status': status,
					'comment': document.getElementById('comment').value,
					'year': $scope.currentYear,
					'selectedPeriodStartDate': $scope.selectedPeriodStartDate,
					'selectedPeriodEndDate': $scope.selectedPeriodEndDate,
					'classSections': $scope.selectedClassSections,
					'classTeachers': $scope.selectedClassTeachers
				};
			} catch (error) {
				angular.element(document.querySelector('#fieldsError')).show();
				return;
			}

			// console.log(data);
			$scope.loading += 1;
			$http.post(url, data).success(function (data) {
				// alert(data);
				if (data) { // data is true (reservation added)
					angular.element(document.querySelector('#addSuccess')).show();
					setTimeout(function () {
						angular.element(document.querySelector('#addSuccess')).hide();
						// if Success close modal window
						angular.element(document.querySelector('#addReservation')).modal('hide');
						$scope.getCalendarEvents();
					}, 3000);
				} else {
					angular.element(document.querySelector('#roomBusy')).show();
					setTimeout(function () {
						angular.element(document.querySelector('#roomBusy')).hide();
					}, 3000);
				}
				$scope.loading -= 1;
			}).error(function (error) {
				// alert(error);
				//alert("Υπήρξε πρόβλημα με την δημιουργία νέας κράτησης!");
				angular.element(document.querySelector('#addError')).show();
				setTimeout(function () {
					angular.element(document.querySelector('#addError')).hide();
				}, 3000);
				$scope.loading -= 1;
			});


		};

		$scope.calculateRepeatedDates = function (courseId, hourId, minutes, roomId) {
			var datesArray = [];
			var cancelledDatesArray = [];

			angular.forEach($scope.eventSources[0], function (value, key) {
				if (value['courseData'].courseId == courseId && value['hourId'] == hourId && value['minutes'] == minutes && value['roomData'].id == roomId) { // should not compare with eventId because the canceled events hove other eventId @TODO tofix
					var stringDate = value['start'].substr(0, 10);
					// console.log(value['typeId']);
					if (value['typeId'] == 3) {
						cancelledDatesArray.push("<option>" + stringDate.substr(8, 10) + "-" + stringDate.substr(5, 2) + "-" + stringDate.substr(0, 4) + "</option>");
					} else {
						datesArray.push("<option>" + stringDate.substr(8, 10) + "-" + stringDate.substr(5, 2) + "-" + stringDate.substr(0, 4) + "</option>");
					}
				}
			});
			$scope.repeatedDates = datesArray;
			$scope.cancelledDates = cancelledDatesArray;
		}

		$scope.addEvent = function () {
			// Units & Period
			var unitsdata = $.map($scope.univUnits, function (obj) {
				obj.text = obj.text || obj.name; // replace name with the property used for the text
				return obj;
			});
			$('#unitsSelectAdd').select2({
				disabled: true,
				placeholder: "Επιλέξτε Μονάδα",
				data: unitsdata
			});
			$('#unitsSelectAdd').val($scope.selectedUnit);
			$('#unitsSelectAdd').trigger('change'); // Notify any JS components that the value changed
			//
			$('#periodSelectAdd').select2({
				disabled: true,
				placeholder: "Επιλέξτε Περίοδο",
				data: $scope.periods
			});
			$('#periodSelectAdd').val($scope.selectedPeriod);
			$('#periodSelectAdd').trigger('change'); // Notify any JS components that the value changed
			//type
			// if period in 1,2 then enabled all typeSelect options otherwise disable repeated option
			var reservationDateDiv = document.getElementById("reservationDate");
			var reservationDateDiv2 = document.getElementById("reservationDate2");
			reservationDateDiv.style.display = "none";
			reservationDateDiv2.style.display = "none";
			if ($scope.selectedPeriod > 2) {
				$('#typeSelect').val(2);
				$('#typeSelect').trigger('change');
				$("#typeSelect").prop("disabled", true);
				reservationDateDiv.style.display = "block";
				// $('#repeated').prop('disabled', !$('#repeated').prop('disabled'));
			}

			$('#typeSelect').on('change', function () {
				$scope.selectedType = $('#typeSelect').val()
				if ($scope.selectedType == 2) {
					reservationDateDiv.style.display = "block";
					reservationDateDiv2.style.display = "none";
				}
				if ($scope.selectedType == 1) {
					reservationDateDiv.style.display = "none";
					reservationDateDiv2.style.display = "block";
				}
			});
			// clear room select
			$('#classRoom').val("");
			$('#classRoom').trigger('change');

			var today = new Date();
			var dd = today.getDate()
			var mm = today.getMonth() + 1;
			var yyyy = today.getFullYear();
			$scope.nowDate = yyyy + '-' + addZero(mm) + '-' + addZero(dd);
			var h = addZero(today.getHours());
			var m = addZero(today.getMinutes());
			$scope.nowTime = h + ":" + m;
			// console.log($scope.nowTime);
			$('.clockpicker').clockpicker({
				placement: 'bottom',
				align: 'left',
				donetext: 'Επιλογή',
				autoclose: true
			});
			var durationHours = Array.from(Array(13).keys());
			$("#durationHours").select2({
				data: durationHours
			});
			$("#durationHours").select2("val", "1"); // set default value
			var durationMinutes = [0, 10, 20, 30, 40, 50, 60];
			$("#durationMinutes").select2({
				data: durationMinutes
			});

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
			$('#classSection').on('change', function () {
				$scope.selectedClassSections = $('#classSection').val();
			});

			$("#classTeachers").select2({
				placeholder: 'Επιλέξτε Υπεύθυνο',
				allowClear: true
			});
			$('#classTeachers').on('change', function () {
				$scope.selectedClassTeachers = $('#classTeachers').val();
			});
			$("#reservationReason").on("change", function () {
				var selectedClassId = $scope.courses[$(this).val()].classID;
				var selectedCourseId = $scope.courses[$(this).val()].courseID;
				// console.log("selected classid: "+ selectedClassId);

				/////////// get class sections ///////////////
				var selectedClassDivIds = [];
				// console.log(selectedClassId);
				$scope.loading += 1;
				$http.get("/calendar/getClassSections/" + selectedClassId).then(
					function (response) {
						var rangeOptions = [];
						var classdivs = response.data;

						angular.forEach(classdivs, function (value, key) {
							var option = new Option(value.secname, value.secnum);
							rangeOptions.push(option);
							selectedClassDivIds.push(value.secnum);
						});
						//
						$("#classSection option[value]").remove();
						$("#classSection").append(rangeOptions).val("").trigger("change");
						$('#classSection').val(selectedClassDivIds);
						$('#classSection').trigger('change');
						$scope.loading -= 1;
					},
					function (response) {
						$scope.error_classsections = "Error while getting class section data!";
						$scope.loading -= 1;
					});
				/////////// get class teachers ///////////////
				var selectedClassTeacherIds = [];
				$scope.loading += 1;
				$http.get("/calendar/getTeachersForCourse/" + selectedCourseId + "/" + $scope.currentYear + "/" + $scope.selectedPeriod).then(
					function (response) {
						var rangeOptions = [];
						var classteachers = response.data;
						angular.forEach(classteachers, function (value, key) {
							var option = new Option(value.name, value.staffID);
							rangeOptions.push(option);
							selectedClassTeacherIds.push(value.staffID);
						});
						$("#classTeachers option[value]").remove();
						$("#classTeachers").append(rangeOptions).val("").trigger("change");
						$('#classTeachers').val(selectedClassTeacherIds);
						$('#classTeachers').trigger('change');
						$scope.loading -= 1;
					},
					function (response) {
						$scope.error_classsections = "Error while getting class teachers data!";
						$scope.loading -= 1;
					});
				/////////// get class teachers ///////////////
			});

			angular.element(document.querySelector('#roomBusy')).hide();
			angular.element(document.querySelector('#addOutOfPeriodScope')).hide();
			angular.element(document.querySelector('#fieldsError')).hide();
			angular.element(document.querySelector('#addReservation')).modal('show');
		}

		$scope.loadRejectModal = function (id) {
			$scope.rejectionEventId = id;
			angular.element(document.getElementById("rejectMsgWarning").innerHTML = "");
			angular.element(document.querySelector('#rejectModal')).modal('show');
		};

		$scope.editEvent = function (event) {

			$scope.event = event;
			$scope.selectedEventId = event.id;
			$scope.selectedType = event.typeId;
			document.getElementById("editReservationTitle").innerHTML = "Διόρθωση κράτησης";
			document.getElementById("periodOnEdit").innerHTML = $scope.selectedPeriodText;
			document.getElementById("typeOnEdit").innerHTML = $scope.eventTypes[event.typeId - 1];
			var myDatesOnEdit = document.getElementById("mydatesOnEdit");
			///////////// get department courses for unit and period ///////////////
			angular.forEach($scope.courses, function (value, key) {
				if (value.courseID == event.eventCourseId) {
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
			angular.forEach(event.classsections, function (value, key) {
				selectedClassDivIds.push(value.secnum);
			});
			$('#sectionsOnEdit').on('change', function () {
				$scope.selectedClassSections = $('#sectionsOnEdit').val();
			});
			$scope.loading += 1;
			$http.get("/calendar/getClassSections/" + event.courseData.classId).then(
				function (response) {
					var rangeOptions = [];
					var classdivs = response.data;

					angular.forEach(classdivs, function (value, key) {
						var option = new Option(value.secname, value.secnum);
						rangeOptions.push(option);
					});

					$("#sectionsOnEdit option[value]").remove();
					$("#sectionsOnEdit").append(rangeOptions).val("").trigger("change");
					$('#sectionsOnEdit').val(selectedClassDivIds);
					$('#sectionsOnEdit').trigger('change');
					$scope.selectedClassSections = selectedClassDivIds;
					$scope.loading -= 1;
				},
				function (response) {
					$scope.error_classsections = "Error while getting class section data!";
					$scope.loading -= 1;
				});
			/////////// get class teachers ///////////////
			$("#classTeachersOnEdit	").select2({
				placeholder: 'Επιλέξτε Υπεύθυνο',
				allowClear: true
			});
			var selectedClassTeacherIds = [];
			angular.forEach(event.staffData, function (value, key) {
				selectedClassTeacherIds.push(value.staffId);
			});
			$('#classTeachersOnEdit').on('change', function () {
				$scope.selectedClassTeachers = $('#classTeachersOnEdit').val();
			});
			$scope.loading += 1;
			$http.get("/calendar/getTeachersForCourse/" + event.eventCourseId + "/" + $scope.currentYear + "/" + $scope.selectedPeriod).then(
				function (response) {
					var rangeOptions = [];
					var classteachers = response.data;
					angular.forEach(classteachers, function (value, key) {
						var option = new Option(value.name, value.staffID);
						rangeOptions.push(option);
					});
					$("#classTeachersOnEdit option[value]").remove();
					$("#classTeachersOnEdit").append(rangeOptions).val("").trigger("change");
					$('#classTeachersOnEdit').val(selectedClassTeacherIds);
					$('#classTeachersOnEdit').trigger('change');
					$scope.loading -= 1;
				},
				function (response) {
					$scope.error_classsections = "Error while getting class teachers data!";
					$scope.loading -= 1;
				});

			// Get new staff & section values on class change
			$("#reservationReasonOnEdit").on("change", function () {
				var selectedClassId = $scope.courses[$(this).val()].classID;
				var selectedCourseId = $scope.courses[$(this).val()].courseID;

				/////////// get new class sections ///////////////
				var selectedClassDivIds = [];
				// console.log(selectedClassId);
				$scope.loading += 1;
				$http.get("/calendar/getClassSections/" + selectedClassId).then(
					function (response) {
						var rangeOptions = [];
						var classdivs = response.data;

						angular.forEach(classdivs, function (value, key) {
							var option = new Option(value.secname, value.secnum);
							rangeOptions.push(option);
							selectedClassDivIds.push(value.secnum);
						});
						//
						$("#sectionsOnEdit option[value]").remove();
						$("#sectionsOnEdit").append(rangeOptions).val("").trigger("change");
						$('#sectionsOnEdit').val(selectedClassDivIds);
						$('#sectionsOnEdit').trigger('change');
						$scope.loading -= 1;
					},
					function (response) {
						$scope.error_classsections = "Error while getting class section data!";
						$scope.loading -= 1;
					});
				/////////// get class teachers ///////////////
				var selectedClassTeacherIds = [];
				$scope.loading += 1;
				$http.get("/calendar/getTeachersForCourse/" + selectedCourseId + "/" + $scope.currentYear + "/" + $scope.selectedPeriod).then(
					function (response) {
						var rangeOptions = [];
						var classteachers = response.data;
						angular.forEach(classteachers, function (value, key) {
							var option = new Option(value.name, value.staffID);
							rangeOptions.push(option);
							selectedClassTeacherIds.push(value.staffID);
						});
						$("#classTeachersOnEdit option[value]").remove();
						$("#classTeachersOnEdit").append(rangeOptions).val("").trigger("change");
						$('#classTeachersOnEdit').val(selectedClassTeacherIds);
						$('#classTeachersOnEdit').trigger('change');
						$scope.loading -= 1;
					},
					function (response) {
						$scope.error_classsections = "Error while getting class teachers data!";
						$scope.loading -= 1;
					});

			});
			//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			// Comments
			$scope.commentOnEdit = event.comment;
			// Rooms
			angular.forEach($scope.rooms, function (value, key) {
				if (value.id == event.roomData.id) {
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

			$scope.eventDate = event.date;

			if (event.typeId == 2) {
				reservationDateOnEditDiv.style.display = "block";
				reservationDateOnEdit2Div.style.display = "none";
				myDatesOnEdit.style.display = "none";
				angular.element(document.querySelector('#reservationDateOnEditDiv')).show();
				angular.element(document.querySelector('#reservationDateOnEdit2Div')).hide();
			}
			if (event.typeId == 1) {
				$('#daySelectOnEdit').val($scope.weekDays[event.dayId - 1].id);
				$('#daySelectOnEdit').trigger('change');
				reservationDateOnEditDiv.style.display = "none";
				reservationDateOnEdit2Div.style.display = "block";
				myDatesOnEdit.style.display = "block";
				//
				$scope.calculateRepeatedDates(event.eventCourseId, event.hourId, event.minutes, event.roomData.id);
				var innerSelectRepeatedDatesHtml = "";
				angular.forEach($scope.repeatedDates, function (value, key) {
					innerSelectRepeatedDatesHtml += value;
				});
				document.getElementById("repeatIdOnEdit").innerHTML = innerSelectRepeatedDatesHtml;
				var innerSelectCancelledDatesHtml = "";
				angular.forEach($scope.cancelledDates, function (value, key) {
					innerSelectCancelledDatesHtml += value;
				});
				document.getElementById("cancelledIdOnEdit").innerHTML = innerSelectCancelledDatesHtml;
				//
				angular.element(document.querySelector('#reservationDateOnEditDiv')).hide();
				angular.element(document.querySelector('#reservationDateOnEdit2Div')).show();
			}
			// HOUR
			var hour = addZero(event.hourId);
			var minutes = addZero(event.minutes);
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

		$scope.deleteEvent = function (event) {
			$scope.selectedEventId = event.id;

			document.getElementById("eventTitleOnDelete").innerHTML = event.course;
			document.getElementById("sectionsOnDelete").innerHTML = event.sections;
			document.getElementById("instructorsOnDelete").innerHTML = event.courseData.instructors;
			document.getElementById("commentsOnDelete").innerHTML = event.comment;
			if (event.roomData.name != "undefined" && event.roomData.name !== '') {
				roomName = '<a target="_blank" href="/#/room/' + event.roomData.id + '" role="button">' + event.roomData.name + '</a> ' + '</div>';
			}
			document.getElementById("roomOnDelete").innerHTML = roomName;
			document.getElementById("periodOnDelete").innerHTML = $scope.selectedPeriodText;
			document.getElementById("typeOnDelete").innerHTML = $scope.eventTypes[event.typeId - 1];
			document.getElementById("deleteReservationTitle").innerHTML = "Διαγραφή κράτησης";


			var myDates = document.getElementById("mydates");

			if (event.typeId == 1) {
				$scope.calculateRepeatedDates(event.eventCourseId, event.hourId, event.minutes, event.roomId);
				var innerSelectRepeatedDatesHtml = "";
				angular.forEach($scope.repeatedDates, function (value, key) {
					innerSelectRepeatedDatesHtml += value;
				});
				document.getElementById("repeatId").innerHTML = innerSelectRepeatedDatesHtml;
				var innerSelectCancelledDatesHtml = "";
				angular.forEach($scope.cancelledDates, function (value, key) {
					innerSelectCancelledDatesHtml += value;
				});
				document.getElementById("cancelledId").innerHTML = innerSelectCancelledDatesHtml;
				document.getElementById("dayOnDelete").innerHTML = $scope.weekDays[event.dayId - 1].text;
				angular.element(document.querySelector('#reservationDateDelete')).hide();
				angular.element(document.querySelector('#reservationDateDelete2')).show();
				myDates.style.display = "block";
				$("#submitDelete").show();
				$("#submitRestore").hide();
				// // ---------------------------------------------------------------------------
				angular.element(document.querySelector('#reservationDateDelete2')).show();
			} else if (event.typeId == 2) {
				document.getElementById("dateOnDelete").innerHTML = event.eventDate;
				angular.element(document.querySelector('#reservationDateDelete')).show();
				angular.element(document.querySelector('#reservationDateDelete2')).hide();
				myDates.style.display = "none";
				$("#submitDelete").show();
				$("#submitRestore").hide();

			} else if (event.typeId == 3) {
				document.getElementById("deleteReservationTitle").innerHTML = "Επαναφορά κράτησης";
				// console.log(date);
				document.getElementById("dayOnDelete").innerHTML = $scope.weekDays[event.dayId - 1].text + " (" + event.eventDate + ")"; // plus selected date
				angular.element(document.querySelector('#reservationDateDelete')).hide();
				angular.element(document.querySelector('#reservationDateDelete2')).show();
				myDates.style.display = "none";
				$("#submitDelete").hide();
				$("#submitRestore").show();
			}
			//
			document.getElementById("hourOnDelete").innerHTML = addZero(event.hourId) + ":" + addZero(event.minutes);
			document.getElementById("durationOnDelete").innerHTML = event.duration;
			//
			angular.element(document.querySelector('#deleteReservation')).modal('show');
		}

		// edit calendarEvent
		$scope.edit = function () {
			// Validations
			angular.element(document.getElementById("commentWarningOnEdit").innerHTML = "");
			angular.element(document.getElementById("durationOnEditWarning").innerHTML = "");
			angular.element(document.getElementById("reservationDateOnEditWarning").innerHTML = "");
			angular.element(document.getElementById("reservationDateOnEdit2Warning").innerHTML = "");
			angular.element(document.querySelector('#editOutOfPeriodScope')).hide();

			var status = "active";
			if ($scope.selectedType == 2) { // Έκτακτη
				if ($scope.reservationDateOnEdit == "" || !checkDate($scope.reservationDateOnEdit)) {
					document.getElementById("reservationDateOnEditWarning").innerHTML = '<font color="red">Η ημερομηνία δεν είναι σωστή!</font>';
					return;
				}
				// Check if reservationDateOnEdit is in holidays scope
				var nameVacation = $scope.checkIfHoliday($scope.reservationDateOnEdit);
				if (nameVacation != "") {
					// This is a holiday
					document.getElementById("reservationDateOnEditWarning").innerHTML = '<font color="red">Η ημέρα είναι αργία:' + nameVacation + '</font>';
					return;
				}

				// check if selected date is in period scope (between selectedPeriodStartDate and selectedPeriodEndDate)
				if ($scope.reservationDateOnEdit != "") {
					var reservationDateReverse = $scope.reservationDateOnEdit.substring(6, 10) + "-" + $scope.reservationDateOnEdit.substring(3, 5) + "-" + $scope.reservationDateOnEdit.substring(0, 2);
					if (reservationDateReverse < $scope.selectedPeriodStartDate || reservationDateReverse > $scope.selectedPeriodEndDate) {
						angular.element(document.querySelector('#editOutOfPeriodScope')).show();
						return;
					}
				}
			}

			if ($scope.selectedType == 1) { // Τακτική
				if (!document.getElementById("daySelectOnEdit").value) {
					document.getElementById("reservationDateOnEdit2Warning").innerHTML = '<font color="red">Δεν έχετε επιλέξει ημέρα!</font>';
					return;
				}
				if (!document.getElementById("commentOnEdit").value) {
					document.getElementById("commentWarningOnEdit").innerHTML = '<font color="red">Δεν έχετε συμπληρώσει τα σχόλια της κράτησης!</font>';
					return;
				}
			}
			// Duration should not be zero
			if (document.getElementById('durationHoursOnEdit').value == 0 && document.getElementById('durationMinutesOnEdit').value == 0) {
				document.getElementById("durationOnEditWarning").innerHTML = '<font color="red">Η διάρκεια της κράτησης δε μπορεί να είναι μηδενική!</font>';
				return;
			}



			var url = "/admin/editEvent";
			var data = {
				'id': $scope.selectedEventId,
				'date': $scope.reservationDateOnEdit,
				'unitId': $scope.selectedUnit,
				'dayId': document.getElementById("daySelectOnEdit").value,
				'hourId': document.getElementById('tickOnEdit').value.substring(0, 2),
				'minutes': document.getElementById('tickOnEdit').value.substring(3, 5),
				'roomId': document.getElementById('classRoomOnEdit').value,
				'courseId': $scope.courses[document.getElementById('reservationReasonOnEdit').value].courseID,
				'classId': $scope.courses[document.getElementById('reservationReasonOnEdit').value].classID,
				'periodTypeId': $scope.selectedPeriod,
				'durationHours': document.getElementById('durationHoursOnEdit').value,
				'durationMinutes': document.getElementById('durationMinutesOnEdit').value,
				'typeId': $scope.selectedType,
				'status': status, // ? to check
				'comment': $scope.commentOnEdit,
				'year': $scope.currentYear,
				'classSections': $scope.selectedClassSections,
				'classTeachers': $scope.selectedClassTeachers,
				'selectedPeriodStartDate': $scope.selectedPeriodStartDate,
				'selectedPeriodEndDate': $scope.selectedPeriodEndDate,
				'userId': $scope.userinfo[0].id
			};
			// console.log(data);
			$scope.loading += 1;
			$http.post(url, data).success(function (data) {
				// alert(data);
				if (data) { // if true
					angular.element(document.querySelector('#editSuccess')).show();
					if ($scope.selectedType == 1) {
						angular.element(document.querySelector('#editSuccessDifferentDayTimeDuration')).show();
					}
					setTimeout(function () {
						angular.element(document.querySelector('#editSuccess')).hide();
						angular.element(document.querySelector('#editSuccessDifferentDayTimeDuration')).hide();
						// if Success close modal window
						angular.element(document.querySelector('#editReservation')).modal('hide');
						$scope.getCalendarEvents();
					}, 3000);
				} else {
					angular.element(document.querySelector('#roomBusyOnEdit')).show();
				}
				$scope.loading -= 1;
			}).error(function (error) {
				angular.element(document.querySelector('#editError')).show();
				setTimeout(function () {
					angular.element(document.querySelector('#editError')).hide();
				}, 3000);
				$scope.loading -= 1;
			});
		};

		$scope.resetDate = function () {
			var dateTmp = document.getElementById("cancelledIdOnEdit").value;
			if (dateTmp != "") {
				$scope.event.date = dateTmp.substring(6, 10) + "-" + dateTmp.substring(3, 5) + "-" + dateTmp.substring(0, 2);
				$scope.reset($scope.event);
			}
		};

		// reset calendarEvent
		$scope.reset = function (event) {
			console.log(event);
			var url = "/admin/resetDate";

			var data = {
				'parentEventId': event.id,
				'dateToReset': event.date
			};
			console.log(data);
			$scope.loading += 1;
			$http.post(url, data).success(function (data) {
				// alert(data);
				if (data) { // deleted row -- should be == 1 (row)
					angular.element(document.querySelector('#resetSuccess')).show();
					setTimeout(function () {
						angular.element(document.querySelector('#resetSuccess')).hide();
						// // if Success close modal window
						angular.element(document.querySelector('#editReservation')).modal('hide');
						$scope.getCalendarEvents();
					}, 3000);
				}
				$scope.loading -= 1;
			}).error(function (error) {
				angular.element(document.querySelector('#resetError')).show();
				setTimeout(function () {
					angular.element(document.querySelector('#resetError')).hide();
				}, 3000);
				$scope.loading -= 1;
			});
		};

		// delete calendarEvent
		$scope.delete = function () {
			var url = "/admin/deleteEvent";

			var data = {
				'calendarId': $scope.selectedEventId
			};

			$scope.loading += 1;
			$http.post(url, data).success(function (data) {
				if (data) { // deleted row -- should be == 1 (row)
					angular.element(document.querySelector('#deleteSuccess')).show();
					setTimeout(function () {
						angular.element(document.querySelector('#deleteSuccess')).hide();
						// if Success close modal window
						angular.element(document.querySelector('#deleteReservation')).modal('hide');
						$scope.getCalendarEvents();
					}, 3000);
				}
				$scope.loading -= 1;
			}).error(function (error) {
				angular.element(document.querySelector('#deleteError')).show();
				setTimeout(function () {
					angular.element(document.querySelector('#deleteError')).hide();
				}, 3000);
				$scope.loading -= 1;
			});
		};

		$scope.cancelDate = function () {
			var dateTmp = document.getElementById("repeatIdOnEdit").value;
			if (dateTmp != "") {
				$scope.event.date = dateTmp.substring(6, 10) + "-" + dateTmp.substring(3, 5) + "-" + dateTmp.substring(0, 2);
				$scope.cancelEvent($scope.event);
			}
		};

		$scope.cancelEvent = function (event) {
			var url = "/admin/cancelEvent";

			var data = {
				'parentEventId': event.id,
				// 'date': event.start.format("YYYY-MM-DD"),
				'date': event.date,
				'unitId': event.unitId,
				'dayId': event.dayId,
				'hourId': event.hourId,
				'minutes': event.minutes,
				'roomId': event.roomData.id,
				'courseId': event.eventCourseId,
				'periodTypeId': $scope.selectedPeriod,
				'durationHours': event.durationHours,
				'durationMinutes': event.durationMinutes,
				'typeId': 3,
				'status': event.status,
				'comment': event.comment,
				'year': $scope.currentYear,
				'userId': $scope.userinfo[0].id

			};
			// console.log(data);
			$scope.loading += 1;
			$http.post(url, data).success(function (data) {
				// alert(data);
				if (data) { // if true
					angular.element(document.querySelector('#cancelSuccess')).show();
					setTimeout(function () {
						angular.element(document.querySelector('#cancelSuccess')).hide();
						// if Success close modal window
						angular.element(document.querySelector('#editReservation')).modal('hide');
						$scope.getCalendarEvents();
					}, 3000);
				}
				$scope.loading -= 1;
			}).error(function (error) {
				angular.element(document.querySelector('#cancelError')).show();
				setTimeout(function () {
					angular.element(document.querySelector('#cancelError')).hide();
				}, 3000);
				$scope.loading -= 1;
			});
		}

		$scope.acceptEvent = function (id) {
			var url = "/admin/acceptEvent";
			var data = {
				'id': id
			};
			// console.log(data);
			$scope.loading += 1;
			$http.post(url, data).success(function (data) {
				// alert(data);
				if (data) { // if true
					angular.element(document.querySelector('#acceptSuccess')).show();
					setTimeout(function () {
						angular.element(document.querySelector('#acceptSuccess')).hide();
						// if Success close modal window
						$scope.getCalendarEvents();
					}, 3000);
				}
				$scope.loading -= 1;
			}).error(function (error) {
				angular.element(document.querySelector('#acceptError')).show();
				setTimeout(function () {
					angular.element(document.querySelector('#acceptError')).hide();
				}, 3000);
				$scope.loading -= 1;
			});
		}

		$scope.rejectEvent = function (id, msg) {

			if (!document.getElementById("rejectionMsg").value) {
				document.getElementById("rejectMsgWarning").innerHTML = '<font color="red">Δεν έχετε συμπληρώσει τo λόγο της κράτησης!</font>';
				return;
			}
			var url = "/admin/rejectEvent";
			var data = {
				'id': id,
				'message': msg
			};
			// console.log(data);
			$scope.loading += 1;
			$http.post(url, data).success(function (data) {
				// alert(data);
				if (data) { // if true
					angular.element(document.querySelector('#rejectSuccess')).show();
					setTimeout(function () {
						angular.element(document.querySelector('#rejectSuccess')).hide();
						// if Success close modal window
						angular.element(document.querySelector('#rejectModal')).modal('hide');
						$scope.getCalendarEvents();
					}, 3000);
				}
				$scope.loading -= 1;
			}).error(function (error) {
				angular.element(document.querySelector('#rejectError')).show();
				setTimeout(function () {
					angular.element(document.querySelector('#rejectError')).hide();
				}, 3000);
				$scope.loading -= 1;
			});
		}

		// VALIDATIONS
		$scope.reservationDateError = false;
		$scope.$watch('formData.reservationDateError', function (value) {
			if (checkDate(value) || value == null) {
				$scope.reservationDateError = false;
			} else {
				$scope.reservationDateError = "Η ημερομηνία δεν είναι σωστή";
			}
		});
		$scope.reservationDateOnEditError = false;
		$scope.$watch('formData.reservationDateOnEditError', function (value) {
			if (checkDate(value) || value == null) {
				$scope.reservationDateOnEditError = false;
			} else {
				$scope.reservationDateOnEditError = "Η ημερομηνία δεν είναι σωστή";
			}

		});


	}]);