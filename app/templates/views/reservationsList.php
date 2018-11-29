<div id="loading" ng-show="loading > 0" style="z-index: 1041">
  <img id="loading-image" src="/img/default.gif" alt="Loading..."/>
</div>
<div class="container-fluid" ng-init="userInit('<?php echo $user['authAPM']?>')">

	<h2 align="center">Κρατήσεις</h2>
	<div class="row" align="center">
		<h5 id="noUnitsWarning"></h5>
		<!-- <div class="col-sm-6">	  	   -->
		<select id="unitsSelect" style="width: 50%;">
			<option></option>
		</select>
		<br /><br />
		<select id="periodsSelect" style="width: 50%;" hidden>
			<option></option>
		</select>
	</div>
	<div class="events-status" ng-hide="mobile">
		<div class="logs" ng-show="!nEvents">
			<label class="label label-error"><i class="fa fa-warning" style="margin-right:0.5em;"></i> Αδυναμία παραλαβής
				δεδομένων</label>
		</div>

		<div class="results">
			<br />
			<label ng-show="selectedUnit>0 && selectedPeriod>0 && cevents.length!=0" class="label label-warning">
				Βρέθηκαν <span class="counter">{{numOfEvents}}</span> προγραμματισμένες κρατήσεις
			</label>
		</div>
	</div><!-- events-status -->

	<div id="error">
		<span style="font-size: 15px" ng-show="selectedUnit>0 && selectedPeriod>0 && numOfEvents==0" class="label label-danger">
			<i class="fa fa-warning" style="margin-right:0.5em;"></i> Δεν υπάρχουν καταχωρήσεις κρατήσεις για αυτό το τμήμα και
			περίοδο.
		</span>
		<br /><br />
	</div>

	<div class="alert alert-danger alert-dismissible" id="roomBusyOnResize" hidden>
		<button type="button" class="close" data-dismiss="alert">&times;</button>
		Υπάρχει άλλη κράτηση για την επιλεγμένη αίθουσα!
	</div>
	<div class="alert alert-success" id="editSuccessOnResize" hidden>
		Τροποποιήθηκε η κράτηση!
	</div>
	<div class="alert alert-danger" id="editErrorOnResize" hidden>
		Υπήρξε ένα πρόβλημα κατά την τροποποίηση της κράτησης!
	</div>
	<div class="alert alert-success" id="editSuccessOnDragAndDrop" hidden>
		Τροποποιήθηκε η κράτηση!
	</div>
	<div class="alert alert-warning" id="editSuccessOnDragAndDropDifferentDay" hidden>
		Διαγράφηκαν τυχόν ακυρωμένες κρατήσεις λόγω μεταφοράς της τακτικής σε άλλη ημέρα!
	</div>
	<div class="alert alert-danger alert-dismissible" id="roomBusyOnDragAndDrop" hidden>
		<button type="button" class="close" data-dismiss="alert">&times;</button>
		Υπάρχει άλλη κράτηση για την επιλεγμένη αίθουσα!
	</div>
	<div class="alert alert-danger" id="editErrorOnDragAndDrop" hidden>
		Υπήρξε ένα πρόβλημα κατά την τροποποίηση της κράτησης!
	</div>
	<div class="alert alert-danger" id="dragOutOfPeriodScope" hidden>
		Η ημερομηνία που θέλετε να μεταφέρε την κράτηση είναι εκτός ορίων της περιόδου που έχετε επιλέξει! (
		{{selectedPeriodStartDate.substring(8,10)}}-{{selectedPeriodStartDate.substring(5,7)}}-{{selectedPeriodStartDate.substring(0,4)}}
		έως
		{{selectedPeriodEndDate.substring(8,10)}}-{{selectedPeriodEndDate.substring(5,7)}}-{{selectedPeriodEndDate.substring(0,4)}})
	</div>
	<div class="alert alert-success" id="acceptSuccess" hidden>
		<button type="button" class="close" data-dismiss="alert">&times;</button>
		Έγινε αποδεκτή η κράτηση!
	</div>
	<div class="alert alert-danger" id="acceptError" hidden>
		<button type="button" class="close" data-dismiss="alert">&times;</button>
		Υπήρξε ένα πρόβλημα κατά την αποδοχή της κράτησης!
	</div>

	<div ng-show="selectedUnit>0 && selectedPeriod>0" class="row">
		<div class="col-sm-6">
			<button id="insert" class="btn btn-success" ng-click="addEvent()" type="button">
				<span class="glyphicon glyphicon-plus-sign"></span>&nbsp;Νέα κράτηση
			</button>
			<button id="gotoCalendar" class="btn btn-default" ng-click="goToFullCalendar()" type="button"><span class="glyphicon glyphicon-calendar"></span>&nbsp;Ημερολόγιο
				Κρατήσεων</button>
		</div>

		<div class="col-sm-6" ng-show="cevents.length>0">
			<div id="users-table_length" class="table_filter_size">
				<label>Δείξε
					<select class="form-control input-xs" ng-options="option.name for option in itemOptions track by option.value"
					    ng-model="limitNumber" name="dataNumber">
					</select> εγγραφές</label>
			</div>
		</div>
	</div>

	<div ng-show="selectedUnit>0 && selectedPeriod>0 && cevents.length>0" class="dropdown pull-right" style="padding-left: 3px; padding-bottom: 1em;"
	    ng-controller="ExportController">
		<button class="btn btn-warning dropdown-toggle" type="button" id="export-div" data-toggle="dropdown" aria-expanded="true">
			<span class="glyphicon glyphicon glyphicon-download"></span>&nbsp;Εξαγωγή κρατήσεων
			<span class="caret"></span>
		</button>
		<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
			<li ng-repeat="exportOption in exportOptions" role="presentation">
				<a role="menuitem" tabindex="-1" ng-click="exportCalendarList(exportOption.id)">{{exportOption.name}}</a>
			</li>
		</ul>
	</div>
	<div ng-show="selectedUnit>0 && selectedPeriod>0" class="pull-right" style="padding-left: 3px; padding-bottom: 1em;" >
		<button class="btn btn-info dropdown-toggle" type="button" id="import-div" ng-click="showImportForm()">
			<span class="glyphicon glyphicon-upload"></span>&nbsp;Εισαγωγή προγράμματος
		</button>
	</div>


	{{ error_events }}
	<table id="users-table" class="table dataTable table-striped table-bordered table-panchara" st-table="ceventsList"
	    st-safe-src="cevents" ng-show="selectedUnit>0 && selectedPeriod>0 && cevents.length>0">
		<thead>
			<tr>
				<th class="sorting" st-sort="type" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Τύπος</th>
				<th class="sorting" st-sort="date" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Ημερομηνία</th>
				<th class="sorting" st-sort="datetime" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Ημέρα & Ώρα</th>
				<th class="sorting" st-sort="duration" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Διάρκεια</th>
				<th class="sorting" st-sort="room" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Αίθουσα</th>
				<th class="sorting" st-sort="course" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Λόγος κράτησης</th>
				<th class="sorting" st-sort="instructors" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Υπεύθυνος</th>
				<th class="sorting" st-sort="status" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Κατάσταση</th>
				<th>Επιλογές</th>
			</tr>
			<tr>
				<th colspan="9"><input st-search="" class="form-control" placeholder="Αναζήτηση..." type="search" /></th>
			</tr>
		</thead>
		<tbody>
			<tr ng-repeat="event in ceventsList"><br />
				<td class="type">{{event.type}}</td>
				<td class="date">{{event.eventDate}}</td>
				<td class="datetime">{{event.eventDateTime}}</td>
				<td class="duration">{{event.duration}}</td>
				<td class="room"><a target="_blank" href="/#/room/{{event.roomData.id}}">{{event.roomData.name}}</a>
