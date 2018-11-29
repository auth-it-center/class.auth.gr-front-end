<!-- <div id="loading" ng-show="loading">
	<img id="loading-image" src="/img/default.gif" alt="Loading..."/>
</div> -->
<div class="container-fluid" ng-controller="ExcludedDatesUnitController" ng-init="userInit('<?php echo $user['authAPM']?>')">

 	<h2 align="center">Αργίες Μονάδας</h2>
 	<div class="row" align="center">
	  	<h5 id="noUnitsWarning"></h5>    
	  	<select id="unitsSelect" style="width: 50%;" ng-click="getUnitData()">
        	<option></option>
        </select>
  	</div>  
  	
 	
 	<div class="row" ng-show="selectedUnit > 0">
    	<div class="col-sm-6">
		  	<button id="insert" class="btn btn-success" type="button" ng-click="newModal()"><span class="glyphicon glyphicon-plus-sign"></span>&nbsp;Νέα Αργία</button>    
			<button data-target="#helpModal" type="button" class="btn btn-default" data-toggle="modal">
				<span class="glyphicon glyphicon-question-sign"></span>
			</button>
			<!-- <br/><br/> -->
		</div>
        <div class="col-sm-6">
            <div id="users-table_length" class="table_filter_size">
                <label>Δείξε
                    <select class="form-control input-xs" ng-options="option.name for option in itemOptions track by option.value" ng-model="limitNumber" name="dataNumber">
                    </select> εγγραφές</label>
            </div> 
        </div>
    </div>
    
    
  <!-- Modal new excluded date for unit -->
  <div class="modal fade" id="addExcludedDateModal" role="dialog">
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title" align="center">Νέα αργία</h4>
        </div>
        <div class="modal-body">
        	<form id="datesForm" class="form-horizontal" ng-submit="add()">  
        		<div class="form-group">
                    <label class="col-sm-4 control-label">Μονάδα:</label>
                    <div class="col-sm-8">
                	    <select id="unitsSelectAdd" style="width: 100%;">
				        	<option></option>
				        </select>
                    </div>                    
                  </div>  
        		 <div class="form-group">
           	       	 <label class="col-sm-4 control-label">Περιγραφή:</label>
                  	  <div class="col-sm-8">
		    		  	<input type="text" name="name" class="form-control" ng-model="formData.name" required>
                  	  </div>
              	 </div>  		 
	              <div class="form-group">
                  	 <label class="col-sm-4 control-label">Ημερομηνία Από:</label>
                    <div class="col-sm-8">
						<datepicker date-format="dd-MM-yyyy" selector="form-control">
						    <div class="input-group">
						        <input class="form-control" placeholder="Επιλέξτε ημερομηνία" ng-model="formData.startDate" required/>
						        <span class="input-group-addon" style="cursor: pointer">
						        <i class="fa fa-lg fa-calendar"></i>
						        </span>
						    </div>
						</datepicker>
						<div ng-show="startDateError"><font color="red">{{startDateError}}</font></div>			
                  	</div>
                  </div>       
                  <div class="form-group">
                  	 <label class="col-sm-4 control-label">Ημερομηνία Έως:</label>
                    <div class="col-sm-8">
						<datepicker date-format="dd-MM-yyyy" selector="form-control">
						    <div class="input-group">
						        <input class="form-control" placeholder="Επιλέξτε ημερομηνία" ng-model="formData.endDate" required/>
						        <span class="input-group-addon" style="cursor: pointer">
						        <i class="fa fa-lg fa-calendar"></i>
						        </span>
						    </div>
						</datepicker>
						<div ng-show="endDateError"><font color="red">{{endDateError}}</font></div>			
                  	</div>
                 </div>     
                <p id="selectedDatesWarning"></p>    
                      
            	 <div class="modal-footer">
  					  <input type="submit" id="submit" class="btn btn-primary" value="Αποθήκευση"/>
			          <button type="button" class="btn btn-default" data-dismiss="modal">Ακύρωση</button>
		        </div>
    		</form>
    		
	      	<div class="alert alert-success" id="addSuccess" hidden>
			Προστέθηκε νέα αργία.
			</div>
			<div class="alert alert-danger" id="addError" hidden>
			Υπήρξε ένα πρόβλημα κατά την προσθήκη νέας αργίας.
			</div>
			
        </div>
      </div>
      
    </div>
  </div>
  
    
      <!-- Modal edit excluded date for unit -->
  <div class="modal fade" id="editExcludedDateModal" role="dialog">
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title" align="center">Διόρθωση αργίας</h4>
        </div>
        <div class="modal-body">
        	<form id="datesForm" class="form-horizontal" ng-submit="edit()">
        		<div class="form-group">
                    <label class="col-sm-4 control-label">Μονάδα:</label>
                    <div class="col-sm-8">
                		 <select id="unitsSelectEdit" style="width: 100%;">
				        	<option></option>
				        </select>
                    </div>                    
                  </div>      		 
        		<div class="form-group">
           	       	 <label class="col-sm-4 control-label">Περιγραφή:</label>
                  	  <div class="col-sm-8">
		    		  	<input type="text" name="name" class="form-control" ng-model="formData.name" required>
                  	  </div>
              	 </div>  	
                  <div class="form-group">
                  	 <label class="col-sm-4 control-label">Ημερομηνία Από:</label>
                    <div class="col-sm-8">
						<datepicker date-format="dd-MM-yyyy" selector="form-control">
						    <div class="input-group">
						        <input class="form-control" placeholder="Επιλέξτε ημερομηνία" ng-model="formData.startDate" required/>						     
						        <span class="input-group-addon" style="cursor: pointer">
						        <i class="fa fa-lg fa-calendar"></i>
						        </span>
						    </div>
						</datepicker>
						<div ng-show="startDateError"><font color="red">{{startDateError}}</font></div>						
                  	</div>
                  </div>       
                  <div class="form-group">
                  	 <label class="col-sm-4 control-label">Ημερομηνία Έως:</label>
                    <div class="col-sm-8">
						<datepicker date-format="dd-MM-yyyy" selector="form-control">
						    <div class="input-group">
						        <input class="form-control" placeholder="Επιλέξτε ημερομηνία" ng-model="formData.endDate" required/>
						        <span class="input-group-addon" style="cursor: pointer">
						        <i class="fa fa-lg fa-calendar"></i>
						        </span>
						    </div>
						</datepicker>
						<div ng-show="endDateError"><font color="red">{{endDateError}}</font></div>		
                  	</div>
                 </div>             
              	 <p id="selectedDatesWarningEdit"></p>  
            	 <div class="modal-footer">
  					  <input type="submit" id="submit" class="btn btn-primary" value="Αποθήκευση"/>
			          <button type="button" class="btn btn-default" data-dismiss="modal">Ακύρωση</button>
		        </div>
    		</form>
    		
	      	<div class="alert alert-success" id="editSuccess" hidden>
			Τροποποιήθηκαν τα στοιχεία της αργίας.
			</div>
			<div class="alert alert-danger" id="editError" hidden>
			Υπήρξε ένα πρόβλημα κατά την επερξεργασία της αργίας.
			</div>
    		
        </div>
      </div>
      
    </div>
  </div>
  
    <!-- Modal delete excluded date for unit -->
  <div class="modal fade" id="deleteExcludedDateModal" role="dialog">
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title" align="center">Διαγραφή αργίας</h4>
        </div>
        <div class="modal-body">
        	<form id="datesForm" class="form-horizontal" ng-submit="delete()">
        		<div class="form-group">
                    <label class="col-sm-4 control-label">Μονάδα:</label>
                    <div class="col-sm-8">
                		 <select id="unitsSelectDelete" style="width: 100%;" required>
				        	<option></option>
				        </select>
                    </div>                    
                  </div>        		 
        		<div class="form-group">
           	       	 <label class="col-sm-4 control-label">Περιγραφή:</label>
                  	  <div class="col-sm-8">
		    		  	<input type="text" name="name" class="form-control" ng-model="formData.name" disabled>
                  	  </div>
              	 </div>  	
                  <div class="form-group">
                  	 <label class="col-sm-4 control-label">Ημερομηνία Από:</label>
                    <div class="col-sm-8">
						<datepicker date-format="dd-MM-yyyy" selector="form-control">
						    <div class="input-group">
						        <input class="form-control" placeholder="Επιλέξτε ημερομηνία" ng-model="formData.startDate" disabled/>
						        <span class="input-group-addon" style="cursor: pointer">
						        <i class="fa fa-lg fa-calendar"></i>
						        </span>
						    </div>
						</datepicker>
                  	</div>
                  </div>       
                  <div class="form-group">
                  	 <label class="col-sm-4 control-label">Ημερομηνία Έως:</label>
                    <div class="col-sm-8">
						<datepicker date-format="dd-MM-yyyy" selector="form-control">
						    <div class="input-group">
						        <input class="form-control" placeholder="Επιλέξτε ημερομηνία" ng-model="formData.endDate" disabled/>
						        <span class="input-group-addon" style="cursor: pointer">
						        <i class="fa fa-lg fa-calendar"></i>
						        </span>
						    </div>
						</datepicker>
                  	</div>
                 </div>             
              	<div class="modal-footer">
            	 	  <span class="pull-left">Είστε σίγουροι;</span>
  					  <input type="submit" id="submit" class="btn btn-danger" value="Διαγραφή"/>
			          <button type="button" class="btn btn-default" data-dismiss="modal">Ακύρωση</button>
		        </div>
    		</form>
    		
	      	<div class="alert alert-success" id="deleteSuccess" hidden>
			Διαγράφηκε η αργία.
			</div>
			<div class="alert alert-danger" id="deleteError" hidden>
			Υπήρξε ένα πρόβλημα κατά τη διαγραφή της αργίας.
			</div>
    		
        </div>
      </div>
      
    </div>
  </div>
  
    
	<!-- Modal help -->
	<div class="modal fade" id="helpModal" role="dialog">
	    <div class="modal-dialog">    
	      <!-- Modal content-->
	      <div class="modal-content">
	        <div class="modal-header">
	          <button type="button" class="close" data-dismiss="modal">&times;</button>
	          <h4 class="modal-title" align="center">Βοήθεια</h4>
	        </div>
	        <div class="modal-body">
	        	<h4>Ποιους αφορά</h4>
	        	<span class="help-block">
	        		<p>Οι μη ενεργές ημερομηνίες που ορίζονται σε αυτήν την κατηγορία είναι γενικές (για παράδειγμα εθνικές γιορτές) και αφορούν <strong>όλους</strong> τους οργανισμούς και <strong>όλες</strong> τις μονάδες των οργανισμών που βρίσκονται καταχωρημένες στο σύστημα. 
	        		Πρακτικά η καταχώρηση ενός μη ενεργού χρονικού διαστήματος σε αυτήν την κατηγορία, <strong>υποκαθιστά</strong> την ίδια καταχώρηση για κάθε οργανισμό και μονάδα (χωρίς να γίνονται στην πράξη οι σχετικές καταχωρήσεις).</p>
	        	</span>
	        	<h4>Πως επηρεάζεται το ημερολόγιο των διαλέξεων</h4>
	        	<span class="help-block">
	        		<p>Οι μη ενεργές ημερομηνίες εξαιρούν από το ημερολόγιο των διαλέξεων όλες τις τακτικές ή έκτακτες μεταδόσεις διαλέξεων που βρίσκονται εντός του μη ενεργού χρονικού διαστήματος.</p>
	        	</span>
	        </div>
	        <div class="modal-footer">
	          <button type="button" class="btn btn-default" data-dismiss="modal">Κλείσιμο</button>
	        </div>
	      </div>  
		</div>
	</div>
	
   	
		  	
 	{{ error_excludeddates }}
	<table id="users-table" class="table dataTable table-striped table-bordered table-panchara" st-table="datesList" st-safe-src="dates" ng-show="selectedUnit > 0">
		<thead>
            <tr>
                <th class="sorting" st-sort="description" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Περιγραφή</th>
                <th class="sorting" st-sort="startDate" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Ημερομηνία Από</th>
                <th class="sorting" st-sort="endDate" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Ημερομηνία Έως</th>
             	<th>Επιλογές</th>
	        </tr>        
        	<tr>
				<th colspan="6"><input st-search="" class="form-control" placeholder="Αναζήτηση..." type="search"/></th>
			</tr>
        </thead>        
        <tbody>
        	<tr ng-repeat="date in datesList"><br />
        		 <td class="date_desc">{{ date.name }}</td>
	     		 <td class="date_startDate">{{date.startDate.substring(8,10)}}-{{date.startDate.substring(5,7)}}-{{date.startDate.substring(0,4)}}</td>
 		 		 <td class="date_endDate">{{date.endDate.substring(8,10)}}-{{date.endDate.substring(5,7)}}-{{date.endDate.substring(0,4)}}</td>
 		 		 <td> 
  			        <button class="btn btn-primary btn-sm" ng-click="loadExcludedDatesData($index)"><span class="glyphicon glyphicon-pencil"></span></button>
	      			<button class="btn btn-danger btn-sm" ng-click="deleteExcludedDatesData($index)" type="button"><span class="glyphicon glyphicon-trash"></span></button>
	      		</td>
        	</tr>
        	
        </tbody>
         <tfoot>         	       
			<tr>
				<td colspan="6" class="text-center">
     		 		<!-- <div st-pagination="" st-items-by-page="limitNumber.value" st-displayed-pages="7"></div> -->
	 				<div st-pagination="" st-items-by-page="limitNumber.value" st-template="app/templates/pagination.custom.html">{{ pages }}</div>
    		  	</td>
            </tr>
        </tfoot>
		
	</table>
	


</div>
