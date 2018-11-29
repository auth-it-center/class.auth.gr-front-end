angular
    .module('rooms')
    .controller('PeriodsController', ["$scope", "$http", "$location", "filterFilter", function($scope, $http, $location, filterFilter) {
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
		$scope.periodList = [];
		$scope.periodTypes = [];
	    ctrl.periodData = [];
	    $scope.loading = true;
  		$scope.formData = {};
  		// $scope.multiselectsettings = { scrollableHeight: '250px', scrollable: true, enableSearch: true, smartButtonMaxItems: 100, displayProp: 'name', idProperty: 'name', selectionLimit: 1, buttonClasses:'white-space: normal', closeOnSelect: true};
  		//$scope.translationtexts = {checkAll: 'Επιλογή όλων', uncheckAll: 'Αποεπιλογή', searchPlaceholder: 'Αναζήτηση...', buttonDefaultText: 'Καθορίστε την περίοδο'};
  		$scope.selectedPeriod = -1;
		angular.element(				
			$('.modal').on('hidden.bs.modal', function(){
				$scope.selectedPeriod = -1;
				$("#periodForm")[0].reset();
				
			 })			
		);  	    
		// Basic content for page	    	    
        $http.get('/calendar/getPeriods').then(
        	function(response) {
              	$scope.periodList = response.data;
               	ctrl.periodData = response.data;
              	$scope.itemOptions.push({
                    value: ctrl.periodData.length,
                    name: 'All'
           		});
           		$scope.loading = false;
   		    	filterData();        		
            }, function(response) {
            	$scope.error_period = "Error while getting period data!";
              	$scope.loading = false;
        });    
        
		// Period Types	    	    
        $http.get('/calendar/getPeriodTypes').then(
        	function(response) {
              	$scope.periodTypes = response.data;
            }, function(response) {
            	$scope.error_periodtypes = "Error while getting period type data!";
              	$scope.loading = false;
        });    
        
        var filterData = function() {
            ctrl.periods = ctrl.periodData;
            
            if ($scope.search)
                ctrl.periods = filterFilter(ctrl.periods, $scope.search);
            $scope.periods = ctrl.periods;
            console.log("Filtered data!");
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
 	    	var url = "/admin/editperiod";		
			var data = {
				'id' : $scope.formData.id,
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
			    	location.reload();
			    }, 3000);
		 	}).error(function(error) {
				angular.element(document.querySelector('#editError')).show();
				setTimeout(function() {
			        $("#editError").alert('close');
			    }, 3000);
			});
	    };
	    
		$scope.loadPeriodData = function(index) {
			$scope.startDateError = false;
	 	 	$scope.endDateError = false;
 	 		angular.element(document.getElementById("selectedDatesWarningEdit").innerHTML = "");
			//
			var perioddata = $.map($scope.periodTypes, function (obj) {
				obj.text = obj.text || obj.name; // replace name with the property used for the text						
				return obj;
			});		
     		$('#periodSelectEdit').select2({
 			  disabled : true,
			  placeholder: "Καθορίστε την περίοδο",
			  data: perioddata
			});	 
	   	  	//			
			$scope.formData.id = $scope.periodList[index].id;
			$scope.selectedPeriod = $scope.periodTypes[index].id;
			$('#periodSelectEdit').val($scope.selectedPeriod);
			$('#periodSelectEdit').trigger('change'); //
			$startDate = $scope.periodList[index].startDate;
			//$scope.formData.startDateReverse = $startDate;
			$scope.formData.startDate = $startDate.substring(8,10) + "-" + $startDate.substring(5,7) + "-" + $startDate.substring(0,4);
			$endDate = $scope.periodList[index].endDate;
			//$scope.formData.endDateReverse = $endDate;
			$scope.formData.endDate = $endDate.substring(8,10) + "-" + $endDate.substring(5,7) + "-" + $endDate.substring(0,4);
			angular.element(document.querySelector('#editPeriodModal')).modal('show');
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

