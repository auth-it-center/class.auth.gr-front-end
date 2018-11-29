<div id="loading" ng-show="loading">
	<img id="loading-image" src="/img/default.gif" alt="Loading..."/>
</div>
<div class="container-fluid" ng-init="userInit('<?php echo $user['authAPM']?>')">
		<h2 align="center">Διαχειριστές</h2>

  <!-- Modal new admin user -->
  <div class="modal fade" id="addUserModal" role="dialog">
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title" align="center">Διαχειριστές</h4>
        </div>
        <div class="modal-body">
        	<form id="userForm" class="form-horizontal" ng-submit="add()">
    		 
        		<div class="form-group">
                    <label class="col-sm-2 control-label">Όνομα:</label>
                    <div class="col-sm-10">
                		<input type="text" name="name" class="form-control" ng-model="formData.name" required>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-sm-2 control-label">Email:</label>
                    <div class="col-sm-10">
                    	<input type="email" name="email" class="form-control" ng-model="formData.email" required>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-sm-2 control-label">ΑΠΜ:</label>
                    <div class="col-sm-10">
                        <input type="text" name="staff_aem" class="form-control" ng-model="formData.staff_aem" required>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-sm-2 control-label">Τμήματα:</label>
                    <div class="col-sm-10">
	 			  	    <select id="unitsSelectAdd" style="width: 100%;" multiple="multiple" required>
       					</select>
                  	</div>     
                  </div>                      
               	  <div class="form-group">
                    <label class="col-sm-2 control-label">Δικαιώματα:</label>
                    <div class="col-sm-10">
                    	<select class="form-control init ng-pristine ng-valid ng-empty ng-touched" ng-model="formData.isAdmin" ng-options="option.name for option in adminRights track by option.id" required>
                    		<option value="">Δικαιώματα</option>
                    	</select>
                    </div>
                  </div>
            	 <div class="modal-footer">
  					  <input type="submit" id="submit" class="btn btn-primary" value="Αποθήκευση"/>
			          <button type="button" class="btn btn-default" data-dismiss="modal">Ακύρωση</button>
		        </div>
    		</form>
    		
    		<div class="alert alert-success" id="addedSuccess" hidden>
			Προστέθηκε νέος διαχειριστής ({{ formData.email }}).
			</div>
			<div class="alert alert-danger" id="addedError" hidden>
			Υπήρξε ένα πρόβλημα κατά την καταχώρηση του νέου διαχειριστή.
			</div>
        </div>
      </div>
      
    </div>
  </div>
  
  
    <!-- Modal edit admin user -->
  <div class="modal fade" id="editUserModal" role="dialog">
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title" align="center">Διαχειριστές</h4>
        </div>
        <div class="modal-body">
        	<form id="userForm" class="form-horizontal" ng-submit="edit()">
    		 
        		<div class="form-group">
                    <label class="col-sm-2 control-label">Όνομα:</label>
                    <div class="col-sm-10">
                		<input type="text" name="name" class="form-control" ng-model="formData.name" required>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-sm-2 control-label">Email:</label>
                    <div class="col-sm-10">
                    	<input type="email" name="email" class="form-control" ng-model="formData.email" required>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-sm-2 control-label">ΑΠΜ:</label>
                    <div class="col-sm-10">
                        <input type="text" name="staff_aem" class="form-control" ng-model="formData.staff_aem" required>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-sm-2 control-label">Τμήματα:</label>
                    <div class="col-sm-10"><select id="unitsSelectEdit" style="width: 100%;" multiple required>
				        </select>
                  	</div>     
                  </div>                      
               	  <div class="form-group">
                    <label class="col-sm-2 control-label">Δικαιώματα:</label>
                    <div class="col-sm-10">
                    	<select class="form-control init ng-pristine ng-valid ng-empty ng-touched" ng-model="formData.isAdmin" ng-options="option.name for option in adminRights track by option.id" required>
                    		<option value="">Δικαιώματα</option>
                    	</select>
                    </div>
                  </div>
            	 <div class="modal-footer">
  					  <input type="submit" id="submit" class="btn btn-primary" value="Αποθήκευση"/>
			          <button type="button" class="btn btn-default" data-dismiss="modal">Ακύρωση</button>
		        </div>
    		</form>
	      	<div class="alert alert-success" id="editSuccess" hidden>
			Τροποποιήθηακν τα στοιχεία του διαχειριστή ({{ formData.email }}).
			</div>
			<div class="alert alert-danger" id="editError" hidden>
			Υπήρξε ένα πρόβλημα κατά την επερξεργασία των στοιχείων του διαχειριστή.
			</div>
        </div>
      </div>
      
    </div>
  </div>
  
  
  
    <!-- Modal delete admin user -->
  <div class="modal fade" id="deleteUserModal" role="dialog">
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title" align="center">Διαχειριστές</h4>
        </div>
        <div class="modal-body">
        	<form id="userForm" class="form-horizontal" ng-submit="delete()">
    		 
        		<div class="form-group">
                    <label class="col-sm-2 control-label">Όνομα:</label>
                    <div class="col-sm-10">
                		<input type="text" name="name" class="form-control" ng-model="formData.name" disabled>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-sm-2 control-label">Email:</label>
                    <div class="col-sm-10">
                    	<input type="email" name="email" class="form-control" ng-model="formData.email" disabled>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-sm-2 control-label">ΑΠΜ:</label>
                    <div class="col-sm-10">
                        <input type="text" name="staff_aem" class="form-control" ng-model="formData.staff_aem" disabled>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-sm-2 control-label">Τμήματα:</label>
                    <div class="col-sm-10">
			 			<select id="unitsSelectDelete" style="width: 100%;" multiple disabled>
				        </select>
                  	</div>     
                  </div>                      
               	  <div class="form-group">
                    <label class="col-sm-2 control-label">Δικαιώματα:</label>
                    <div class="col-sm-10">
                    	<select class="form-control init ng-pristine ng-valid ng-empty ng-touched" ng-model="formData.isAdmin" ng-options="option.name for option in adminRights track by option.id" disabled>
                    		<option value="">Δικαιώματα</option>
                    	</select>
                    </div>
                  </div>
            	 <div class="modal-footer">
            	 	  <span class="pull-left">Είστε σίγουροι;</span>
  					  <input type="submit" id="submit" class="btn btn-danger" value="Διαγραφή"/>
			          <button type="button" class="btn btn-default" data-dismiss="modal">Ακύρωση</button>
		        </div>
    		</form>
    		
    		<div class="alert alert-success" id="deleteSuccess" hidden>
			Διαγράφηκε ο διαχειριστής.
			</div> 
			<div class="alert alert-danger" id="deleteError" hidden>
			Υπήρξε ένα πρόβλημα κατά την διαγραφή του διαχειριστή.
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
        	</span>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Κλείσιμο</button>
        </div>
      </div>
      
    </div>
  </div>
  
  
	<div class="row" ng-show="canAccess">
    	<div class="col-sm-6">
	       	<?php if($user['isSuperAdmin']): ?> 
		  	<button id="insert" class="btn btn-success" ng-click="newModal()" type="button">
		  		<span class="glyphicon glyphicon-plus-sign"></span>&nbsp;Νέος διαχειριστής
		  	</button>
		  	 <?php endif ?>
			<button data-target="#helpModal" type="button" class="btn btn-default" data-toggle="modal">
				<span class="glyphicon glyphicon-question-sign"></span>
			</button>
			<br/><br/>
		</div>
        <div class="col-sm-6">
            <div id="users-table_length" class="table_filter_size">
                <label>Δείξε
                    <select class="form-control input-xs" ng-options="option.name for option in itemOptions track by option.value" ng-model="limitNumber" name="dataNumber">
                    </select> εγγραφές</label>
            </div> 
        </div>
    </div>

    {{ error_user }}
    <table id="users-table" class="table dataTable table-striped table-bordered table-panchara" st-table="userList" st-safe-src="users" ng-show="canAccess">

        <thead>
            <tr>
                <th class="sorting" st-sort="name" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Όνομα</th>
                <th class="sorting" st-sort="email" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Email</th>
                <th class="sorting" st-sort="units" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Τμήματα</th>
                <th class="sorting" st-sort="admin" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Διαχειριστής</th>
                <th class="sorting" st-sort="apm" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">ΑΠΜ</th>
             	<?php if($user['isSuperAdmin']): ?> <th>Επιλογές</th> <?php endif ?>
	        </tr>
	        
        	<tr>
				<th colspan="6"><input st-search="" class="form-control" placeholder="Αναζήτηση..." type="search"/></th>
			</tr>
        </thead>
        <tbody>       	 
            <tr ng-repeat="user in userList">
   	           <td class="user_name">{{ user.name }}</td>
	           <td class="user_email">{{ user.email }}</td>
	           <td class="user_units">{{ user.units }}</td>
	           <td class="user_admin">{{ user.isAdmin }}</td>
				<td class="user_apm">{{user.staff_aem}}</td>
				<?php if($user['isSuperAdmin']): ?>
	      		<td> 
  			        <button class="btn btn-primary btn-sm" ng-click="loadUserData($index,user.id)"><span class="glyphicon glyphicon-pencil"></span></button>
	      			<button class="btn btn-danger btn-sm" ng-click="deleteUserData($index,user.id)" type="button"><span class="glyphicon glyphicon-trash"></span></button>
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