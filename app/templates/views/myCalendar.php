
<div id="loading" ng-show="loading">
	<img id="loading-image" src="/img/default.gif" alt="Loading..."/>
</div>
<div class="container-fluid" ng-controller="CalendarController" ng-init="unitInit('<?php echo $user['authDepartmentId']?>')">
	<div id="content_info_columns">

				<div class="row filters">
					<div class="dropdowns">
						<div class="input-group col-md-12 col-lg-4" id="period-year-div">
							<span class="input-group-addon">Περίοδος</span>
							<select id="period_year_select" name="period-year" class="form-control"
									ng-options="option.text for option in filterOptions track by option.value"
									ng-model="selectedPeriod" ng-change="periodChange()">
							</select>
						</div>

						<div class="input-group col-md-4 col-lg-2">
							<span class="input-group-addon">Εξάμηνο</span>
							<select id="semester_select" name="examId" class="form-control" ng-model="semester"
								ng-options="s for s in semesters" ng-change="semesterChange()">
								<option value="">Όλα</option>
							</select>
						</div>
					</div>

					<div class="col-sm-12 checkbox">
						<label>
							<input id="codeSwap" type="checkbox" ng-model="codeSwap"> Εμφάνιση κωδικών μαθημάτων αντί τίτλων </input>
						</label>
					</div>


				</div> <!-- row filters -->

				<div class="row">
					<div class="events-status col-sm-10">
						<div class="logs" ng-show="!nEvents"><label class="label label-error"><i class="fa fa-warning" style="margin-right:0.5em;"></i>  Αδυναμία παραλαβής δεδομένων</label></div>
						<div class="results"><label class="label label-warning">Βρέθηκαν <span class="counter">{{nEvents}}</span> προγραμματισμένες κρατήσεις</label></div>
					</div>
					<div class="dropdown col-sm-1" ng-controller="ExportController">
							<button class="btn btn-warning dropdown-toggle" type="button"
								id="export-div" data-toggle="dropdown" aria-expanded="true">
								<span class="glyphicon glyphicon glyphicon-download"></span>&nbsp;Εξαγωγή προγράμματος
								<span class="caret"></span>
							</button>
							<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
								<li ng-repeat="exportOption in exportOptions" role="presentation">
									<a role="menuitem" tabindex="-1" ng-click="exportMyCalendar(exportOption.id)">{{exportOption.name}}</a>
								</li>
							</ul>
					</div>
				</div>




				<div style="margin-top: 1.5em;">
					<div id="calendar" ng-class="codeSwap ? 'codesOn' : ''" calendar="calendar" config="uiConfig.calendar" class="first-time" ui-calendar="uiConfig.calendar" ng-model="eventSources"><span class="first-time-text">Χρησιμοποιήστε τα φίλτρα για να δείτε το πρόγραμμα μιας σχολής ή συνδεθείτε με τον ιδρυματικό λογαριασμό σας.</span></div>
				</div>

	</div>

	<!-- Modal -->
  <div class="modal fade" id="createEventModal" role="dialog" ng-hide="error">
    <div class="modal-dialog">

      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Δημιουργία νέου γεγονότος</h4>
        </div>
        <div class="modal-body">
					<p>
						Ημερομηνία: {{date.format('DD-MM-YYYY')}}
					</p>
          <p>
						Ώρα έναρξης: <select ng-model="hour" ng-options="hour for hour in hoursAll" ng-change="date.hour(hour); updateDuration()"></select>:<select ng-model="minute" ng-options="minute for minute in minutes" ng-change="date.minute(minute); updateDuration()"></select>
					</p>
					<p>
						Διάρκεια: <select ng-model="durationHours" ng-options="hour for hour in hours" ng-change="updateDuration()"></select> ώρες, <select ng-model="durationMinutes" ng-options="minute for minute in minutes" ng-change="updateDuration()"></select> λεπτά
					</p>
					<p>
						Αίθουσα: <select name="room" ng-model="room" ng-options="room as (room.name || room.codeName) + ', ' + room.type for room in rooms track by room.id"></select>
					</p>
					<p>
						Μάθημα: <select name="course" ng-model="course" ng-options="course as course.courseTitle + ', ' + course.courseCode for course in courses track by course.eventId"></select>
					</p>
					<p>
						Σχόλιο: <input type="text" name="comment" value="" ng-model="comment">
					</p>
        </div>
        <div class="modal-footer">
					<button type="button" class="btn btn-success" data-dismiss="modal" ng-click="createEvent()">Δημιουργία</button>
          <button type="button" class="btn btn-danger" data-dismiss="modal">Άκυρο</button>
        </div>
      </div>

    </div>
  </div>

</div>

<!--	<form id="exportform" target="_blank" ng-hide="true" enctype="multipart/form-data" action="/download" method="POST">
        <input name="icalform_department" class="department" ng-value="unit.id"/>
        <input name="exportpdf_department" class="department" ng-value="unit.id"/>
        <input name="year" class="year" ng-value="year"/>
        <input name="period" class="period" ng-value="period"/>
        <input style="visibility:hidden;" type="submit" value="Export to csv">
    </form>
-->
