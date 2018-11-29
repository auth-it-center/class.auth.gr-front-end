<div id="loading" ng-show="loading">
	<img id="loading-image" src="/img/default.gif" alt="Loading..."/>
</div>
<div class="container" style="text-align: center">
	<div class="row filters">

		<div class="dropdowns">

			<div class="input-group" id="period-year-div">
				<span class="input-group-addon">Περίοδος</span>
				<select id="period_year_select" name="period-year" class="form-control"
						ng-options="option.text for option in filterOptions track by option.value"
						ng-model="selected" ng-change="update(selected)">
				</select>
			</div>

			<div ng-hide="mobile" id="help"> <p> Επιλέξτε τμήμα από τα παρακάτω που έχουν καταθέσει πρόγραμμα για τη συγκεκριμένη περίοδο</p>
			</div>

		</div>
	</div> <!-- row -->

	<div class="row">
		<div id="front" class="first-time span6 offset3">
			<ul class="list-unstyled" ng-repeat="faculty in units" ng-if="faculty.departments.length != 0">
				<h3>{{ faculty.name }}</h3>
				<li ng-repeat="department in faculty.departments">
					<a ng-if="department.hasCalendar > 0" href="/#/calendar/?unitId={{department.id}}&period={{period}}&year={{year}}">{{department.name}}</a>
					<span class="text-muted" ng-if="department.hasCalendar == 0">{{department.name}} *</span>
				</li>
			</ul>
		</div>
	</div> <!-- row -->

	<div class="row">
		<small>* Το τμήμα δεν έχει κάνει καταχωρήσεις μαθημάτων στο ωρολόγιο πρόγραμμα</small>
	</div>

</div>