</div>
</td>
<td class="course">{{event.course}}&nbsp;{{event.examID}}<br/><i>{{event.comment}}</i><br /><strong>{{event.eventUnitName}}</strong></td>
<td class="instructors">{{event.courseData.instructors}}</td>
<td class="status">{{event.statusDescr}}</td>
<td>
	<button title="Διόρθωση" ng-show="event.typeId !=3 && event.otherUnitsEvent == false" class="btn btn-primary btn-sm"
	    ng-click="editEvent(event)"><span class="glyphicon glyphicon-pencil"></span></button>
	<button title="Διαγραφή" ng-show="event.typeId !=3 && event.otherUnitsEvent == false" class="btn btn-danger btn-sm"
	    ng-click="deleteEvent(event)" type="button"><span class="glyphicon glyphicon-trash"></span></button>
	<button title="Επαναφορά" ng-show="event.typeId ==3 && event.otherUnitsEvent == false" class="btn btn-warning btn-sm"
	    ng-click="deleteEvent(event)">Επαναφορά</button>
	<button title="Αποδοχή" ng-click="acceptEvent(event.id)" ng-show="(event.status=='pending' || event.status=='rejected') && event.otherUnitsEvent == true"
	    type="button" class="btn btn-default btn-sm btn-success"><span class="glyphicon glyphicon-check"></span></button>
	<button title="Απόρριψη" data-toggle="modal" ng-click="loadRejectModal(event.id)" ng-show="(event.status == 'pending' || event.status == 'active')  && event.otherUnitsEvent == true"
	    type="button" class="btn btn-default btn-sm btn-danger"><span class="glyphicon glyphicon-remove"></span></button>
