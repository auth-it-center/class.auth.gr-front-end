angular
    .module('rooms')
    .controller('UnitCoursesController', ["$scope", "$routeParams","$http", "$location", "filterFilter", function($scope, $routeParams, $http, $location, filterFilter) {
    	var requestedPath = $location.$$path;
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
            value: 50,
            name: '50'
        }];
		var ctrl = this;
		$scope.unitCoursesList = [];
		ctrl.unitCoursesData = [];
		$scope.univUnits = [];
	 	$scope.loading = true;
  		$scope.selectedUnit = 0;
		$scope.selectedYear = 0;
		$scope.selectedPeriod = 0;
  		$scope.currentYear = 0;
  		
  		
	    // Get global periods in order to get current year
		$http.get('/calendar/getPeriods').then(
        	function(response) {
             	$scope.currentYear = response.data[getCurrentPeriodIndex(response.data)].year;
     	  		console.log($scope.currentYear-2);
				// Get past 3 years
  				$scope.previousYears = [
  				{id: $scope.currentYear-3, text: ($scope.currentYear-3) + '-' + ($scope.currentYear-2)}, 
  				{id: $scope.currentYear-2, text: ($scope.currentYear-2) + '-' + ($scope.currentYear-1)},
  				{id: $scope.currentYear-1, text: ($scope.currentYear-1) + '-' + ($scope.currentYear)}, 
  				{id: $scope.currentYear, text: $scope.currentYear + '-' + (parseInt($scope.currentYear) + 1)}];
            }, function(response) {
            	$scope.error_period = "Error while getting period data!";
              	$scope.loading = false;
        });     
  		

		$scope.periods = [{id: 1, text: 'Χειμερινή'}, {id: 2, text: 'Εαρινή'}];
		angular.element(document.getElementById("noUnitsWarning").innerHTML = "");
		
		
		$("#unitsSelect").select2({
			placeholder: 'Επιλέξτε Μονάδα',
		    allowClear: false
		});
			   
		$('#unitsSelect').on('change', function() {
			$scope.selectedUnit = $('#unitsSelect').val();
			//
	      	if ($scope.selectedUnit > 0) {
	      	   	$("#yearSelect").select2({
			 		placeholder: 'Προηγούμενο έτος',
			    	data: $scope.previousYears
		    	}); 		
	    	}
	    	if($scope.selectedUnit > 0 && $scope.selectedYear > 0 && $scope.selectedPeriod > 0){
				window.location.assign(encodeURI(window.location.origin + "/#/unitcourses"  + "?unitId="+$scope.selectedUnit + "&year=" +$scope.selectedYear + "&period=" +$scope.selectedPeriod)); 	
	   			$scope.getUnitCoursesData();			   				
   			}	
	    });
	    //
		$('#yearSelect').on('change', function() {
			$scope.selectedYear = $('#yearSelect').val();
			//
		 	if ($scope.selectedYear > 0) {
	      	   	$("#periodSelect").select2({
			 		placeholder: 'Καθορίστε την περίοδο',
			    	data: $scope.periods
		    	}); 		
	    	}
	    	if($scope.selectedUnit > 0 && $scope.selectedYear > 0 && $scope.selectedPeriod > 0){
				window.location.assign(encodeURI(window.location.origin + "/#/unitcourses"  + "?unitId="+$scope.selectedUnit + "&year=" +$scope.selectedYear + "&period=" +$scope.selectedPeriod)); 	
	   			$scope.getUnitCoursesData();			   				
   			}	
	    });
	    //
	    $('#periodSelect').on('change', function() {
	    	$scope.selectedPeriod = $('#periodSelect').val();
	    	if($scope.selectedUnit > 0 && $scope.selectedYear > 0 && $scope.selectedPeriod > 0){
				window.location.assign(encodeURI(window.location.origin + "/#/unitcourses"  + "?unitId="+$scope.selectedUnit + "&year=" +$scope.selectedYear + "&period=" +$scope.selectedPeriod)); 	
	   			$scope.getUnitCoursesData();			   				
   			}	
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
									$('#unitsSelect').val($scope.selectedUnit);
									$('#unitsSelect').trigger('change'); // Notify any JS components that the value changed
								}
							});
						}
						if ($routeParams.year!=null){
							$scope.selectedYear = $routeParams.year;
							$('#yearSelect').val($scope.selectedYear);
							$('#yearSelect').trigger('change');
						}	
						if ($routeParams.period!=null){
							$scope.selectedPeriod = $routeParams.period;
							$('#periodSelect').val($scope.selectedPeriod);
							$('#periodSelect').trigger('change');
						}		
							
		        	}	
					loading = false;
	            }, function(response) {
	        		$scope.error_units = "Error while getting university unit data!";
					$scope.loading = false;
	    	 });
       	}

  	     $scope.getUnitCoursesData = function() {  	     
     	 	if ($scope.selectedUnit > 0){
    	 		var url = '/calendar/getPastCoursesForDepartment/'+ $scope.selectedUnit+'/'+$scope.selectedYear+'/'+$scope.selectedPeriod;
    	 		// console.log(url);
  	    	 	$http.get(url).then(function(response) {
	              	$scope.unitCoursesList = response.data;
	               	ctrl.unitCoursesData = response.data;
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
				            value: 50,
				            name: '50'
			         }];
	               	 $scope.itemOptions.push({
	                    value: ctrl.unitCoursesData.length,
	                    name: 'All' 
		           	 });	
	           		$scope.loading = false;
	   		    	filterData();        		
	            }, function(response) {
	            	$scope.error_unitcourses = "Error while getting unit courses data!";
	              	$scope.loading = false;
	        });    	 	     
		        
	 		}
	     };
 		 var filterData = function() {
            ctrl.unitCourses = ctrl.unitCoursesData;
            
            if ($scope.search)
                ctrl.unitCourses = filterFilter(ctrl.unitCourses, $scope.search);
            $scope.unitCourses = ctrl.unitCourses;
            console.log("Filtered data!");
        }; 
              		
			
    }]);

