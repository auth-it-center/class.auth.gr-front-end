<div id="loading" ng-show="ctrl.loading">
	<img id="loading-image" src="/img/default.gif" alt="Loading..."/>
</div>

<div class="container">
	<label>Αναζήτηση: <input ng-model="ctrl.searchText"></label>

	<div ng-if="ctrl.searchText.length > 2" class="panel panel-default">

			<ul class="list-group">
					<li class="list-group-item" ng-repeat="course in ctrl.courses | filter:ctrl.searchText">
						<ul style="list-style-type: none">
							<li><h4><a href="/#/course/{{course.courseId}}?period={{2 - course.semesterId % 2}}" target="_blank">{{course.courseTitle}}-{{course.courseCode}}</a></h4></li>
							<li>Εξάμηνο: {{ctrl.examIdToString(course.semesterId)}}</li>
							<li>Τμήμα: {{course.unitName}}</li>
							<li class="list-group-item" ng-repeat="course in semester.courses">
								<ul style="list-style-type: none">
									<li><h4><a href="/#/course/{{course.courseId}}?period={{2 - semester.semesterId % 2}}" target="_blank">{{course.courseTitle}}-{{course.courseCode}}</a></h4></li>
									<li>
										{{course.duration_hours}}
										<span ng-if="course.duration_hours != 1">ώρες</span>
										<span ng-if="course.duration_hours == 1">ώρα</span>
										διδασκαλίας σε
										{{course.events_count}}
										<span ng-if="course.duration_hours != 1">κρατήσεις</span>
										<span ng-if="course.duration_hours == 1">κράτηση</span>
										κάθε εβδομάδα
										<span ng-if="semester.semesterId < 200">στο</span>
										<span ng-if="semester.semesterId >= 200">του</span>
										{{ctrl.examIdToString(semester.semesterId)}}
									</li>
								</ul>
							</li>
						</ul>
					</li>

		  </ul>

	</div>

	<div ng-if="ctrl.searchText.length <= 2" class="panel-group">
	  <div class="panel panel-default" ng-repeat="unit in ctrl.unitCourses | filter: ctrl.searchText" >
	    <div class="panel-heading">
	      <h4 class="panel-title">
	        <a data-toggle="collapse" href="#collapse{{unit.unitId}}" onclick="return false;">{{unit.name}}</a>
	      </h4>
	    </div>

	    <div id="collapse{{unit.unitId}}" class="panel-collapse collapse">

	      <div class="panel-body">
						<div class="panel-group">
						  <div class="panel panel-default" ng-repeat="semester in unit.semesters" >
						    <div class="panel-heading">
						      <h4 class="panel-title">
						        <a data-toggle="collapse" href="#collapse{{unit.unitId}}{{semester.semesterId}}" onclick="return false;">{{ctrl.examIdToString(semester.semesterId)}}</a>
						      </h4>
						    </div>

						    <div id="collapse{{unit.unitId}}{{semester.semesterId}}" class="panel-collapse collapse">
						      <div class="panel-body">

										<ul class="list-group">
						          <li class="list-group-item" ng-repeat="course in semester.courses">
						            <ul style="list-style-type: none">
						              <li><h4><a href="/#/course/{{course.courseId}}?period={{2 - semester.semesterId % 2}}" target="_blank">{{course.courseTitle}}-{{course.courseCode}}</a></h4></li>
						              <li>
														{{course.duration_hours}}
														<span ng-if="course.duration_hours != 1">ώρες</span>
														<span ng-if="course.duration_hours == 1">ώρα</span>
														διδασκαλίας σε
														{{course.events_count}}
														<span ng-if="course.duration_hours != 1">κρατήσεις</span>
														<span ng-if="course.duration_hours == 1">κράτηση</span>
														κάθε εβδομάδα
														<span ng-if="semester.semesterId < 200">στο</span>
														<span ng-if="semester.semesterId >= 200">του</span>
														{{ctrl.examIdToString(semester.semesterId)}}
													</li>
						            </ul>
						          </li>
						        </ul>

						      </div>
						    </div>

						  </div>
						</div>

	      </div> <!-- panel-body -->

	    </div>

	  </div>
	</div>
</div>