</td>
</tr>
</tbody>
<tfoot>
	<tr>
		<td colspan="9" class="text-center">
			<div st-pagination="" st-items-by-page="limitNumber.value" st-template="app/templates/pagination.custom.html">{{pages}}</div>
		</td>
	</tr>
</tfoot>
</table>


<style>
	.modal.modal-wide .modal-dialog {
	  	width: 70%;
	}
	/*.modal-wide .modal-body {
	  overflow-y: auto;
	}*/
	.select2-search__field { width: 100% !important; } /* this is for fixing the width bug in multiple select2*/

</style>

<div class="modal fade" id="rejectModal" role="dialog" style="overflow:hidden;">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">&times;</button>
				<h4 class="modal-title" align="center">Απόρριψη κράτησης</h4>
			</div>
			<div class="modal-body">
				<form>
					<div class="form-group" hidden="true">
						<input id="rejectionEventId" type="text" class="form-control" ng-model="rejectionEventId">
						<!-- Required only for selectedType == 1 -->
					</div>
					<div class="form-group">
						<label for="message-text" class="col-form-label">Παρακαλώ συμπληρώστε το λόγο της απόρριψης</label>
						<textarea required class="form-control" id="rejectionMsg" ng-model="rejectionMsg"></textarea>
						<p id="rejectMsgWarning"></p>
					</div>

				</form>
				<div class="alert alert-success" id="rejectSuccess" hidden>
					<button type="button" class="close" data-dismiss="alert">&times;</button>
					Απορρίφθηκε η κράτηση!
				</div>
				<div class="alert alert-danger" id="rejectError" hidden>
					<button type="button" class="close" data-dismiss="alert">&times;</button>
					Υπήρξε ένα πρόβλημα κατά την απόρριψη της κράτησης!
				</div>

			</div>
			<div class="modal-footer">
				<input type="submit" id="submit" class="btn btn-primary" value="Απόρριψη" ng-click="rejectEvent(rejectionEventId, rejectionMsg)" />
				<button type="button" class="btn btn-default" data-dismiss="modal">Κλείσιμο</button>
			</div>
		</div>
	</div>
</div>

