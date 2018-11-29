<!-- <div id="loading" ng-show="loading">
	<img id="loading-image" src="/img/default.gif" alt="Loading..."/>
</div> -->
<div class="container-fluid"  ng-controller="RoomAssignController" ng-init="userInit('<?php echo $user['authAPM']?>')">
	
	{{ error_units }}
 	<h2 align="center">Διαχείριση Αιθουσών</h2>
  	<div class="row" align="center">
		<h5 id="noUnitsWarning"></h5>  
  		<select id="unitsSelect" style="width: 50%;" ng-click="getRoomAssignData()">
        	<option></option>
        </select>           
        <br/><br/>
  	</div>  
  	
	<div class="alert alert-danger" id="initializeError" hidden>
		  <strong>Error!</strong> Υπήρξε ένα πρόβλημα κατά την αρχικοποίηση των αιθουσών.
	</div>
		
 	<div class="row" ng-show="selectedUnit > 0">
    	<div class="col-sm-6">
		  	<button id="insertRoom" class="btn btn-success" type="button" ng-click="newModal()"><span class="glyphicon glyphicon-plus-sign"></span>&nbsp;Αίθουσα άλλου τμήματος</button>    
			<button id="exportRoom" class="btn btn-warning" type="button" ng-controller="ExportController"  ng-click="exportRooms()"><span class="glyphicon glyphicon-download"></span>&nbsp;Εξαγωγή αιθουσών <span class="caret"></span></button>  
			<button ng-show="roomassignList.length == 0" id="restore" class="btn btn-warning" type="button" ng-click="initialize()"><span class="glyphicon glyphicon-refresh"></span>&nbsp;Αρχικοποίηση αιθουσών</button>  
		</div>
  		<div class="col-sm-6">
            <div id="users-table_length" class="table_filter_size">
                <label>Δείξε
                    <select class="form-control input-xs" ng-options="option.name for option in itemOptions track by option.value" ng-model="limitNumber" name="dataNumber">
                    </select> εγγραφές</label>
            </div> 
        </div>
    </div>
    
    
  <!-- Modal new favorite room for unit -->
  <div class="modal fade" id="addRoomModal" role="dialog">
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title" align="center">Αίθουσα άλλου τμήματος</h4>
        </div>
        <div class="modal-body">
        	<form id="roomForm" class="form-horizontal" ng-submit="add()">    		 
        		<div class="form-group">
                    <label class="col-sm-4 control-label">Επιλέξτε το Τμήμα ώστε να εμφανιστούν μόνο οι αίθουσες του τμήματος:</label>
                    <div class="col-sm-8">
                		<select id="first" style="width: 100%;">
				        	<option></option>
				        </select>
                    </div>                    
                  </div>  
         		<div class="form-group">
                    <label class="col-sm-4 control-label">Αίθουσα:</label>
                    <div class="col-sm-8">
                		<select id="second" style="width: 100%;">
				        	<option></option>
				        </select>
                    </div>                    
                  </div>  
                 <div class="form-group">
           	       	 <label class="col-sm-4 control-label">Φιλική περιγραφή αίθουσας:</label>
                  	  <div class="col-sm-8">
		    		  	<input id="favRoom" type="text" name="name" class="form-control" ng-model="favRoom" required>
                  	  </div>
              	  </div>
              
            	 <div class="modal-footer">
  					  <input type="submit" id="submit" class="btn btn-primary" value="Αποθήκευση"/>
			          <button type="button" class="btn btn-default" data-dismiss="modal">Ακύρωση</button>
		        </div>
    		</form>
    		
    		<div class="alert alert-success" id="addSuccess" hidden>
			Προστέθηκε νέα αίθουσα.
			</div>
			<div class="alert alert-danger" id="addError" hidden>
			Υπήρξε ένα πρόβλημα κατά την προσθήκη νέας αίθουσας.
			</div>
    		
        </div>
      </div>
      
    </div>
  </div>
  
      
  <!-- Modal edit favorite room for unit -->
  <div class="modal fade" id="editRoomModal" role="dialog">
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title" align="center">Στοιχεία αίθουσας</h4>
        </div>
        <div class="modal-body">
        	<form id="roomForm" class="form-horizontal" ng-submit="edit()">    		 
        		
                 <div class="form-group">
           	       	 <label class="col-sm-4 control-label">Φιλική περιγραφή αίθουσας:</label>
                  	  <div class="col-sm-8">
		    		  	<input id="favRoomEdit" type="text" name="name" class="form-control" ng-model="favRoomEdit" required>
                  	  </div>
              	  </div>
              
            	 <div class="modal-footer">
  					  <input type="submit" id="submit" class="btn btn-primary" value="Αποθήκευση"/>
			          <button type="button" class="btn btn-default" data-dismiss="modal">Ακύρωση</button>
		        </div>
    		</form>
    		
    		<div class="alert alert-success" id="editSuccess" hidden>
			Τροποποιήθηκαν τα στοιχεία της αίθουσας.
			</div>
			<div class="alert alert-danger" id="editError" hidden>
			Υπήρξε ένα πρόβλημα κατά την τροποποίηση της αίθουσας.
			</div>
    		
        </div>
      </div>
      
    </div>
  </div>


  <!-- Modal delete favorite room for unit -->
  <div class="modal fade" id="deleteRoomModal" role="dialog">
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title" align="center">Διαγραφή αίθουσας</h4>
        </div>
        <div class="modal-body">
        	<form id="roomForm" class="form-horizontal" ng-submit="delete()">    		 
        		
                 <div class="form-group">
           	       	 <label class="col-sm-4 control-label">Φιλική περιγραφή αίθουσας:</label>
                  	  <div class="col-sm-8">
		    		  	<input id="favRoomDelete" type="text" name="name" class="form-control" ng-model="favRoomDelete" disabled>
                  	  </div>
              	  </div>
              
            	 <div class="modal-footer">
            	 	  <span class="pull-left">Είστε σίγουροι;</span>
  					  <input type="submit" id="submit" class="btn btn-danger" value="Διαγραφή"/>
			          <button type="button" class="btn btn-default" data-dismiss="modal">Ακύρωση</button>
		        </div>
    		</form>
    		
    		<div class="alert alert-success" id="deleteSuccess" hidden>
			Διαγράφηκαν τα στοιχεία της αίθουσας.
			</div>
			<div class="alert alert-danger" id="deleteError" hidden>
			Υπήρξε ένα πρόβλημα κατά τη διαγραφή της αίθουσας.
			</div>
    		
        </div>
      </div>
      
    </div>
  </div>
    
  		  	
 	{{ error_roomassign }}
	<table id="users-table" class="table dataTable table-striped table-bordered table-panchara" st-table="roomassignList" st-safe-src="roomassign" ng-show="selectedUnit > 0">
		<thead>
            <tr>
                <th class="sorting" st-sort="roomName" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Αίθουσα</th>
             	<th class="sorting" st-sort="unit" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Μονάδα</th>
                <th class="sorting" st-sort="roomNumOfSeats" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Θέσεις</th>
                <th>Χάρτης</th>
                <th>Πληροφορίες</th>
                <th>Φωτογραφίες</th>
              	<th>Κάτοψη</th>
                <th>Επιλογές</th>
	        </tr>        
        	<tr>
				<th colspan="8"><input st-search="" class="form-control" placeholder="Αναζήτηση..." type="search"/></th>
			</tr>
        </thead>        
        <tbody>
        	<tr ng-repeat="favroom in roomassignList"><br />
        		 <td class="roomName">{{ favroom.name }}</td>
    		 	 <td class="unit">{{ favroom.unitTitle }}</td>
	     		 <td class="roomNumOfSeats">{{ favroom.numOfSeats }}</td>
	     		 <td><button class="btn btn-defult" ng-click="openMap(favroom.buildingId)"><span class="glyphicon glyphicon-map-marker"></span></button></td>
	     		 <td><button class="btn btn-defult" ng-click="openInfo(favroom.CODE_NEW_ALL)"><span class="glyphicon glyphicon-info-sign"></span></button></td>
	     		 <td><button class="btn btn-defult" ng-click="openPhotos(favroom.PHOTO_FOLDER)"><span class="glyphicon glyphicon-picture"></span></button></td>
 	     		 <td><button class="btn btn-defult" ng-click="openKatopsis(favroom.KATOPSI)"><span class="glyphicon glyphicon-map-marker"></span></button></td>
	     		 <td> 
  			        <button class="btn btn-primary btn-sm" ng-click="loadRoomData($index)"><span class="glyphicon glyphicon-pencil"></span></button>
	      			<button class="btn btn-danger btn-sm" ng-click="deleteRoomData($index)" type="button"><span class="glyphicon glyphicon-trash"></span></button>
	      		</td>
        	</tr>	
        </tbody>
            <tfoot> 
        	       
			<tr>
				<td colspan="8" class="text-center">
     				<div st-pagination="" st-items-by-page="limitNumber.value" st-template="app/templates/pagination.custom.html">{{ pages }}</div>
    		  	</td>
            </tr>
        </tfoot>
		
	</table>	

</div>

