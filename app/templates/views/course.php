<div id="loading" ng-show="loading">
	<img id="loading-image" src="/img/default.gif" alt="Loading..."/>
</div>
<div class="container-fluid">
	<div id="content_info_columns">
		<div class="row filters dropdowns">
			<div class="input-group col-md-12 col-lg-4" id="period-year-div">
				<span class="input-group-addon">Περίοδος</span>
				<select id="period_year_select" name="period-year" class="form-control"
						ng-options="option.text for option in filterOptions track by option.value"
						ng-model="selectedPeriod" ng-change="periodChange()">
				</select>
			</div>
		</div>
		<div id="course_info" class="row">
			<span>
				<p class="content">
					<span id="title" ng-bind="course.title"></span>
					<span id="code" ng-bind="course.code"></span>
				</p>

				<div ng-if="scope.events.length > 0" id="course_warning" class="row">
					<h4><label style="display: inline-block; margin-top: 1em;" class="label label-danger">Δεν υπάρχουν καταχωρήσεις στο πρόγραμμα για αυτό το μάθημα την επιλεγμένη περίοδο</label></h4>
				</div>

				<div id="events-table" class="row content" ng-show="period <= 2" ng-if="course.semester">
					<strong class="label-course">Εβδομαδιαίο πρόγραμμα</strong><br/>
					<ul>
						<li ng-repeat="event in events">
							{{event.day}} {{event.start.slice(11,16)}}-{{event.end.slice(11,16)}} <a ng-href="#/room/{{event.roomData.id}}">{{event.roomData.name}}</a> {{evemt.comment}}
						</li>
					</ul>
				</div>

				<div id="events-table" class="row content" ng-show="period > 2 && period < 6" ng-if="course.semester">
					<strong class="label-course">Πρόγραμμα εξετάσεων</strong><br/>
					<ul>
						<li ng-repeat="event in events">
							{{event.day}} {{ event.start | date:'d/M' }} {{event.start.slice(11,16)}}-{{event.end.slice(11,16)}} <a ng-href="#/room/{{event.roomData.id}}">{{event.roomData.name}}</a> {{evemt.comment}}
						</li>
					</ul>
				</div>

				<div ng-show="period == 6">
					<strong class="label-course">Ετήσιο πρόγραμμα</strong><br/>

					<ul>
						<li ng-repeat="(periodId, events) in events">
							{{getPeriodString(periodId)}}

							<ul ng-show="periodId <= 2">
								<li ng-repeat="event in events">
									{{event.day}} {{event.start.slice(11,16)}}-{{event.end.slice(11,16)}} <a ng-href="#/room/{{event.roomData.id}}">{{event.roomData.name}}</a> {{evemt.comment}}
								</li>
							</ul>

							<ul ng-show="periodId > 2">
								<li ng-repeat="event in events">
									{{event.day}} {{ event.start | date:'d/M' }} {{event.start.slice(11,16)}}-{{event.end.slice(11,16)}} <a ng-href="#/room/{{event.roomData.id}}">{{event.roomData.name}}</a> {{evemt.comment}}
								</li>
							</ul>

						</li>
					</ul>
				</div>
				<p id="description" class="content">
					<strong class="label-course" ng-show="course.description">Περιγραφή</strong><br/>
					<span class="content" ng-bind="course.description"></span>
				</p>

				<p id="teachers" class="content">
					<strong class="label-course">Διδάσκοντες</strong><br/>
					<span class="content" ng-bind-html="course.teachers"></span>
				</p>

				<p id="semester" class="content" ng-if="course.semester">
					<strong class="label-course">Εξάμηνο</strong><br/>
					<span class="content" ng-bind="examIdToString(course.semester)"></span>
				</p>

				<div id="buttons">
					<ng-bind-html ng-bind-html="course.elearning"></ng-bind-html>
					<ng-bind-html ng-bind-html="course.qa_page"></ng-bind-html>
				</div>

			</span>
		</div>
  </div>
</div>
