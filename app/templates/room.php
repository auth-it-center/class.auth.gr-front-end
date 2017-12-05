<div class="container-fluid">

	<div class="panel panel-default">
		<a class="panel-default" data-toggle="collapse" href="#collapseRoomInfo" aria-expanded="true" onclick="return false;">
	    <div class="panel-heading">
	      <h4 class="panel-title">
					{{room.name}}<span class="glyphicon glyphicon-chevron-down" style="float: right;"></span>
	      </h4>
	    </div>
		</a>
    <div id="collapseRoomInfo" class="panel-collapse collapse in">
      <div id="room_info" class="panel-body">

				<div class="row">
					<div class="col-md-2" ng-bind-html="room.img"></div>

					<div class="col-md-2">
						<div class="type"><span class="content">{{room.type}}</span></div>
						<div class="name"><div class="content">{{room.name}}</div></div>
						<div class="code"><span class="content">{{room.code}}</span></div>
						<div>
							<div class="unitName separator"><span class="content">{{room.unitName}}</span></div>
							<div class="buildingName"><span class="content">Κτίριο: {{room.buildingData.name}}, </span></div>
							<div class="floor"><span class="content">{{room.floor.string}}</span></div>
						</div>
						<div>
							<p>Ποσοστό χρήσης αίθουσας στο {{ getPeriodString(period) }}: {{roomStatistics.usage.percentage}}% </p>
						</div>
						<div class="buttons">
							<span ng-bind-html="room.map"></span>
							<span ng-bind-html="room.plan"></span>
						</div>
					</div>
				</div> <!-- room_info -->

      </div> <!-- panel-body -->
    </div> <!-- collapseRoomInfo -->
  </div> <!-- panel body -->



	<div ng-show="showError" id="room_warning" class="row">
		<label style="display: inline-block; margin-top: 1em;" class="label label-warning">Δεν υπάρχουν καταχωρήσεις στο πρόγραμμα αυτής της αίθουσας</label>
	</div>

	<div id="calendar" ng-class="codeSwap ? 'codesOn' : ''" ng-hide="showError" calendar="calendar" config="uiConfig.calendar" class="first-time" ui-calendar="uiConfig.calendar" ng-model="eventSources"><span class="first-time-text">Χρησιμοποιήστε τα φίλτρα για να δείτε το πρόγραμμα μιας σχολής ή συνδεθείτε με τον ιδρυματικό λογαριασμό σας.</span></div>

</div>
