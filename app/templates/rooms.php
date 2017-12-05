<div id="loading" ng-show="loading">
	<img id="loading-image" src="/img/default.gif" alt="Loading..."/>
</div>
﻿<div class="container-fluid">

    <div id="rooms_filters" class="row">
        {{ error_units }}
        <div class="col-md-6 col-xs-12">
            <label style="display:block;text-align:left;">Τύπος:</label>
            <select id="rooms_filter_type" class="form-control" placeholder="Επιλογή Τύπου" ng-change="change('type')" ng-model="type">
                <option selected value="">Καμία επιλογή</option>
                <option ng-repeat="type in roomTypes" value="{{ type }}">{{ type }}</option>
            </select>
        </div>

        <div class="filter col-md-6 col-xs-12">
            <label style="display:block;text-align:left;">Μονάδα:</label>
            <select id="unit_select" class="form-control" placeholder="Επιλογή Μονάδας" ng-change="change('unit')" ng-model="unit">
                <option selected value="">Καμία επιλογή</option>
                <option ng-repeat="unit in units" value="{{ unit.id }}">{{ '&nbsp;'.repeat((unit.level - 1) * 3) + unit.name }}</option>
            </select>
        </div>

    </div>

    <div class="row">
        <div class="col-sm-6">
            <div id="rooms-table_filter" class="table_filter_search">
                <label>
                    Αναζήτηση:
                    <input ng-change="change('search')" ng-model="search" placeholder="Αναζήτηση" class="form-control input-sm" type="search">
                </label>
            </div>
        </div>
        <div class="col-sm-6">
            <div id="rooms-table_length" class="table_filter_size">
                <label>Δείξε
                    <!-- TODO: This is a different case -->
                    <select class="form-control input-xs" ng-options="option.name for option in itemOptions track by option.value" ng-model="limitNumber" name="dataNumber">
                    </select> εγγραφές</label>
            </div>
        </div>
    </div>

    {{ error_rooms }}
    <table id="rooms-table" class="table dataTable table-striped table-bordered table-panchara" st-table="roomList" st-safe-src="rooms">
        <thead>
            <tr>
                <th class="sorting_disabled">Φωτογραφία</th>
                <th class="sorting" st-sort="name" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Πληροφορίες</th>
                <th class="sorting" st-sort="buildingDto.name" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Κτήριο</th>
                <th class="sorting" st-sort="type" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Τύπος</th>
                <th class="sorting" st-sort="unitName" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Μονάδα</th>
                <th class="sorting" st-sort="capacitySort" st-sort-default="reverse" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Θέσεις</th>
                <!-- <th class="sorting" st-sort="percentage"  st-class-ascent="sorting_asc" st-class-descent="sorting_desc" ng-show="roomsStatistics">Ποσοστό χρήσης (%)</th> -->
            </tr>
        </thead>

        <tbody>
            <tr ng-repeat="room in roomList">
                <td class="room_image" ng-bind-html="room.img"></td>
                <td>
                    <div class="room_primary_info">
                        <a ng-href="/#/room/{{ room.id }}">
                            <span class="room_name">{{ room.name }}</span>
                        </a>
                        <span class="opacity-half">{{ room.codeName }}</span>
                    </div>
                    <div class="room_secondary_info">
                        <span ng-bind-html="room.schedule"></span>
                        <span ng-bind-html="room.map"></span>
                        <span ng-bind-html="room.plan"></span>
                    </div>
                </td>
                <td class="room_building">{{ room.buildingData.name }}
                    <div class="opacity-half">({{ room.floor.string }})
                    </div>
                </td>
                <td class="room_type">{{ room.type }}</td>
                <td class="room_unit">{{ room.unitName }}</td>
                <td class="room_capacity">{{ room.capacity }}</td>
            </tr>
        </tbody>

        <tfoot>
            <tr>
                <td colspan="6" class="text-center">
                    <div st-pagination="" st-items-by-page="limitNumber.value" st-template="app/templates/pagination.custom.html"></div>
                </td>
            </tr>
        </tfoot>
    </table>

</div> <!-- div container -->