<div class="modal modal-wide fade" id="addReservation" role="dialog" style="overflow:hidden;">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">&times;</button>
				<h4 class="modal-title" align="center">Νέα κράτηση</h4>
			</div>
			<div class="modal-body">
				<form id="reservationForm" class="form-horizontal">
					<div class="row">
						<div class="col-md-5">
							<!-- Selected Unit -->
							<div class="form-group">
								<label class="col-sm-4 control-label">Μονάδα:</label>
								<div class="col-sm-8">
									<select id="unitsSelectAdd" style="width: 100%;">
										<option></option>
									</select>
								</div>
							</div>
							<!-- Reservation Class -->
							<div class="form-group">
								<label class="col-sm-4 control-label">Λόγος Κράτησης:</label>
								<div class="col-sm-8">
									<select id="reservationReason" style="width: 100%;" required>
										<option></option>
									</select>
								</div>
							</div>
							<!-- Class sections -->
							<div class="form-group">
								<label class="col-sm-4 control-label">Τμήμα:</label>
								<div class="col-sm-8">
									<select id="classSection" style="width: 100%;" multiple>
										<option></option>
									</select>
								</div>
							</div>
							<!-- Class teachers -->
							<div class="form-group">
								<label class="col-sm-4 control-label">Υπεύθυνος:</label>
								<div class="col-sm-8">
									<select id="classTeachers" style="width: 100%;" multiple>
										<option></option>
									</select>
								</div>
							</div>
							<!-- Reservatin comments  -->
							<div class="form-group">
								<label class="col-sm-4 control-label">Σχόλια:</label>
								<div class="col-sm-8">
									<input id="comment" type="text" name="comment" class="form-control" ng-model="comment">
									<!-- Required only for selectedType == 1 -->
									<p id="commentWarning"></p>
								</div>
							</div>
							<!-- Reservation Room -->
							<div class="form-group">
								<label class="col-sm-4 control-label">Αίθουσα:</label>
								<div class="col-sm-8">
									<select id="classRoom" style="width: 100%;" required>
										<option></option>
									</select>
								</div>
							</div>
						</div>
						<div class="col-md-5">
							<!-- Selected Reservation Period -->
							<div class="form-group">
								<label class="col-sm-4 control-label">Περίοδος:</label>
								<div class="col-sm-8">
									<select id="periodSelectAdd" style="width: 100%;" required>
										<option></option>
									</select>
								</div>
							</div>
							<!-- Reservation Type -->
							<div class="form-group">
								<label class="col-sm-4 control-label">Τύπος:</label>
								<div class="col-sm-8">
									<select id="typeSelect" style="width: 100%;" required>
										<option></option>
										<option id="onetime" value=2>Έκτακτη</option>
										<option id="repeated" value=1>Τακτική</option>
										<option id="cancelled" value=3 disabled>Ακυρωμένη</option>
									</select>
								</div>
							</div>
							<!-- Reservation Date -->
							<div class="form-group" id="reservationDate">
								<label class="col-sm-4 control-label">Ημέρα:</label>
								<div class="col-sm-8">
									<datepicker date-format="dd-MM-yyyy" selector="form-control" date-set="{{nowDate.toString()}}">
										<div class="input-group">
											<input class="form-control" placeholder="Επιλέξτε ημερομηνία" ng-model="reservationDate" />
											<span class="input-group-addon" style="cursor: pointer">
												<i class="fa fa-lg fa-calendar"></i>
											</span>
										</div>
									</datepicker>
									<p id="reservationDateWarning"></p>
									<p id="holidayWarning"></p>
									<div ng-show="reservationDateError">
										<font color="red">{{reservationDateError}}</font>
									</div>
								</div>
							</div>

							<!-- Reservation Date -->
							<div class="form-group" id="reservationDate2">
								<label class="col-sm-4 control-label">Ημέρα:</label>
								<div class="col-sm-8">
									<select id="daySelect" style="width: 100%;">
										<option></option>
									</select>
									<p id="reservationDate2Warning"></p>
								</div>
							</div>

							<!-- Reservation time -->
							<div class="form-group" id="reservationTime">
								<label class="col-sm-4 control-label">Ώρα:</label>
								<div class="col-sm-8">
									<div class="input-group clockpicker">
										<input type="text" id="tick" class="form-control" value="{{nowTime}}">
										<span class="input-group-addon">
											<span class="glyphicon glyphicon-time"></span>
										</span>
									</div>
								</div>
							</div>
							<!-- Reservation duration -->
							<div class="form-group">
								<label class="col-sm-4 control-label">Διάρκεια (Ω-Λ):</label>
								<div class="col-sm-8">
									<div class="row">
										<div class="col-sm-6">
											<select id="durationHours" style="width: 100%;" required></select>
										</div>
										<div class="col-sm-6">
											<select id="durationMinutes" style="width: 100%;" required></select>
										</div>
									</div>
								</div>
							</div>

						</div>
						<div class="col-md-2">
							<!-- Empty Space -->
						</div>
					</div>

					<div class="modal-footer">
						<input type="submit" id="submit" class="btn btn-primary" value="Αποθήκευση" ng-click="add()" />
						<button type="button" class="btn btn-default" data-dismiss="modal">Κλείσιμο</button>
					</div>
				</form>

				<div class="alert alert-success" id="addSuccess" hidden>
					<button type="button" class="close" onclick="$('#addSuccess').hide()">&times;</button>
					Προστέθηκε νέα κράτηση!
				</div>
				<div class="alert alert-danger" id="addError" style="display: none;">
					<button type="button" class="close" onclick="$('#addError').hide()">&times;</button>
					Υπήρξε ένα πρόβλημα κατά την προσθήκη νέας κράτησης!
				</div>
				<div class="alert alert-danger alert-dismissible" id="roomBusy" style="display: none;">
					<button type="button" class="close" onclick="$('#roomBusy').hide()">&times;</button>
					Υπάρχει άλλη κράτηση για την επιλεγμένη αίθουσα!
				</div>
				<div class="alert alert-danger alert-dismissible" id="fieldsError" style="display: none;">
					<button type="button" class="close" onclick="$('#fieldsError').hide()">&times;</button>
					Παρακαλώ συμπληρώστε όλα τα απαιτούμενα πεδία
				</div>
				<div class="alert alert-danger" id="addOutOfPeriodScope" style="display: none;">
					<button type="button" class="close" onclick="$('#addOutOfPeriodScope').hide()">&times;</button>
					Η ημερομηνία που επιλέξατε είναι εκτός ορίων της περιόδου που έχετε επιλέξει! (
					{{selectedPeriodStartDate.substring(8,10)}}-{{selectedPeriodStartDate.substring(5,7)}}-{{selectedPeriodStartDate.substring(0,4)}}
					έως
					{{selectedPeriodEndDate.substring(8,10)}}-{{selectedPeriodEndDate.substring(5,7)}}-{{selectedPeriodEndDate.substring(0,4)}})
				</div>
			</div>
		</div>
	</div>
