angular
    .module('rooms')
    .controller('PeriodsUnitController', ["$scope", "$routeParams", "$http", "$location", "filterFilter", function($scope, $routeParams, $http, $location, filterFilter) {
    	var requestedPath = $location.$$path;
        // The default page limit number
        $scope.limitNumber = {
            value: 5,
            name: '5'
        };
    	// The page limit options
        $scope.itemOptions = [{
            value: 5,
            name: '5'
        }, {
            value: 10,
            name: '10'
        }, {
            value: 20,
            name: '20'
        }, {
            value: 30,
            name: '30'
        }];
		var ctrl = this;
		$scope.periodUnitList = [];
		$scope.periodTypes = [];
		$scope.univUnits = [];
	    ctrl.periodUnitData = [];
	    $scope.loading = true;
  		$scope.formData = {};
  		$scope.selectedUnit = -1;
  		$scope.selectedPeriod = -1;

		angular.element(document.getElementById("noUnitsWarning").innerHTML = "");

		$('#unitsSelect').on('change', function() {
	      // var data = $("#unitsSelect option:selected").text();
	      $scope.selectedUnit = $('#unitsSelect').val();
	      // console.log($scope.selectedUnit);
	      $scope.getUnitData();
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
	        		// units select2
					var unitsdata = $.map($scope.univUnits, function (obj) {
						obj.text = obj.text || obj.name; // replace name with the property used for the text
						return obj;
					});
					$('#unitsSelect').select2({
					  placeholder: "Επιλέξτε Μονάδα",
					  // allowClear: true,
					  data: unitsdata
					});
						//
		        	if ($scope.univUnits.length > 0) { // there is data
			 	       	// check route params - if unitId defined open selected unit
			        	if ($routeParams.unitId!=null){
								angular.forEach($scope.univUnits, function(value, key) {
								if (value.id == $routeParams.unitId){
									$scope.selectedUnit = value.id;
									$('#unitsSelect').val($scope.selectedUnit);
									$('#unitsSelect').trigger('change'); // Notify any JS components that the value changed
								}
								$scope.getUnitData();
							});
						}

		        	}
		        	else { // show warning
		        		console.log("No units matched for user");
	          			angular.element(document.getElementById("unitsSelect").style.display = 'none');
	  					angular.element(document.getElementById("noUnitsWarning").innerHTML = "Δεν έχει αντιστοιχηθεί κάποιο τμήμα - μονάδα στο λογαριασμό σας");
		        	}

					loading = false;
	            }, function(response) {
	        		$scope.error_units = "Error while getting university unit data!";
					$scope.loading = false;
	    	 });
       	}

    	 // Period Types
         $http.get('/calendar/getPeriodTypes').then(
        	function(response) {
              	$scope.periodTypes = response.data;
            }, function(response) {
            	$scope.error_periodtypes = "Error while getting period type data!";
              	$scope.loading = false;
         });

		var filterData = function() {
            ctrl.periodsUnit = ctrl.periodUnitData;

            if ($scope.search)
                ctrl.periodsUnit = filterFilter(ctrl.periodsUnit, $scope.search);
            $scope.periodsUnit = ctrl.periodsUnit;
            console.log("Filtered data!");
        };

	     $scope.getUnitData = function() {
	     	if ($scope.selectedUnit > 0){
				console.warn('getUnitData', $scope.selectedUnit)

		 		$http.get('/calendar/getUnitPeriods/'+ $scope.selectedUnit).then(
	        	function(response) {
	              	$scope.periodUnitList = response.data;
	               	ctrl.periodUnitData = response.data;
           	        $scope.itemOptions = [{
				            value: 5,
				            name: '5'
				        }, {
				            value: 10,
				            name: '10'
				        }, {
				            value: 20,
				            name: '20'
				        }, {
				            value: 30,
				            name: '30'
				        }];
	               	 $scope.itemOptions.push({
	                    value: ctrl.periodUnitData.length,
	                    name: 'All'
		           	 });
	           		$scope.loading = false;
	   		    	filterData();
	            }, function(response) {
	            	$scope.error_period = "Error while getting unit period data!";
	              	$scope.loading = false;
	        });

	 		}
	     };

     	angular.element(
			$('.modal').on('hidden.bs.modal', function(){
				$scope.selectedPeriod = -1;
				$("#periodForm")[0].reset();
			 })
		);
	     $scope.newModal = function(){
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
     		var perioddata = $.map($scope.periodTypes, function (obj) {
				obj.text = obj.text || obj.name; // replace name with the property used for the text
				return obj;
			});
     		$('#periodSelectAdd').select2({
			  placeholder: "Καθορίστε την περίοδο",
			  data: perioddata
			});
		 	$('#periodSelectAdd').on('change', function() {
		      // var data = $("#unitsSelect option:selected").text();
		      $scope.selectedPeriod = $('#periodSelectAdd').val();
	   	  	});

	     	//
     		$scope.startDateError = false;
	 	 	$scope.endDateError = false;
	 	 	angular.element(document.getElementById("selectedDatesWarning").innerHTML = "");
	 	 	angular.element(document.getElementById("selectedDatesWarningEdit").innerHTML = "");
			//
			angular.element(document.querySelector('#addPeriodModal')).modal('show');
		};

	    $scope.add = function() {

			 // Check for dates - startDate should be earlier than endDate
			 var arrStartDate = $scope.formData.startDate.split("-");
			 var arrStartDateString = arrStartDate[2] + "-" + arrStartDate[1] + "-" + arrStartDate[0];
		 	 var arrEndDate = $scope.formData.endDate.split("-");
	 	     var arrEndDateString = arrEndDate[2] + "-" + arrEndDate[1] + "-" + arrEndDate[0];

	 	     // Validate startDate < endDate
			 if (new Date(arrStartDateString) > new Date(arrEndDateString)){
			 	angular.element(
    			 	document.getElementById("selectedDatesWarning").innerHTML = '<font color="red">Η "Ημερομηνία Από" δε πρέπει να είναι μεγαλύτερη από την "Ημερομηνία Έως"!</font>'
    			 );
			 	return;
			 }
			 else {
			 	 angular.element(
				 	document.getElementById("selectedDatesWarning").innerHTML = ""
				 );
			 }

			// submit changes
			var url = "/admin/addunitperiod";
			var data = {
				'unitId' : $scope.selectedUnit,
				'periodTypeId' : $scope.selectedPeriod,
				'startDate' : $scope.formData.startDate,
				'endDate' : $scope.formData.endDate
			};
			$http.post(url, data).success(function(data) {
	 			//alert("Success"  + data);
	 			angular.element(document.querySelector('#addSuccess')).show();
		 		setTimeout(function() {
			    	$("#addSuccess").alert('close');
		    		// if Success close modal window
			    	angular.element(document.querySelector('#addPeriodModal')).modal('hide');
			    	window.location.assign(encodeURI(window.location.origin + "/#/periodsUnit"  + "?unitId="+$scope.selectedUnit));
			    	$scope.getUnitData();
			    }, 3000);
	 	}).error(function(error) {
			angular.element(document.querySelector('#addError')).show();
			setTimeout(function() {
		        $("#addError").alert('close');
		    }, 3000);
		});

	    };

     	$scope.edit = function() {
	   		 // Check for dates - startDate should be earlier than endDate
			 var arrStartDate = $scope.formData.startDate.split("-");
			 var arrStartDateString = arrStartDate[2] + "-" + arrStartDate[1] + "-" + arrStartDate[0];
		 	 var arrEndDate = $scope.formData.endDate.split("-");
	 	     var arrEndDateString = arrEndDate[2] + "-" + arrEndDate[1] + "-" + arrEndDate[0];

	 	     // Validate startDate < endDate
			 if (new Date(arrStartDateString) > new Date(arrEndDateString)){
			 	angular.element(
    			 	document.getElementById("selectedDatesWarningEdit").innerHTML = '<font color="red">Η "Ημερομηνία Από" δε πρέπει να είναι μεγαλύτερη από την "Ημερομηνία Έως"!</font>'
    			 );
			 	return;
			 }
			 else {
			 	 angular.element(
				 	document.getElementById("selectedDatesWarningEdit").innerHTML = ""
				 );
			 }

 	    	var url = "/admin/editunitperiod";
			var data = {
				'id' : $scope.formData.id,
				'unitId' : $scope.selectedUnit,
				'periodTypeId' : $scope.selectedPeriod,
				'startDate' :$scope.formData.startDate,
				'endDate' : $scope.formData.endDate
			};
			// console.log(data);
			$http.post(url, data).success(function(data) {
		 		// alert("Success"  + data);
	 			angular.element(document.querySelector('#editSuccess')).show();
		 		setTimeout(function() {
			    	$("#editSuccess").alert('close');
		    		// if Success close modal window
			    	angular.element(document.querySelector('#editPeriodModal')).modal('hide');
			    	//location.reload();
			    	window.location.assign(encodeURI(window.location.origin + "/#/periodsUnit"  + "?unitId="+$scope.selectedUnit));
			    	$scope.getUnitData();
			    }, 3000);
		 	}).error(function(error) {
		 		// alert(error);
				angular.element(document.querySelector('#editError')).show();
				setTimeout(function() {
			        $("#editError").alert('close');
			    }, 3000);
			});
	    };

	    $scope.delete = function() {
 	    	var url = "/admin/deleteunitperiod";
			var data = {
				'id' : $scope.formData.id,
			};
			$http.post(url, data).success(function(data) {
		 		// alert("Success"  + data);
	 			angular.element(document.querySelector('#deleteSuccess')).show();
		 		setTimeout(function() {
			    	$("#deleteSuccess").alert('close');
		    		// if Success close modal window
			    	angular.element(document.querySelector('#deletePeriodModal')).modal('hide');
			    	//location.reload();
			    	window.location.assign(encodeURI(window.location.origin + "/#/periodsUnit"  + "?unitId="+$scope.selectedUnit));
			    	$scope.getUnitData();
			    }, 3000);
		 	}).error(function(error) {
				angular.element(document.querySelector('#deleteError')).show();
				setTimeout(function() {
			        $("#deleteError").alert('close');
			    }, 3000);
			});
	    };



		$scope.loadPeriodData = function(index) {
			//
			var unitsdata = $.map($scope.univUnits, function (obj) {
				obj.text = obj.text || obj.name; // replace name with the property used for the text
				return obj;
			});
			$('#unitsSelectEdit').select2({
			  disabled : true,
			  placeholder: "Επιλέξτε Μονάδα",
			  data: unitsdata
			});
			$('#unitsSelectEdit').val($scope.selectedUnit);
			$('#unitsSelectEdit').trigger('change'); // Notify any JS components that the value changed
			//
			var perioddata = $.map($scope.periodTypes, function (obj) {
				obj.text = obj.text || obj.name; // replace name with the property used for the text
				return obj;
			});
     		$('#periodSelectEdit').select2({
			  placeholder: "Καθορίστε την περίοδο",
			  data: perioddata
			});
		 	$('#periodSelectEdit').on('change', function() {
		      // var data = $("#unitsSelect option:selected").text();
		      $scope.selectedPeriod = $('#periodSelectEdit').val();
	   	  	});
	   	  	//
			$scope.formData.id = $scope.periodUnitList[index].periodDepid;
			$scope.selectedPeriod = $scope.periodTypes[$scope.periodUnitList[index].id-1].id;
			$('#periodSelectEdit').val($scope.selectedPeriod);
			$('#periodSelectEdit').trigger('change'); //
			// $scope.selectedPeriod.push($scope.periodTypes[$scope.periodUnitList[index].id-1]);
			$startDate = $scope.periodUnitList[index].startDate;
			$scope.formData.startDate = $startDate.substring(8,10) + "-" + $startDate.substring(5,7) + "-" + $startDate.substring(0,4);
			$endDate = $scope.periodUnitList[index].endDate;
			$scope.formData.endDate = $endDate.substring(8,10) + "-" + $endDate.substring(5,7) + "-" + $endDate.substring(0,4);
			angular.element(document.querySelector('#editPeriodModal')).modal('show');
		};


		$scope.deletePeriodData = function(index) {
			//
			var unitsdata = $.map($scope.univUnits, function (obj) {
				obj.text = obj.text || obj.name; // replace name with the property used for the text
				return obj;
			});
			$('#unitsSelectDelete').select2({
			  disabled : true,
			  placeholder: "Επιλέξτε Μονάδα",
			  data: unitsdata
			});
			$('#unitsSelectDelete').val($scope.selectedUnit);
			$('#unitsSelectDelete').trigger('change'); // Notify any JS components that the value changed
			//
			var perioddata = $.map($scope.periodTypes, function (obj) {
				obj.text = obj.text || obj.name; // replace name with the property used for the text
				return obj;
			});
     		$('#periodSelectDelete').select2({
 			  disabled : true,
			  placeholder: "Καθορίστε την περίοδο",
			  data: perioddata
			});
	   	  	//
			$scope.formData.id = $scope.periodUnitList[index].periodDepid;
			$scope.selectedPeriod = $scope.periodTypes[$scope.periodUnitList[index].id-1].id;
			$('#periodSelectDelete').val($scope.selectedPeriod);
			$('#periodSelectDelete').trigger('change'); //
			$startDate = $scope.periodUnitList[index].startDate;
			$scope.formData.startDate = $startDate.substring(8,10) + "-" + $startDate.substring(5,7) + "-" + $startDate.substring(0,4);
			$endDate = $scope.periodUnitList[index].endDate;
			$scope.formData.endDate = $endDate.substring(8,10) + "-" + $endDate.substring(5,7) + "-" + $endDate.substring(0,4);
			angular.element(document.querySelector('#deletePeriodModal')).modal('show');
		};

	     // VALIDATIONS
	 	$scope.startDateError = false;
		$scope.$watch('formData.startDate', function (value) {
		    if (checkDate(value) || value == null){
		    	$scope.startDateError = false;
		    } else {
		      $scope.startDateError = "Η ημερομηνία δεν είναι σωστή";
		     }
		});

		$scope.endDateError = false;
		$scope.$watch('formData.endDate', function (value) {
		    if (checkDate(value) || value == null){
    	 		$scope.endDateError = false;
		    } else {
		      $scope.endDateError = "Η ημερομηνία δεν είναι σωστή";
		     }
		});


    }]);

