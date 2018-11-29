angular
    .module('rooms')
    .controller('RoomAssignController', ["$scope", "$routeParams","$http", "$location", "filterFilter", function($scope, $routeParams, $http, $location, filterFilter) {
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
		$scope.roomassignList = [];
		ctrl.roomassignData = [];
		$scope.univUnits = [];
		$scope.unitsModal = [];
	    $scope.loading = true;
  		$scope.formData = {};
  		$scope.selectedUnit = -1;
  		$scope.modalUnit = -1;
		angular.element(document.getElementById("noUnitsWarning").innerHTML = "");
  		  				
		$('#unitsSelect').on('change', function() {
	      $scope.selectedUnit = $('#unitsSelect').val();
	      getUnitsListExceptForCurrentUnit($scope.selectedUnit);
	      $scope.getRoomAssignData(); 		
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
									$('#unitsSelect').trigger('change'); // Notify any JS components that the value change
								}
								$scope.getRoomAssignData();
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
       	
       	function getUnitsListExceptForCurrentUnit(unitId) {	
			$http.get("/calendar/getSimpleCalendarUnitsExceptForUnit/" + unitId).then(
	            function(response) {    		
	                $scope.units = response.data;
	                //								
					var unitsData = $.map($scope.units, function (obj) {
						obj.text = obj.name;
						return obj;
					});		
	
	      	  		$('#first').select2({
						placeholder: 'Επιλέξτε Μονάδα',
		 				data: unitsData
					});	
					// console.log(unitsData);	
			
	            }, function () {
	              console.error('Rrror while getting university unit data!');
	              $scope.loading = false;
	            }
        	); 
       	}
       	
       	// function getRoomListForUnit(unitId) {	
			// $http.get("/calendar/getGisRoomFavoriteForDepartment/" + unitId).then(
	        	// function(response) {
	        		// var roomsModal = response.data;
	        		// // units select2
					// var roomsData = $.map(roomsModal, function (obj) {
						// obj.text = obj.text || obj.name; // replace name with the property used for the text						
						// return obj;
					// });			
					// $('#roomsSelectAdd').select2({
					  // placeholder: "Επιλέξτε Αίθουσα",
					  // allowClear: true,
					  // data: roomsData
					// });		
					// return roomsModal;								        				        
// 				
	            // }, function(response) {
	        		// $scope.error_rooms = "Error while getting university room data!";
					// $scope.loading = false;
	    	 // });
       	// }
       	

  	     $scope.getRoomAssignData = function() {
  	     	if ($scope.selectedUnit > 0){
		 		$http.get('/calendar/getGisRoomFavoriteForDepartment/'+ $scope.selectedUnit).then(
	        	function(response) {
	              	$scope.roomassignList = response.data;
	               	ctrl.roomassignData = response.data;
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
	                    value: ctrl.roomassignData.length,
	                    name: 'All' 
		           	 });	
	           		$scope.loading = false;
	   		    	filterData();        		
	            }, function(response) {
	            	$scope.error_roomassign = "Error while getting room assignd data!";
	              	$scope.loading = false;
	        });    	 	     
		        
	 		}
	     };
 		 var filterData = function() {
            ctrl.roomassign = ctrl.roomassignData;
            if ($scope.search)
                ctrl.roomassign = filterFilter(ctrl.roomassign, $scope.search);
            $scope.roomassign = ctrl.roomassign;
            console.log("Filtered data!");
        }; 
              		
		$scope.openMap = function(buildingId) {		
			var mapsUrl = "https://maps.auth.gr/?lang=el&showBlds=" + buildingId + "&open="+ buildingId + "&type=1";
			window.open(mapsUrl, '_blank');
		};
		
		$scope.openInfo = function(CODE_NEW_ALL) {		
			var mapsUrl = "https://dc.ad.auth.gr/listBuildingData/StoixeiaAithousas.aspx?ID_AITHOUSAS_ALL=" + CODE_NEW_ALL;
			window.open(mapsUrl, '_blank');
		};
						
		$scope.openPhotos = function(PHOTO_FOLDER) {		
			var mapsUrl = "https://dc.ad.auth.gr/auth_management/DATA/PHOTOS/" + PHOTO_FOLDER + "/index.html";
			window.open(mapsUrl, '_blank');
		};
		
		$scope.openKatopsis = function(KATOPSI) {		
			var mapsUrl = "https://dc.ad.auth.gr/auth_management/DATA/PDF/" + KATOPSI;
			window.open(mapsUrl, '_blank');
		};
			
     	$scope.initialize = function(){	     
			var url = "/admin/initializefavrooms";
			var data = {
				'unitId' : $scope.selectedUnit
			};	
			$http.post(url, data).success(function(data) {
	 			// alert("Success"  + data);	
	 			window.location.assign(encodeURI(window.location.origin + "/#/roomassign"  + "?unitId="+ $scope.selectedUnit));	
	 			$scope.getRoomAssignData();
		 	}).error(function(error) {
				angular.element(document.querySelector('#initializeError')).show();
				setTimeout(function() {
			        $("#initializeError").alert('close');
			    }, 3000);
			});	
		};	
		
		angular.element(				
			$('.modal').on('hidden.bs.modal', function(){
				$("#roomForm")[0].reset();	
				document.getElementById("favRoom").value = "";			
			 })			
		); 
		
		$("#second").select2({
      		placeholder: 'Επιλέξτε Αίθουσα',
		});	
	     $scope.newModal = function(){	     	
	     	$('#first').val(null);
	     	$('#first').trigger('change'); // Notify any JS components that the value changed
	     	$('#second').val(null);
    		$('#second').trigger('change'); // Notify any JS components that the value changed

	    	$("#first").on("change", function () {
		    	var selectedModalUnit = $(this).val();	    	
    		 	$('#second').empty().trigger("change");      
		      	var rangeOptions = [];
		      	//////////////////
				$http.get("/calendar/getGisRoomsForDepartment/" + selectedModalUnit).then(
        		function(response) {
	        		var roomsModal = response.data;
	  				angular.forEach(roomsModal, function(value, key) {
    					var option = new Option(value.CODE_AITHOUSAS_ALLO, key);
					 	rangeOptions.push(option);
					});			        		
					$("#second option[value]").remove();      
					document.getElementById("favRoom").value = "";
      				$("#second").append(rangeOptions).val("").trigger("change");		        
				
	            }, function(response) {
	        		$scope.error_rooms = "Error while getting university room data!";
					$scope.loading = false;
	    	 	});
		      
		    });
		    
		    $("#second").on("change", function () {
		    	var selectedSecond = $("#second").select2('data')[0];
		    	if (selectedSecond){
		    		document.getElementById("favRoom").value = selectedSecond.text;
		    	}
		    });	
			angular.element(document.querySelector('#addRoomModal')).modal('show');
		};	 
		
		$scope.add = function() {
	    	var url = "/admin/addfavroom";
			var data = {
				'unitId' : $scope.selectedUnit,
				'roomId' : $("#second").val(),
				'favName': document.getElementById("favRoom").value
			};		
			// console.log(data);	
			$http.post(url, data).success(function(data) {
	 			if (data == "true"){
	 				angular.element(document.querySelector('#addSuccess')).show();
	 			}	
	 			else {
	 				angular.element(document.querySelector('#addError')).show();
	 			}
		 		setTimeout(function() {
			    	$("#addSuccess").alert('close');
    		    	$("#addError").alert('close');
		    		// if Success close modal window	
			    	angular.element(document.querySelector('#addRoomModal')).modal('hide');
			    	window.location.assign(encodeURI(window.location.origin + "/#/roomassign"  + "?unitId="+$scope.selectedUnit));
			    	$scope.getRoomAssignData(); 		
			    }, 3000);
		 	}).error(function(error) {
		 		// alert("error: " + error);
				angular.element(document.querySelector('#addError')).show();
				setTimeout(function() {
			        $("#addError").alert('close');
			    }, 3000);
			});
	    };
	    
		$scope.loadRoomData = function(index) {	
			// console.log($scope.roomassignList[index]);
			$scope.favID = $scope.roomassignList[index].id;
			document.getElementById("favRoomEdit").value = $scope.roomassignList[index].name;
			angular.element(document.querySelector('#editRoomModal')).modal('show');
		};
		
				
		$scope.edit = function() {
	    	var url = "/admin/editfavroom";
			var data = {
				'id' : $scope.favID,
				'favName': document.getElementById("favRoomEdit").value
			};		
			// console.log(data);	
			$http.post(url, data).success(function(data) {
				// console.log(data);
	 			if (data > 0){
	 				angular.element(document.querySelector('#editSuccess')).show();
	 			}	
	 			else {
	 				angular.element(document.querySelector('#editError')).show();
	 			}
		 		setTimeout(function() {
			    	$("#editSuccess").alert('close');
    		    	$("#editError").alert('close');
		    		// if Success close modal window	
			    	angular.element(document.querySelector('#editRoomModal')).modal('hide');
			    	window.location.assign(encodeURI(window.location.origin + "/#/roomassign"  + "?unitId="+$scope.selectedUnit));
			    	$scope.getRoomAssignData(); 		
			    }, 3000);
		 	}).error(function(error) {
		 		// alert("error: " + error);
				angular.element(document.querySelector('#editError')).show();
				setTimeout(function() {
			        $("#editError").alert('close');
			    }, 3000);
			});
	    };
	    
    	$scope.deleteRoomData = function(index) {
			$scope.favID = $scope.roomassignList[index].id;
			document.getElementById("favRoomDelete").value = $scope.roomassignList[index].name;
			angular.element(document.querySelector('#deleteRoomModal')).modal('show');
    	}
    	
    	$scope.delete = function() {
	    	var url = "/admin/deletefavroom";
			var data = {
				'id' : $scope.favID
			};		
			// console.log(data);
			$http.post(url, data).success(function(data) {
	 			if (data > 0){
	 				angular.element(document.querySelector('#deleteSuccess')).show();
	 			}	
	 			else {
	 				angular.element(document.querySelector('#deleteError')).show();
	 			}
		 		setTimeout(function() {
			    	$("#deleteSuccess").alert('close');
    		    	$("#deleteError").alert('close');
		    		// if Success close modal window	
			    	angular.element(document.querySelector('#deleteRoomModal')).modal('hide');
			    	window.location.assign(encodeURI(window.location.origin + "/#/roomassign"  + "?unitId="+$scope.selectedUnit));
			    	$scope.getRoomAssignData(); 		
			    }, 3000);
		 	}).error(function(error) {
		 		// alert("error: " + error);
				angular.element(document.querySelector('#deleteError')).show();
				setTimeout(function() {
			        $("#deleteError").alert('close');
			    }, 3000);
			});
		};

		
			
    }]);