</div>

<div class="modal modal-wide fade" id="editReservation" role="dialog" style="overflow:hidden;">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">&times;</button>
				<h4 class="modal-title" align="center">
					<p id="editReservationTitle"></p>
				</h4>
			</div>
			<div class="modal-body">
				<form id="reservationForm" class="form-horizontal">
					<div class="row">
						<div class="col-xs-5">
							<!-- Selected Unit -->
							<div class="form-group">
								<label class="col-sm-4 control-label">Μονάδα:</label>
								<div class="col-sm-8">
									<h5>{{selectedUnitDescription}}</h5>
								</div>
							</div>
							<!-- Reservation Class -->
							<div class="form-group">
								<label class="col-sm-4 control-label">Λόγος Κράτησης:</label>
								<div class="col-sm-8">
									<select id="reservationReasonOnEdit" style="width: 100%;" required>
										<option></option>
									</select>
								</div>
							</div>
							<!-- Class sections -->
							<div class="form-group">
								<label class="col-sm-4 control-label">Τμήμα:</label>
								<div class="col-sm-8">
									<select id="sectionsOnEdit" style="width: 100%;" multiple>
										<option></option>
									</select>
								</div>
							</div>
							<!-- Class teachers -->
							<div class="form-group">
								<label class="col-sm-4 control-label">Υπεύθυνος:</label>
								<div class="col-sm-8">
									<select id="classTeachersOnEdit" style="width: 100%;" multiple>
										<option></option>
									</select>
								</div>
							</div>
							<!-- Reservatin comments  -->
							<div class="form-group">
								<label class="col-sm-4 control-label">Σχόλια:</label>
								<div class="col-sm-8">
									<input id="commentOnEdit" type="text" class="form-control" ng-model="commentOnEdit">
									<!-- Required only for selectedType == 1 -->
									<p id="commentWarningOnEdit"></p>
								</div>
							</div>
							<!-- Reservation Room -->
							<div class="form-group">
								<label class="col-sm-4 control-label">Αίθουσα:</label>
								<div class="col-sm-8">
									<select id="classRoomOnEdit" style="width: 100%;" required>
										<option></option>
									</select>
								</div>
							</div>
						</div>
						<div class="col-xs-5">
							<!-- Selected Reservation Period -->
							<div class="form-group">
								<label class="col-sm-4 control-label">Περίοδος:</label>
								<div class="col-sm-8">
									<h5>
										<p id="periodOnEdit"></p>
									</h5>
								</div>
							</div>
							<!-- Reservation Type -->
							<div class="form-group">
								<label class="col-sm-4 control-label">Τύπος:</label>
								<div class="col-sm-8">
									<h5>
										<p id="typeOnEdit"></p>
									</h5>
								</div>
							</div>
							<!-- Reservation Date -->
							<div class="form-group" id="reservationDateOnEdit" hidden>
								<label class="col-sm-4 control-label">Ημέρα:</label>
								<div class="col-sm-8">
									<datepicker date-format="dd-MM-yyyy" selector="form-control" date-set="{{eventDate}}">
										<div class="input-group">
											<input class="form-control" placeholder="Επιλέξτε ημερομηνία" ng-model="reservationDateOnEdit" />
											<span class="input-group-addon" style="cursor: pointer">
												<i class="fa fa-lg fa-calendar"></i>
											</span>
										</div>
									</datepicker>
									<p id="reservationDateOnEditWarning"></p>
									<div ng-show="reservationDateOnEditError">
										<font color="red">{{reservationDateOnEditError}}</font>
									</div>
								</div>
							</div>
							<!-- Reservation Date -->
							<div class="form-group" id="reservationDateOnEdit2" hidden>
								<label class="col-sm-4 control-label">Ημέρα:</label>
								<div class="col-sm-8">
									<select id="daySelectOnEdit" style="width: 100%;">
										<option></option>
									</select>
									<p id="reservationDateOnEdit2Warning"></p>
								</div>
							</div>
							<!-- Reservation time -->
							<div class="form-group" id="reservationTimeOnEdit">
								<label class="col-sm-4 control-label">Ώρα:</label>
								<div class="col-sm-8">
									<div class="input-group clockpicker">
										<input type="text" id="tickOnEdit" class="form-control" value="{{nowTime}}">
										<span class="input-group-addon">
											<span class="glyphicon glyphicon-time"></span>
										</span>
									</div>
								</div>
							</div>
							<!-- Reservation duration -->
							<div class="form-group">
								<label class="col-sm-4 control-label">Διάρκεια (Ω-Λ):</label>
								<div class="col-sm-8">
									<div class="row">
										<div class="col-sm-6">
											<select id="durationHoursOnEdit" style="width: 100%;" required></select>
										</div>
										<div class="col-sm-6">
											<select id="durationMinutesOnEdit" style="width: 100%;" required></select>
										</div>
									</div>
									<p id="durationOnEditWarning"></p>
								</div>
							</div>
						</div>
						<div class="col-xs-2" id="mydatesOnEdit" style="display: block;">
							<div class="form-group">
								<label class="col-sm-4 control-label">Ημερομηνίες</label>
								<select id="repeatIdOnEdit" style="width: 120px" size="7" title="Ημ/νία" name="repeatId">
								</select><br />
								<button id="cancelDate" ng-click="cancelDate()" class="btn btn-default btn-sm" style="width: 120px">Ακύρωση</button>
								<br />
								<label class="col-sm-4 control-label">Ακυρώσεις</label>
								<select id="cancelledIdOnEdit" style="width: 120px" size="3" title="Ημ/νία" name="cancelledId">
								</select>
								<button id="resetDate" ng-click="resetDate()" class="btn btn-default btn-sm" style="width: 120px">Επαναφορά</button>
							</div>
						</div>

					</div>
					<h5><i>Η περίοδος αφορά το διάστημα από
							{{selectedPeriodStartDate.substring(8,10)}}-{{selectedPeriodStartDate.substring(5,7)}}-{{selectedPeriodStartDate.substring(0,4)}}
							έως
							{{selectedPeriodEndDate.substring(8,10)}}-{{selectedPeriodEndDate.substring(5,7)}}-{{selectedPeriodEndDate.substring(0,4)}}</i></h5>
					<div class="modal-footer">
						<input type="submit" id="submit" class="btn btn-primary" value="Αποθήκευση" ng-click="edit()" />
						<button type="button" class="btn btn-default" data-dismiss="modal">Κλείσιμο</button>
					</div>
				</form>

				<div class="alert alert-success" id="editSuccess" hidden>
					Τροποποιήθηκε η κράτηση!
				</div>
				<div class="alert alert-success" id="resetSuccess" hidden>
					Διαγράφτηκε η ακυρωμένη κράτηση!
				</div>
				<div class="alert alert-success" id="cancelSuccess" hidden>
					Ακυρώθηκε η κράτηση!
				</div>
				<div class="alert alert-danger" id="editError" hidden>
					Υπήρξε ένα πρόβλημα κατά την τροποποίηση της κράτησης!
				</div>
				<div class="alert alert-success" id="resetError" hidden>
					Παρουσιάστηκε σφάλμα στη διαγραφή της ακυρωμένης κράτησης!
				</div>
				<div class="alert alert-success" id="cancelError" hidden>
					Παρουσιάστηκε σφάλμα κατά την ακύρωση της κράτησης!
				</div>
				<div class="alert alert-warning" id="editSuccessDifferentDayTimeDuration" hidden>
					Διαγράφηκαν τυχόν ακυρωμένες κρατήσεις λόγω τροποίησης της τακτικής!
				</div>
				<div class="alert alert-danger alert-dismissible" id="roomBusyOnEdit" hidden>
					<button type="button" class="close" data-dismiss="alert">&times;</button>
					Υπάρχει άλλη κράτηση για την επιλεγμένη αίθουσα!
				</div>
				<div class="alert alert-danger" id="editOutOfPeriodScope" hidden>
					<button type="button" class="close" data-dismiss="alert">&times;</button>
					Η ημερομηνία που επιλέξατε είναι εκτός ορίων της περιόδου που έχετε επιλέξει! (
					{{selectedPeriodStartDate.substring(8,10)}}-{{selectedPeriodStartDate.substring(5,7)}}-{{selectedPeriodStartDate.substring(0,4)}}
					έως
					{{selectedPeriodEndDate.substring(8,10)}}-{{selectedPeriodEndDate.substring(5,7)}}-{{selectedPeriodEndDate.substring(0,4)}})
				</div>
			</div>
		</div>
	</div>
