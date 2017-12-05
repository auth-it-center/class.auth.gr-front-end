angular
    .module('rooms')
    .controller('RoomsController', ["$scope", "$http", "$location", "filterFilter", function($scope, $http, $location, filterFilter) {
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
        $scope.roomList = [];
        ctrl.roomData = [];
        $scope.loading = true;

        // $scope.type = "";
        // $scope.unit = "";
        // $scope.search = "";

        // var period = getRoomPeriodIndex();
        // $http.get('https://ws-ext.it.auth.gr/calendar/getRoomsUsageStatistics?period=' + period)
        //     .then(function(response) {
        //         $scope.roomsStatistics = response.data;
        //         ctrl.roomData = formatRoomData(ctrl.roomData);
        //         filterData();
        //     }, function() {
        //         console.error("Error while getting rooms statistics!");
        //     });

        $http.get('https://ws-ext.it.auth.gr/calendar/getCalendarUnits') // TODO: HIT REAL SERVER
            .then(function(responce) {
                $scope.units = formatUnitData(responce.data);
            }, function(responce) {
                $scope.error_units = "Error while getting unit data!";
            });

        $http.get('https://ws-ext.it.auth.gr/calendar/getRooms') // TODO: HIT REAL SERVER
            .then(function(responce) {
                ctrl.roomData = formatRoomData(responce.data);
                $scope.itemOptions.push({
                    value: ctrl.roomData.length,
                    name: 'All'
                });
                $scope.loading = false;
                parseURL();
                filterData();
            }, function(responce) {
                $scope.error_rooms = "Error while getting rooms!";
                $scope.loading = false;
            });

        var filterData = function() {
            ctrl.rooms = ctrl.roomData;
            if ($scope.type)
                ctrl.rooms = filterFilter(ctrl.rooms, $scope.type);
            if ($scope.unit && ctrl.unitMap && ctrl.unitMap[$scope.unit])
                ctrl.rooms = filterFilter(ctrl.rooms, ctrl.unitMap[$scope.unit].name);
            if ($scope.search)
                ctrl.rooms = filterFilter(ctrl.rooms, $scope.search);
            $scope.rooms = ctrl.rooms;
            console.log("Filtered data!");
        };

        var parseURL = function() {
            var params = $location.search();
            if (params.type)
                $scope.type = params.type;
            if (params.unit)
                $scope.unit = params.unit;
            if (params.search)
                $scope.search = params.search;
        };

        $scope.change = function(input) {
            switch (input) {
                case 'type':
                    if ($scope.type)
                        $location.search(input, $scope.type);
                    else
                        $location.search(input, null);
                    break;
                case 'search':
                    if ($scope.search)
                        $location.search(input, $scope.search);
                    else
                        $location.search(input, null);
                    break;
                case 'unit':
                    if ($scope.unit)
                        $location.search(input, $scope.unit);
                    else
                        $location.search(input, null);
                    break;
            }
            filterData();
        };

        // helper function to format room data
        var formatRoomData = function(rooms) {
            roomTypes = Array();
            for (var i = 0; i < rooms.length; i++) {
                var room = rooms[i];
                if (room.codeName) {
                    room.img = '<img class="first_img" src="https://classschedule.auth.gr/img/photos/' + room.codeName + '.jpg" alt="">';
                } else {
                    room.codeName = "-";
                    console.warn("Invalid codeName!");
                }
                if (!room.id) {
                    // room.id = 0;
                    console.warn("Invalid ID");
                } else {
                    room.schedule = '<a class="btn btn-default btn-sm m-right" href="/#/room/' + room.id + '"><span class="glyphicon glyphicon-calendar"></span> Πρόγραμμα</a>';
                }
                if (!room.name) {
                    room.name = "ΑΙΘΟΥΣΑ";
                }
                if (room.type === null || room.type == '-' || room.type === '') {
                    room.type = "-ΧΩΡΙΣ ΔΗΛΩΜΕΝΟ ΤΥΠΟ-";
                }
                if (!room.buildingId) {
                    console.warn("Invalid buildingId!");
                } else {
                    room.map = '<a class="btn btn-default btn-sm m-right" target="_blank" href="http://maps.auth.gr/?lang=el&showBlds=' + room.buildingId + '&open=' + room.buildingId + '&type=1"><span class="glyphicon glyphicon-map-marker"></span> Τοποθεσία στον χάρτη</a>';
                }
                if (room.topView) {
                    room.plan = '<a class="btn btn-default btn-sm m-right" target="_blank" href="http://dc.ad.auth.gr/auth_management/DATA/PDF/' + room.topView + '"><span class="glyphicon glyphicon-th"></span> Κάτοψη</a>';
                } else {
                    //console.warn("Invalid pdfFolder!");
                }
                if (!room.buildingData.name) {
                    console.warn("Invalid buildingDto.name!");
                }
                if (!room.unitName) {
                    console.warn("Invalid unitName!");
                }
                if (room.photoFolder) {
                    //console.warn("Invalid fotoFolder!");
                    room.img = '<a target="_blank" href="http://dc.ad.auth.gr/auth_management/DATA/PHOTOS/' + room.photoFolder + '/index.html" class="first_img">' + room.img + '</a>';
                }
                // push the unique room types into an array
                if (roomTypes.indexOf(room.type) == -1) {
                    roomTypes.push(room.type);
                }
                // if ($scope.roomsStatistics) {
                //   room.percentage = parseFloat($scope.roomsStatistics[room.id].usage.percentage);
                // }
            }
            roomTypes.sort();
            $scope.roomTypes = roomTypes;
            return rooms;
        };

        // helper function to format  data
        var formatUnitData = function(units) {
            // It is used to map unit objects with their id to ng-model assign the unit select on html
            ctrl.unitMap = new Map();
            for (var i = 0; i < units.length; i++) {
                var unit = units[i];
                ctrl.unitMap[unit.id] = unit;
            }
            return units;
        };

        $scope.capacitySort = function(room) {
            if (room.capacity == '-') {
                return 0;
            } else {
                return parseInt(room.capacity);
            }
        };
    }]);
