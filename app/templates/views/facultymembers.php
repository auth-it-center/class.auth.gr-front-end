<div id="loading" ng-show="ctrl.loading">
	<img id="loading-image" src="/img/default.gif" alt="Loading..."/>
</div>
<div class="container">
  <label>Αναζήτηση: <input ng-model="ctrl.searchText"></label>

	<div ng-if="ctrl.searchText.length > 2" class="panel panel-default">

			<ul class="list-group">
					<li class="list-group-item" ng-repeat="faculty in ctrl.facultyMembers | filter:ctrl.searchText">
						<ul style="list-style-type: none">
							<li><h4>
								<a href="/#/faculty/{{faculty.apmId}}" target="_blank">{{faculty.fullname}}</a><br>
								<small>{{faculty.unitName}}</small>
							</h4></li>
							<li>
								{{faculty.duration_hours}}
								<span ng-if="faculty.duration_hours != 1">ώρες</span>
								<span ng-if="faculty.duration_hours == 1">ώρα</span>
								διδασκαλίας σε
								{{faculty.events_count}}
								<span ng-if="faculty.events_count != 1">μαθήματα</span>
								<span ng-if="faculty.events_count == 1">μαθήμα</span>
								*
							</li>
						</ul>
					</li>

		  </ul>

	</div>

  <div ng-if="ctrl.searchText.length <= 2" class="panel-group">
  	<div class="panel panel-default" ng-repeat="unit in ctrl.unitFacultyMembers" >
    <div class="panel-heading">
      <h4 class="panel-title">
        <a data-toggle="collapse" href="#collapse{{unit.unitId}}" onclick="return false;">{{unit.name}}</a>
      </h4>
    </div>
    <div id="collapse{{unit.unitId}}" class="panel-collapse collapse">
      <div class="panel-body">
        <ul class="list-group">
          <li class="list-group-item" ng-repeat="faculty in unit.facultyMembers">
            <ul style="list-style-type: none">
              <li><h4><a href="/#/faculty/{{faculty.apmId}}" target="_blank">{{faculty.fullname}}</a></h4></li>
              <li>
								{{faculty.duration_hours}}
								<span ng-if="faculty.duration_hours != 1">ώρες</span>
								<span ng-if="faculty.duration_hours == 1">ώρα</span>
								διδασκαλίας σε
								{{faculty.events_count}}
								<span ng-if="faculty.events_count != 1">μαθήματα</span>
								<span ng-if="faculty.events_count == 1">μαθήμα</span>
								*
							</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
	</div>

	<p>
		* το τρέχον ακαδημαϊκό έτος
	</p>

</div>
