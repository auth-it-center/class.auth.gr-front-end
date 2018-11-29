<div id="loading" ng-show="loading">
  <img id="loading-image" src="/img/default.gif" alt="Loading..."/>
</div>

<div class="container-fluid">
    <h3 id="calendar_title" ng-show="unitHasCalendar">{{ unit.name }}</h3>

    <div class="panel panel-default">
      <a class="panel-default" data-toggle="collapse" href="#collapseSettings" aria-expanded="true" onclick="return false;" style="text-decoration: none; color: inherit;">
        <div class="panel-heading">
          <h4 class="panel-title">
            Φίλτρα και Ρυθμίσεις <span class="glyphicon glyphicon-chevron-down" style="float: right;"></span>
          </h4>
        </div>
      </a>
      <div id="collapseSettings" class="panel-collapse collapse in">
        <div class="panel-body">

          <div class="filters">
            <div class="dropdowns">
              <div class="input-group">
                <span class="input-group-addon">Τμήμα</span>
                <select id="unit_select" name="unitId" class="form-control"
                  ng-options="unit.name group by unit.parentName disable when unit.level == 1 || unit.hasCalendar == 0 for unit in unitsDropdown track by unit.id"
                  ng-model="unit" ng-change="unitChange()">
                  <option disabled="true" value="">Επιλέξτε τμήμα</option>
                </select>
              </div>

              <div class="input-group">
                <span class="input-group-addon">Περίοδος</span>
                <select id="period_year_select" name="period-year" class="form-control"
                  ng-options="option.text for option in filterOptions track by option.value"
                  ng-model="selectedPeriod" ng-change="periodChange()">
                </select>
              </div>

              <div class="input-group" ng-show="unit.id">
                <span class="input-group-addon">Εξάμηνο</span>
                <select id="semester_select" name="examId" class="form-control" ng-model="semester"
                  ng-options="s for s in semesters" ng-change="semesterChange()">
                  <option value="">Όλα</option>
                </select>
              </div>
            </div><!-- dropdowns -->

            <div class="checkbox">
              <label>
                <input id="codeSwap" type="checkbox" ng-model="codeSwap"> Εμφάνιση κωδικών μαθημάτων αντί τίτλων </input>
              </label>
            </div>
          </div>


        </div> <!-- panel-body -->
      </div> <!-- collapseSettings -->
    </div> <!-- panel body -->

    <div class="events-status" ng-hide="mobile">
      <div class="logs" ng-show="!nEvents">
				<label class="label label-error"><i class="fa fa-warning" style="margin-right:0.5em;"></i>  Αδυναμία παραλαβής δεδομένων</label>
			</div>

      <div class="results">
        <label ng-show="unitHasCalendar" class="label label-warning">
					Βρέθηκαν <span class="counter">{{nEvents}}</span> προγραμματισμένες κρατήσεις
				</label>
      </div>
    </div><!-- events-status -->

		<div id="error">
			<span style="font-size: 15px" ng-show="!unitHasCalendar" class="label label-danger">
			<i class="fa fa-warning" style="margin-right:0.5em;"></i>  Δεν υπάρχουν καταχωρήσεις προγράμματος για αυτό το τμήμα αυτή την περίοδο. Παρακαλώ επιλέξτε κάποιο άλλο τμήμα ή επιλέξτε άλλη περίοδο.
			</span>
		</div>

		<div class="dropdown pull-right" ng-show="unitHasCalendar" style="padding-left: 3px; padding-bottom: 1em;" ng-controller="ExportController">
			<button class="btn btn-warning dropdown-toggle" type="button"
				id="export-div" data-toggle="dropdown" aria-expanded="true">
			<span class="glyphicon glyphicon glyphicon-download"></span>&nbsp;Εξαγωγή προγράμματος
			<span class="caret"></span>
			</button>
			<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
				<li ng-repeat="exportOption in exportOptions" role="presentation">
					<a role="menuitem" tabindex="-1" ng-click="exportCalendar(exportOption.id)">{{exportOption.name}}</a>
				</li>
			</ul>
		</div>

    <div ng-show="unitHasCalendar" id="calendarDiv" class="row">
      <div id="calendar" ng-class="codeSwap ? 'codesOn' : ''" calendar="calendar" config="uiConfig.calendar" class="first-time" ui-calendar="uiConfig.calendar" ng-model="eventSources" ng-show="unit.id"><span class="first-time-text">Χρησιμοποιήστε τα φίλτρα για να δείτε το πρόγραμμα μιας σχολής ή συνδεθείτε με τον ιδρυματικό λογαριασμό σας.</span></div>
    </div>

    <p ng-hide="showWeekends" style="text-align: left">
      * Τα Σαββατοκύριακα δεν εμφανίζονται όταν δεν υπάρχουν κρατήσεις.
    </p>
</div>

<form id="exportform" target="_blank" ng-hide="true" enctype="multipart/form-data" action="/download" method="POST">
  <input name="icalform_department" class="department" ng-value="unit.id"/>
  <input name="exportpdf_department" class="department" ng-value="unit.id"/>
  <input name="year" class="year" ng-value="year"/>
  <input name="period" class="period" ng-value="period"/>
  <input style="visibility:hidden;" type="submit" value="Export to csv">
</form>
