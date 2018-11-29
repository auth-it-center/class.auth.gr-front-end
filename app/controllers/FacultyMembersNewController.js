angular
    .module('rooms')
    .controller('FacultyMembersNewController', ["$scope", "$routeParams","$http", "$location", "filterFilter", function($scope, $routeParams, $http, $location, filterFilter) {
	var ctrl = this;

  	ctrl.searchText = '';
  	ctrl.loading = true;
  
	$("#unitsSelect").select2({
	placeholder: 'Επιλέξτε Τμήμα',
	   allowClear: false
	});


	$http.get("/calendar/getCalendarUnits").then(
    	function(response) {
    		$scope.univUnits = response.data;
			//
	        var options = [];			        
			angular.forEach($scope.univUnits, function(value, key) {
				var option = new Option(value.name, value.id);
			 	options.push(option);
			});
			$("#unitsSelect").append(options);
			loading = false;
        }, function(response) {
    		$scope.error_units = "Error while getting university unit data!";
			$scope.loading = false;
	 });

	$('#unitsSelect').on('change', function() {
		$scope.selectedUnit = $('#unitsSelect').val();
		// Load  unit faculty members
      		
		// CONTINUE HERE - SEPTEMBER 3
    });


///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 
  // function flatData(units) {
    // var temp = [];
    // units.forEach(function(unit) {
      // temp = temp.concat(unit.facultyMembers);
    // });
    // return temp;
  // }

  // $http.get("/calendar/getFacultyMembers")
    // .then(
      // function(response) {
        // response.data.forEach(function(unit) {
          // unit.facultyMembers.forEach(function(faculty) {
            // faculty.nameFull = faculty.firstname + ' ' + faculty.lastname;
            // faculty.fullname = faculty.lastname + ' ' + faculty.firstname;
            // faculty.unitName = unit.name;
          // });
        // });
        // ctrl.unitFacultyMembers = response.data;
        // ctrl.facultyMembers = flatData(response.data);
        // ctrl.loading = false;
      // },
      // function(error) {
        // ctrl.loading = false;
        // console.error("Error while geting faculty members data!");
      // }
    // );
// };



    }]);
