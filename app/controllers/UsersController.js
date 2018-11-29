angular
    .module('rooms')
    .controller('UsersController', ["$scope", "$http", "$location", "filterFilter", function($scope, $http, $location, filterFilter) {
        // The default page limit number
        $scope.limitNumber = {
            value: 25,
            name: '25'
        };
    	// The page limit options
        $scope.itemOptions = [{
            value: 25,
            name: '25'
        }, {
            value: 50,
            name: '50'
        }, {
            value: 100,
            name: '100'
        }, {
            value: 200,
            name: '200'
        }];
		var ctrl = this;
	    $scope.userList = [];
	    ctrl.userData = [];
	    $scope.loading = true;
    	$scope.univUnits = [];	  
    	$scope.formData = {};  
	   	$scope.adminRights = [{id: '0', name:'Διαχειριστής Τμήματος'}, {id: '1', name:'Κεντρικός Διαχειριστής'}];
	   	$scope.canAccess = false;	   		  
	   	
		$scope.userInit = function(apm) {		
			// console.log(apm.length);
			if (apm.length>0){
				$scope.canAccess = true;
			}
		};
		
	 		   	
       	$http.get('/calendar/getSimpleCalendarUnits').then(
        	function(response) {
	        	$scope.univUnits = response.data;
	        	//
	        	var unitsdata = $.map($scope.univUnits, function (obj) {
					obj.text = obj.text || obj.name; // replace name with the property used for the text						
					return obj;
				});			
				$('#unitsSelectAdd').select2({
				  placeholder: " Επιλογή ",
				  allowClear: true,
				  data: unitsdata
				});
            }, function(response) {
        		$scope.error_units = "Error while getting university unit data!";
				$scope.loading = false;
    	 });

  	 	$scope.selectedUnits = [];  

	   	$('#unitsSelectAdd').on('change', function() {
	      $scope.selectedUnits = $('#unitsSelectAdd').val();
	    });

		$scope.loadUserData = function(index, userid) {
        	var unitsdata = $.map($scope.univUnits, function (obj) {
				obj.text = obj.text || obj.name; // replace name with the property used for the text						
				return obj;
			});			
			$('#unitsSelectEdit').select2({
			  placeholder: " Επιλογή ",
			  allowClear: true,
			  data: unitsdata
			});
			 		 	
		   	$('#unitsSelectEdit').on('change', function() {
		      $scope.selectedUnits = $('#unitsSelectEdit').val();
		    });
			//	
			$userinfo = $scope.userList[index];
			// Fill in formdata based on userid
			$scope.formData.id = $userinfo.id;
			$scope.formData.name = $userinfo.name;
			$scope.formData.email = $userinfo.email;
			$scope.formData.staff_aem = $userinfo.staff_aem;		
			for (var key in $scope.adminRights) {
				if ($userinfo.isAdmin == $scope.adminRights[key].name)
					$scope.formData.isAdmin = $scope.adminRights[key];
			}
			angular.forEach($scope.userList[index].userUnits[0], function(value, key) {
				// console.log(value);
				$scope.selectedUnits.push(value.id);
			});
			$('#unitsSelectEdit').val($scope.selectedUnits);
			$('#unitsSelectEdit').trigger('change'); // Notify any JS components that the value changed

			angular.element(document.querySelector('#editUserModal')).modal('show');
		};
		
		angular.element(				
			$('.modal').on('hidden.bs.modal', function(){
				$scope.selectedUnits = [];
				$("#userForm")[0].reset();
				
			 })			
		);  
		$scope.newModal = function(){
			$('#unitsSelectAdd').val(null);
			$('#unitsSelectAdd').trigger('change'); // Notify any JS components that the value changed		     	;
			angular.element(document.querySelector('#addUserModal')).modal('show');
		};		
		
		$scope.delete = function() {
			var url = "/admin/deleteuser";
			var data = {
				'id' : $scope.formData.id
			};
			$http.post(url, data).success(function(data) {
		 		// alert("Success"  + data);		
	 			angular.element(document.querySelector('#deleteSuccess')).show();
		 		setTimeout(function() {
			    	$("#deleteSuccess").alert('close');
		    		location.reload();
			    }, 3000);
		 	}).error(function(error) {
	 		 	// alert("Error" + error);
			 	// var out = '';
				// for (var i in error) {
				    // error += i + ": " + error[i] + "\n";
				// }
				// alert(out);
				angular.element(document.querySelector('#deleteError')).show();
				setTimeout(function() {
			        $("#deleteError").alert('close');
			    }, 3000);
			});			
		};
		
		$scope.edit = function() {
			var url = "/admin/edituser";
			var data = {
				'id' : $scope.formData.id,
				'name' : $scope.formData.name,
				'email' : $scope.formData.email,
				'staff_aem' : $scope.formData.staff_aem,
				'isAdmin': $scope.formData.isAdmin,
				'univUnits': $scope.selectedUnits
			};
			// console.log(data);
			$http.post(url, data).success(function(data) {
		 		// alert("Success"  + data);		
	 			angular.element(document.querySelector('#editSuccess')).show();
		 		setTimeout(function() {
			    	$("#editSuccess").alert('close');
		    		// if Success close modal window	
			    	angular.element(document.querySelector('#editUserModal')).modal('hide');
			    	location.reload();
			    }, 3000);
		 	}).error(function(error) {
		 		// alert("Error" + error);
			 	// var out = '';
				// for (var i in error) {
				    // error += i + ": " + error[i] + "\n";
				// }
				// alert(out);
				angular.element(document.querySelector('#editError')).show();
				setTimeout(function() {
			        $("#editError").alert('close');
			    }, 3000);
			});
		};

		
	    $scope.add = function() {
			var url = "/admin/adduser";
			var data = {
				'name' : $scope.formData.name,
				'email' : $scope.formData.email,
				'staff_aem' : $scope.formData.staff_aem,
				'isAdmin': $scope.formData.isAdmin.id,
				'univUnits': $scope.selectedUnits
			};
			// console.log(data);
			$http.post(url, data).success(function(data) {
		 		// alert("Success"  + data);		
		 		angular.element(document.querySelector('#addedSuccess')).show();
		 		setTimeout(function() {
			    	$("#addedSuccess").alert('close');
		    		// if Success close modal window	
			    	angular.element(document.querySelector('#addUserModal')).modal('hide');
			    	location.reload();
			    }, 3000);
		 	}).error(function(error) {
		 		//alert("Error" + error);
			 	// var out = '';
				// for (var i in error) {
				    // error += i + ": " + error[i] + "\n";
				// }
				// alert(out);
				angular.element(document.querySelector('#addedError')).show();
				setTimeout(function() {
			        $("#addedError").alert('close');
			        angular.element(document.querySelector('#addUserModal')).modal('hide');
			    }, 3000);
			});
	    };
	    
		$scope.deleteUserData = function(index, userid) {
			var unitsdata = $.map($scope.univUnits, function (obj) {
				obj.text = obj.text || obj.name; // replace name with the property used for the text						
				return obj;
			});			
			$('#unitsSelectDelete').select2({
			  placeholder: " Επιλογή ",
			  allowClear: true,
			  data: unitsdata
			});
			
			$userinfo = $scope.userList[index];
			// Fill in formdata based on userid
			$scope.formData.id = $userinfo.id;
			$scope.formData.name = $userinfo.name;
			$scope.formData.email = $userinfo.email;
			$scope.formData.staff_aem = $userinfo.staff_aem;		
			for (var key in $scope.adminRights) {
				if ($userinfo.isAdmin == $scope.adminRights[key].name)
					$scope.formData.isAdmin = $scope.adminRights[key];
			}
			angular.forEach($scope.userList[index].userUnits[0], function(value, key) {
				$scope.selectedUnits.push(value.id);
			});
			$('#unitsSelectDelete').val($scope.selectedUnits);
			$('#unitsSelectDelete').trigger('change'); // Notify any JS components that the value changed
			angular.element(document.querySelector('#deleteUserModal')).modal('show');
		};
		
        	
		// Basic content for page	    	    
        $http.get('/calendar/getUsers').then(
        	function(response) {
              	$scope.userList = response.data.users;
               	ctrl.userData = response.data.users;
              	$scope.itemOptions.push({
                    value: ctrl.userData.length,
                    name: 'All'
           		});
           		$scope.loading = false;
   		    	filterData();        		
            }, function(response) {
            	$scope.error_user = "Error while getting user data!";
              	$scope.loading = false;
        });         			       
        
            
        var filterData = function() {
            ctrl.users = ctrl.userData;
            
            if ($scope.search)
                ctrl.users = filterFilter(ctrl.users, $scope.search);
            $scope.users = ctrl.users;
            console.log("Filtered data!");
        };
        	        
	
    	
    }]);

