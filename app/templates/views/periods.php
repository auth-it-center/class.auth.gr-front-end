<div id="loading" ng-show="loading">
	<img id="loading-image" src="/img/default.gif" alt="Loading..."/>
</div>
<div class="container-fluid">
	
	<style>
		.dropdown-menu-form {
			width: 200px;
		}		
	</style>
	

 	<h2 align="center">Περίοδοι</h2>
 	
 	<div class="row">
    	<div class="col-sm-6">
		  	<!-- <button id="insert" class="btn btn-success" type="button" ng-click="newModal()"><span class="glyphicon glyphicon-plus-sign"></span>&nbsp;Νέα χρονική περίοδος</button>     -->
			<button data-target="#helpModal" type="button" class="btn btn-default" data-toggle="modal">
				<span class="glyphicon glyphicon-question-sign"></span>
			</button>
			<!-- <br/><br/> -->
		</div>
            <div id="users-table_length" class="table_filter_size">
                <label>Δείξε
                    <select class="form-control input-xs" ng-options="option.name for option in itemOptions track by option.value" ng-model="limitNumber" name="dataNumber">
                    </select> εγγραφές</label>
            </div> 
        </div>
    </div>
    
      <!-- Modal new period -->
  <div class="modal fade" id="editPeriodModal" role="dialog">
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title" align="center">Διόρθωση χρονικού διαστήματος</h4>
        </div>
        <div class="modal-body">
        	<form id="periodForm" class="form-horizontal" ng-submit="edit()">    		 
        		<div class="form-group">
                    <label class="col-sm-4 control-label">Όνομα:</label>
                    <div class="col-sm-8">
                		<!-- <div ng-dropdown-multiselect="" options="periodTypes" selected-model="selectedPeriod" extra-settings="multiselectsettings" translation-texts="translationtexts" disabled="true"></div> -->
                		  <select id="periodSelectEdit" style="width: 100%;" required>
				        	<option></option>
				        </select>
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
			Τροποποιήθηακν τα στοιχεία της περιόδου.
			</div>
			<div class="alert alert-danger" id="editError" hidden>
			Υπήρξε ένα πρόβλημα κατά την επερξεργασία της περιόδου.
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
	        	<span class="help-block">
	        		<p>Τα διαστήματα των περιόδων ορίζουν τα χρονικά διαστήματα όπου επαναλαμβάνονται οι τακτικές διαλέξεις.</p>
	        		<p>	Τα χρονικά όρια των περιόδων που ορίζονται εδώ αφορούν όλους τους οργανισμούς και μονάδες που βρίσκονται καταχωρημένα στο σύστημα.
						Σε περίπτωση που έχει οριστεί χρονική διάρκεια για έναν οργανισμό ή μονάδα υπερισχύει η χρονική διάρκεια του οργανισμού ή της μονάδας.					
	        		</p>
	        	</span>
	        </div>
	        <div class="modal-footer">
	          <button type="button" class="btn btn-default" data-dismiss="modal">Κλείσιμο</button>
	        </div>
	      </div>  
		</div>
	</div>
	
   	
		  	
 	{{ error_period }}
	<table id="users-table" class="table dataTable table-striped table-bordered table-panchara" st-table="periodList" st-safe-src="periods">
		<thead>
            <tr>
                <th class="sorting" st-sort="period" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Περίοδος</th>
                <th class="sorting" st-sort="startDate" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Ημερομηνία Από</th>
                <th class="sorting" st-sort="endDate" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Ημερομηνία Έως</th>
         		<?php if($user['isSuperAdmin']): ?>
             	<th>Επιλογές</th>
     	 		<?php endif ?>
	        </tr>        
        	<tr>
				<th colspan="6"><input st-search="" class="form-control" placeholder="Αναζήτηση..." type="search"/></th>
			</tr>
        </thead>        
        <tbody>
        	<tr ng-repeat="period in periodList"><br />
        		 <td class="period_name">{{ periodTypes[period.id-1]["name"] }}</td>
	     		 <td class="period_startDate" datetime="yyyy-MM-dd">{{period.startDate.substring(8,10)}}-{{period.startDate.substring(5,7)}}-{{period.startDate.substring(0,4)}}</td>
 		 		 <td class="period_endDate">{{period.endDate.substring(8,10)}}-{{period.endDate.substring(5,7)}}-{{period.endDate.substring(0,4)}}</td>
 		 		<?php if($user['isSuperAdmin']): ?>
 		 		 <td> 
  			        <button class="btn btn-primary btn-sm" ng-click="loadPeriodData($index)"><span class="glyphicon glyphicon-pencil"></span></button>
	      			<!-- <button class="btn btn-danger btn-sm" ng-click="delete(period.id)" type="button"><span class="glyphicon glyphicon-trash"></span></button> -->
	      		</td>
	 			<?php endif ?>
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