</div>


<div class="modal modal-wide fade" id="deleteReservation" role="dialog" style="overflow:hidden;">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">&times;</button>
				<h4 class="modal-title" align="center">
					<p id="deleteReservationTitle"></p>
				</h4>
			</div>
			<div class="modal-body">
				<form id="reservationForm" class="form-horizontal" ng-submit="delete()">
					<div class="row">
						<div class="col-xs-5">
							<!-- Selected Unit -->
							<div class="form-group">
								<label class="col-sm-4 control-label">Μονάδα:</label>
								<div class="col-sm-8">
									<h5>{{selectedUnitDescription}}</h5>
								</div>
							</div>
							<!-- Reservation Class -->
							<div class="form-group">
								<label class="col-sm-4 control-label">Λόγος Κράτησης:</label>
								<div class="col-sm-8">
									<h5>
										<p id="eventTitleOnDelete"></p>
									</h5>
								</div>
							</div>
							<!-- Class sections -->
							<div class="form-group">
								<label class="col-sm-4 control-label">Τμήμα:</label>
								<div class="col-sm-8">
									<h5>
										<p id="sectionsOnDelete"></p>
									</h5>
								</div>
							</div>
							<!-- Class teachers -->
							<div class="form-group">
								<label class="col-sm-4 control-label">Υπεύθυνος:</label>
								<div class="col-sm-8">
									<h5>
										<p id="instructorsOnDelete"></p>
									</h5>
								</div>
							</div>
							<!-- Reservatin comments  -->
							<div class="form-group">
								<label class="col-sm-4 control-label">Σχόλια:</label>
								<div class="col-sm-8">
									<h5>
										<p id="commentsOnDelete"></p>
									</h5>
								</div>
							</div>
							<!-- Reservation Room -->
							<div class="form-group">
								<label class="col-sm-4 control-label">Αίθουσα:</label>
								<div class="col-sm-8">
									<h5>
										<p id="roomOnDelete"></p>
									</h5>
								</div>
							</div>
						</div>
						<div class="col-xs-5">
							<!-- Selected Reservation Period -->
							<div class="form-group">
								<label class="col-sm-4 control-label">Περίοδος:</label>
								<div class="col-sm-8">
									<h5>
										<p id="periodOnDelete"></p>
									</h5>
								</div>
							</div>
							<!-- Reservation Type -->
							<div class="form-group">
								<label class="col-sm-4 control-label">Τύπος:</label>
								<div class="col-sm-8">
									<h5>
										<p id="typeOnDelete"></p>
									</h5>
								</div>
							</div>
							<!-- Reservation Date -->
							<div class="form-group" id="reservationDateDelete" hidden>
								<label class="col-sm-4 control-label">Ημέρα:</label>
								<div class="col-sm-8">
									<h5>
										<p id="dateOnDelete"></p>
									</h5>
								</div>
							</div>

							<!-- Reservation Date -->
							<div class="form-group" id="reservationDateDelete2" hidden>
								<label class="col-sm-4 control-label">Ημέρα:</label>
								<div class="col-sm-8">
									<h5>
										<p id="dayOnDelete"></p>
									</h5>
								</div>
							</div>

							<!-- Reservation time -->
							<div class="form-group" id="reservationTime">
								<label class="col-sm-4 control-label">Ώρα:</label>
								<div class="col-sm-8">
									<h5>
										<p id="hourOnDelete"></p>
									</h5>
								</div>
							</div>
							<!-- Reservation duration -->
							<div class="form-group">
								<label class="col-sm-4 control-label">Διάρκεια (Ω-Λ):</label>
								<div class="col-sm-8">
									<h5>
										<p id="durationOnDelete"></p>
									</h5>
								</div>
							</div>
						</div>
						<div class="col-xs-2" id="mydates" style="display: block;">
							<div class="form-group">
								<label class="col-sm-4 control-label">Ημερομηνίες</label>
								<select id="repeatId" style="width: 120px" size="7" title="Ημ/νία" name="repeatId" disabled>
								</select><br />
								<label class="col-sm-4 control-label">Ακυρώσεις</label>
								<select id="cancelledId" style="width: 120px" size="3" title="Ημ/νία" name="cancelledId" disabled>
								</select>
							</div>
						</div>

					</div>
					<h5><i>Η περίοδος αφορά το διάστημα από
							{{selectedPeriodStartDate.substring(8,10)}}-{{selectedPeriodStartDate.substring(5,7)}}-{{selectedPeriodStartDate.substring(0,4)}}
							έως
							{{selectedPeriodEndDate.substring(8,10)}}-{{selectedPeriodEndDate.substring(5,7)}}-{{selectedPeriodEndDate.substring(0,4)}}</i></h5>
					<div class="modal-footer">
						<span class="pull-left">Είστε σίγουροι;</span>
						<input type="submit" id="submitDelete" class="btn btn-danger" value="Διαγραφή" style="display: none;" />
						<input type="submit" id="submitRestore" class="btn btn-warning" value="Επαναφορά" style="display: none;" />
						<button type="button" class="btn btn-default" data-dismiss="modal">Κλείσιμο</button>
					</div>
				</form>

				<div class="alert alert-success" id="deleteSuccess" hidden>
					Διαγράφηκε η κράτηση!
				</div>
				<div class="alert alert-danger" id="deleteError" hidden>
					Υπήρξε ένα πρόβλημα κατά την ακύρωση της κράτησης!
				</div>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="importReservations" role="dialog" style="overflow:hidden;">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">&times;</button>
				<h4 class="modal-title" align="center">Εισαγωγή</h4>
			</div>
			<div class="modal-body">
				<form id="importReservationsForm" class="form-horizontal" action="/admin/import" method="post" enctype="multipart/form-data">
					<label for="file">Αρχείο</label>
					<input type="file" name="file" id="file-import">
					<input type="hidden" name="unit" id="import-unitid" ng-value="selectedUnit">
					<input type="hidden" name="period" id="import-period" ng-value="selectedPeriod">

					<div class="modal-footer">
						<input type="submit" id="submitImport" class="btn btn-primary" value="Αποθήκευση" />
						<button type="button" class="btn btn-default" data-dismiss="modal">Κλείσιμο</button>
					</div>
				</form>

				<div class="alert alert-success" id="importReservationsSuccess" hidden>
					<button type="button" class="close" data-dismiss="alert">&times;</button>
					Oλοκληρώθηκε η εισαγωγή
				</div>
				<div class="alert alert-danger" id="importReservationsError" hidden>
					<button type="button" class="close" data-dismiss="alert">&times;</button>
					Υπήρξε ένα πρόβλημα κατά την εισαγωγή
				</div>
			</div>
		</div>
	</div>
</div>