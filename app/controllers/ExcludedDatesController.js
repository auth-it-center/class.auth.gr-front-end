angular
    .module('rooms')
    .controller('ExcludedDatesController', ["$scope", "$http", "$location", "filterFilter", function($scope, $http, $location, filterFilter) {
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
		$scope.datesList = [];
		ctrl.datesData = [];
	    $scope.loading = true;
  		$scope.formData = {};
  		
    	angular.element(				
			$('.modal').on('hidden.bs.modal', function(){
				$("#datesForm")[0].reset();
				
			 })			
		);  
	     $scope.newModal = function(){
	     	$scope.startDateError = false;
	 	 	$scope.endDateError = false;
	 	 	angular.element(document.getElementById("selectedDatesWarning").innerHTML = "");
	 	 	angular.element(document.getElementById("selectedDatesWarningEdit").innerHTML = "");
			//
			angular.element(document.querySelector('#addExcludedDateModal')).modal('show');
		};	
		
		    
		// Basic content for page	    	    
        $http.get('/calendar/getInactiveDates').then(
        	function(response) {
              	$scope.datesList = response.data;
               	ctrl.datesData = response.data;
              	$scope.itemOptions.push({
                    value: ctrl.datesData.length,
                    name: 'All'
           		});
           		$scope.loading = false;
   		    	filterData();        		
            }, function(response) {
            	$scope.error_excludeddates = "Error while getting excluded dates data!";
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
            ctrl.dates = ctrl.datesData;
            
            if ($scope.search)
                ctrl.dates = filterFilter(ctrl.dates, $scope.search);
            $scope.dates = ctrl.dates;
            console.log("Filtered data!");
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
			
			// Validate that dates are real
			if (!checkDate($scope.formData.startDate) || !checkDate($scope.formData.endDate)){
				angular.element(
    			 	document.getElementById("selecteDatesWarning").innerHTML = '<font color="red">Δεν έχετε συμπληρώσει σωστά τις ημερομηνίες!</font>'
    			);
			 	return;
			}
			else {
				 angular.element(
				 	document.getElementById("selectedDatesWarning").innerHTML = ""
				 );
			}
			 
 	    	var url = "/admin/addexcludeddates";		
			var data = {
				'name' : $scope.formData.name,
				'startDate' :$scope.formData.startDate,
				'endDate' : $scope.formData.endDate
			};			
			$http.post(url, data).success(function(data) {
		 		// alert("Success"  + data);		
	 			angular.element(document.querySelector('#addSuccess')).show();
		 		setTimeout(function() {
			    	$("#addSuccess").alert('close');
		    		// if Success close modal window	
			    	angular.element(document.querySelector('#addExcludedDateModal')).modal('hide');
			    	location.reload();
			    }, 3000);
		 	}).error(function(error) {
		 		// alert("Error" + error);
				angular.element(document.querySelector('#addError')).show();
				setTimeout(function() {
			        $("#addError").alert('close');
			    }, 3000);
			});
	    };	
		
		$scope.loadExcludedDatesData = function(index) {
			$scope.formData.id = $scope.datesList[index].id;
			$scope.formData.name = $scope.datesList[index].name;
			$startDate = $scope.datesList[index].startDate;
			$scope.formData.startDate = $startDate.substring(8,10) + "-" + $startDate.substring(5,7) + "-" + $startDate.substring(0,4);
			$endDate = $scope.datesList[index].endDate;
			$scope.formData.endDate = $endDate.substring(8,10) + "-" + $endDate.substring(5,7) + "-" + $endDate.substring(0,4);
			angular.element(document.querySelector('#editExcludedDateModal')).modal('show');
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
    			 	document.getElementById("selecteDatesWarningEdit").innerHTML = '<font color="red">Η "Ημερομηνία Από" δε πρέπει να είναι μεγαλύτερη από την "Ημερομηνία Έως"!</font>'
    			);
			 	return;
			}
			else {
			 	 angular.element(
				 	document.getElementById("selecteDatesWarningEdit").innerHTML = ""
				 );
			}
					 
 	    	var url = "/admin/editexcludeddates";		
			var data = {
				'id' : $scope.formData.id,
				'name' : $scope.formData.name,
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
			    	angular.element(document.querySelector('#editExcludedDateModal')).modal('hide');
			    	location.reload();
			    }, 3000);
		 	}).error(function(error) {
		 		// alert("Error" + error);
				angular.element(document.querySelector('#editError')).show();
				setTimeout(function() {
			        $("#editError").alert('close');
			    }, 3000);
			});
	    };	

		$scope.deleteExcludedDatesData = function(index) {
			$scope.formData.id = $scope.datesList[index].id;
			$scope.formData.name = $scope.datesList[index].name;
			$startDate = $scope.datesList[index].startDate;
			$scope.formData.startDate = $startDate.substring(8,10) + "-" + $startDate.substring(5,7) + "-" + $startDate.substring(0,4);
			$endDate = $scope.datesList[index].endDate;
			$scope.formData.endDate = $endDate.substring(8,10) + "-" + $endDate.substring(5,7) + "-" + $endDate.substring(0,4);
			angular.element(document.querySelector('#deleteExcludedDateModal')).modal('show');
		};
		
		$scope.delete = function() { 	
 	    	var url = "/admin/deleteexcludeddates";		
			var data = {
				'id' : $scope.formData.id
			};			
			// console.log(data);
			$http.post(url, data).success(function(data) {
		 		// alert("Success"  + data);		
	 			angular.element(document.querySelector('#deleteSuccess')).show();
		 		setTimeout(function() {
			    	$("#deleteSuccess").alert('close');
		    		// if Success close modal window	
			    	angular.element(document.querySelector('#deleteExcludedDateModal')).modal('hide');
			    	location.reload();
			    }, 3000);
		 	}).error(function(error) {
		 		// alert("Error" + error);
				angular.element(document.querySelector('#deleteError')).show();
				setTimeout(function() {
			        $("#deleteError").alert('close');
			    }, 3000);
			});
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

