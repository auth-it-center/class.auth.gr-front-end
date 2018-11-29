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
		<div id="teacher_info" class="row">
			<p class="content">
				<strong ng-bind="teacher.name"></strong><span id="code">( {{teacher.title}} )</span></br>
				<a ng-href="/#/calendar/?unitId={{teacher.deptCode}}&period={{period}}"><span ng-bind="teacher.department"></span></a>
			</p>

			<div id="events-table" class="row content" ng-show="period <= 2">
				<strong class="label-course">Εβδομαδιαίο πρόγραμμα</strong><br/>
				<ul>
					<li ng-repeat="courseEvents in events">
						<div ng-if="courseEvents[0].courseData"> <!-- if calendar event -->
							<a target="_blank" ng-href="/#/course/{{courseEvents[0].courseData.courseId}}?period={{period}}">
								<strong ng-bind="courseEvents[0].title"></strong>
							</a>

							<ul>
								<li ng-repeat="event in courseEvents">
									{{getDay(event.dayId)}} {{event.start.slice(11,16)}}-{{event.end.slice(11,16)}} <a ng-href="#/room/{{event.roomData.id}}">{{event.roomData.name}}</a> {{event.comment}}
								</li>
							</ul>
						</div> 
						<div ng-if="!courseEvents[0].courseData">  <!-- if NOT calendar event -->
							<a target="_blank" ng-href="/#/course/{{courseEvents[0].courseid}}?period={{period}}">
								<strong ng-bind="courseEvents[0].coursetitle"></strong>
							</a>
						</div>
				
					</li>				
				</ul>
			</div>

			<div id="events-table" class="row content" ng-show="period > 2 && period < 6">
				<strong class="label-course">Πρόγραμμα εξετάσεων</strong><br/>

				<ul>

					<li ng-repeat="courseEvents in events">
						<a target="_blank" ng-href="/#/course/{{courseEvents[0].courseData.courseId}}?period={{period}}">
							<strong ng-bind="courseEvents[0].title"></strong>
						</a>

						<ul>
							<li ng-repeat="event in courseEvents">
								{{ event.start | date:'d/M' }} {{event.start.slice(11,16)}}-{{event.end.slice(11,16)}} <a ng-href="#/room/{{event.roomData.id}}">{{event.roomData.name}}</a> {{event.comment}}
							</li>
						</ul>
					</li>

				</ul>
			</div>

			<div ng-show="period == 6">
				<strong class="label-course">Ετήσιο πρόγραμμα</strong><br/>

				<ul ng-show="period == 6">
					<li ng-repeat="(periodId, events) in events">
						{{getPeriodString(periodId)}}

						<ul ng-show="periodId <= 2">
							<li ng-repeat="courseEvents in events">
								
								<div ng-if="courseEvents[0].courseData">  <!-- if calendar event -->
									<a target="_blank" ng-href="/#/course/{{courseEvents[0].courseData.courseId}}?period={{periodId}}">
										<strong ng-bind="courseEvents[0].title"></strong>
									</a>

									<ul>
										<li ng-repeat="event in courseEvents">
											{{getDay(event.dayId)}} {{event.start.slice(11,16)}}-{{event.end.slice(11,16)}} <a ng-href="#/room/{{event.roomData.id}}">{{event.roomData.name}}</a> {{event.comment}}
										</li>
									</ul>
								</div>
								<div ng-if="!courseEvents[0].courseData">  <!-- if NOT calendar event -->
									<a target="_blank" ng-href="/#/course/{{courseEvents[0].courseid}}?period={{period}}">
										<strong ng-bind="courseEvents[0].coursetitle"></strong>
									</a>
								</div>
							
							</li>					
						</ul>

						<ul ng-show="periodId> 2">
							<li ng-repeat="courseEvents in events">
								<a target="_blank" ng-href="/#/course/{{courseEvents[0].courseData.courseId}}?period={{periodId}}">
									<strong ng-bind="courseEvents[0].title"></strong>
								</a>

								<ul>
									<li ng-repeat="event in courseEvents">
										{{ event.start | date:'d/M' }} {{event.start.slice(11,16)}}-{{event.end.slice(11,16)}} <a ng-href="#/room/{{event.roomData.id}}">{{event.roomData.name}}</a> {{event.comment}}
									</li>
								</ul>

							</li>
						</ul>

					</li>
				</ul>
			</div>

			<div ng-show="showError" id="course_warning" class="row">
				<label style="display: inline-block; margin-top: 1em;" class="label label-danger">Δεν υπάρχουν καταχωρήσεις στο πρόγραμμα για το επιλεγμένο μέλος ΔΕΠ την επιλεγμένη περίοδο</label>
			</div>

			<!-- <p id="buttons" ng-hide="showError">
				<ng-bind-html ng-bind-html="teacher.qa_page"></ng-bind-html>
			</p> -->
		</div>
  </div>
</div>
