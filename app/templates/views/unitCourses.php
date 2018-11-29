<!-- <div id="loading" ng-show="loading">
	<img id="loading-image" src="/img/default.gif" alt="Loading..."/>
</div> -->
<div class="container-fluid"  ng-controller="UnitCoursesController" ng-init="userInit('<?php echo $user['authAPM']?>')">
	
	{{ error_units }}
 	<h2 align="center">Μαθήματα Τμημάτων</h2>
  	<div class="row" align="center">
		<h5 id="noUnitsWarning"></h5>  
  		<select id="unitsSelect" style="width: 50%;">
        	<option></option>
        </select>           
        <br/><br/>
		<select id="yearSelect" style="width: 50%;" hidden>
        	<option></option>
        </select>   
        <br/><br/>
		<select id="periodSelect" style="width: 50%;" hidden>
        	<option></option>
        </select> 
        <br/><br/>
  	</div>  
  	
	<div class="alert alert-danger" id="initializeError" hidden>
		  <strong>Error!</strong> Υπήρξε ένα πρόβλημα κατά την αρχικοποίηση των αιθουσών.
	</div>

		
 	<div class="row" id="buttons" ng-show="selectedUnit>0 && selectedYear>0 && selectedPeriod>0">
    	<div class="col-sm-6">
			<button id="exportCourses" class="btn btn-warning" type="button" ng-controller="ExportController"  ng-click="exportUnitCourses()"><span class="glyphicon glyphicon-download"></span>&nbsp;Εξαγωγή μαθημάτων <span class="caret"></span></button>  
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
    
    {{ error_unitcourses }}
    <table id="users-table" class="table dataTable table-striped table-bordered table-panchara" st-table="unitCoursesList" st-safe-src="unitCourses" ng-show="selectedUnit>0 && selectedYear>0 && selectedPeriod>0">        <thead>
            <tr>
                <th class="sorting" st-sort="coursecode" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Κωδικός</th>
                <th class="sorting" st-sort="coursetitle" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Τίτλος</th>
                <th class="sorting" st-sort="teachers" st-class-ascent="sorting_asc" st-class-descent="sorting_desc">Διδάσκοντες</th>
	        </tr>
	        
        	<tr>
				<th colspan="3"><input st-search="" class="form-control" placeholder="Αναζήτηση..." type="search"/></th>
			</tr>
        </thead>
        <tbody>       	 
            <tr ng-repeat="co in unitCoursesList">
   	           <td class="coursecode">{{ co.coursecode }}</td>
	           <td class="coursetitle">{{ co.coursetitle }}</td>
	           <td class="teachers">{{ co.teachers }}</td>
			</tr>
        </tbody>

        <tfoot>         	       
			<tr>
				<td colspan="3" class="text-center">
     		 		<!-- <div st-pagination="" st-items-by-page="limitNumber.value" st-displayed-pages="7"></div> -->
	 				<div st-pagination="" st-items-by-page="limitNumber.value" st-template="app/templates/pagination.custom.html">{{ pages }}</div>
    		  	</td>
            </tr>
        </tfoot>
        
    </table>


</div>

