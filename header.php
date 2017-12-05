<nav id="header" class="navbar navbar-static-top navbar-inverse no-gutter">
  <div class="container-fluid">

    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
			<a class="navbar-brand">
        <img id="header_logo" src="../img/classschedule_59F.png" alt="">
				<span id="header_title_partA">classSchedule</span><span id="header_title_partB">.auth</span>
				<span id="header_title_seperator" class="hidden-sm hidden-xs"> | </span>
				<span id="header_title_partC" class="hidden-sm hidden-xs">Πρόγραμμα Μαθημάτων και Aιθουσών ΑΠΘ</span>
				<div style="clear: both;"></div>
			</a>
    </div>

    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">

      <div ng-controller="HeaderController">
  			<ul class="nav navbar-nav navbar-right">

  				<li id="li_home" ng-class="{ active: isActive('/')}">
  					<a href="/#/" data-toggle="collapse" data-target=".navbar-collapse.in" role="tab">Αρχική</a>
  				</li>

          <li id="li_calendar" ng-class="{ active: isActive('/calendar')}">
              <a href="/#/calendar" data-toggle="collapse" data-target=".navbar-collapse.in" role="tab">Ημερολόγιο</a>
          </li>

  				<li id="li_rooms" class="divider" ng-class="{ active: isActive('/rooms')}">
  					<a href="/#/rooms" data-toggle="collapse" data-target=".navbar-collapse.in" role="tab">Αίθουσες</a>
  				</li>

          <li id="li_faculty" class="divider" ng-class="{ active: isActive('/faculty')}">
  					<a href="/#/faculty" data-toggle="collapse" data-target=".navbar-collapse.in" role="tab">Διδάσκοντες</a>
  				</li>

          <li id="li_courses" class="divider" ng-class="{ active: isActive('/courses')}">
  					<a href="/#/courses" data-toggle="collapse" data-target=".navbar-collapse.in" role="tab">Μαθήματα</a>
  				</li>

  				<?php if(isset($_SERVER['email']) and $_SERVER['eduPersonPrimaryAffiliation'] == 'student'): //user is logged in ?>
  					<li id="li_mycourses" data-toggle="collapse" data-target=".navbar-collapse.in" ng-class="{ active: isActive('/myCalendar')}"><a href="/#/myCalendar">Τα μαθήματά μου</a></li>
  				<?php endif ?>

          <?php if(isset($_SERVER['email']) and $_SERVER['eduPersonPrimaryAffiliation'] == 'faculty'): //user is logged in ?>
  					<li id="li_mycourses" data-toggle="collapse" data-target=".navbar-collapse.in" ng-class="{ active: isActive('/teacherCalendar')}"><a href="/#/teacherCalendar">Τα μαθήματά μου</a></li>
  				<?php endif ?>

  				<?php
            require_once 'db.php';
  					/**
  					 *  @brief This function is used to check if the user is a schedule manager
  					 *  @return [boolean] True(1) if the user is a schedule manager/ False(0) if the user is a normal user
  					 */
  					function getLoginData() {
  						$apmId = $_SERVER['authAPM'];
  						$db = classScheduleDB();
  						$sql = 'SELECT * FROM user WHERE staff_aem = :apmId';
  						$stmt = $db->prepare($sql);
  						$stmt->execute(array($apmId));
  						$staffData = count($stmt->fetchAll(PDO::FETCH_ASSOC));
  						$db = null;
  						return $staffData;
  					}
  				?>

  				<?php if(getLoginData()): ?>

  					<li><a href="/scheduler/scheduler/admin/calendar" target="_self" >Κρατήσεις</a></li>

  					<li><a href="/scheduler/scheduler/admin/roomassign" target="_self">Διαχείριση Αίθουσών</a></li>

  					<li><a href="/scheduler/scheduler/admin/user" target="_self">Διαχειριστές</a></li>

  					<li>
  						<a href="/scheduler/scheduler/admin/" class="dropdown-toggle" data-toggle="dropdown" target="_self">Ρυθμίσεις <span class="caret"></span></a>
  						<ul class="dropdown-menu" role="menu">
  							<li><a href="/scheduler/scheduler/admin/period" target="_self">Περίοδοι</a></li>
  							<li><a href="/scheduler/scheduler/admin/organizationUnitPeriod" target="_self">Περίοδοι Μον.</a></li>
  							<li><a href="/scheduler/scheduler/admin/excludedDate" target="_self">Αργίες</a></li>
  							<li><a href="/scheduler/scheduler/admin/organizationUnitExcludedDate" target="_self">Αργίες Μον.</a></li>
  						</ul>
  					</li>

  				<?php endif ?>
  				
  				<li id="about" class="divider" ng-class="{ active: isActive('/about')}">
  					<a href="/#/about" data-toggle="collapse" data-target=".navbar-collapse.in" role="tab">Σχετικά</a>
  				</li>
  				
          <li>
            <div id="user-top">
      				<?php if(isset($_SERVER['email'])): //user is logged in ?>
      					<button href="" class="btn btn-usr dropdown-toggle" data-toggle="dropdown">
                  <span class="user-icon"><i class="fa fa-user"></i></span>
                  <span class="user-name">
                    <?php //$name = explode(';',$_SERVER['cn']); print $name[0]; ?>
                    <?php $email = explode('@',$_SERVER['email']); print $email[0]; ?>
                  </span>
                  <span class="caret"></span>
                </button>

                <ul class="dropdown-menu" role="menu">
                  <li class="dropdown-header">Για αποσύνδεση:</li>
                  <li><a target="_self" href="Shibboleth.sso/Logout?return=/">Έξοδος</a></li>
                </ul>

              <?php else: ?>
                <a target="_self" href="Shibboleth.sso/Login?target=/myCalendar" class="btn btn-usr" role="button">
                  <span class="user-icon"><i class="fa fa-user"></i></span>
                  <span class="user-name">Είσοδος</span>
                </a>
              <?php endif ?>

            </div>
          </li>
  			</ul>
  		</div> <!-- HeaderController -->

		</div>

  </div>
</nav>
