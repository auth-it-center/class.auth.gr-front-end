<!doctype html>
<html lang="en">

<head>
    <!-- meta info -->
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <base href="/" />
    <meta name="theme-color" content="#FFC600" />
    <title>classSchedule.auth | Πρόγραμμα Μαθημάτων και Αιθουσών ΑΠΘ</title>
    <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />

    <!-- Site icon -->
    <!-- <link rel="icon" type="image/png" href="img/classschedule-128.png"> -->

    <!-- Services UI css files -->
    <link href="//cdn.it.auth.gr/fonts/font-awesome-4.3.0/css/font-awesome.min.css" rel="stylesheet">
    <link href='//cdn.it.auth.gr/fonts/gfonts/opensans/opensans.css' rel='stylesheet' type='text/css'>

    <!-- JQuery -->
    <script type="text/javascript" src="//cdn.it.auth.gr/libraries/jquery/jquery-2.1.1.min.js"></script>
    <script type="text/javascript" src="//cdn.it.auth.gr/libraries/jquery.ui/jquery-ui-1.11.2/jquery-ui.min.js"></script>

    <!-- Momentjs -->
    <script type="text/javascript" src="js/momentjs/moment.min.js"></script>

    <!-- Full Calendar-->
    <script type="text/javascript" src="js/fullcalendar/fullcalendar.min.js"></script>
    <script type="text/javascript" src="js/fullcalendar/locale/el.js"></script>
    <script type="text/javascript" src="js/fullcalendar-scheduler/scheduler.min.js"></script>
    <link href="css/fullcelendar/fullcalendar.min.css" rel="stylesheet" type="text/css" />

    <!-- Bootstrap -->
    <link rel="stylesheet" href="//cdn.it.auth.gr/libraries/bootstrap/css/bootstrap.min.css">
    <script src="//cdn.it.auth.gr/libraries/bootstrap/js/bootstrap.min.js"></script>
    <!--  Bootstrap Datetimepicker-->
    <!-- <link rel="stylesheet" href="js/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css">
    <script src="js/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js"></script> -->

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

    <!-- Angular -->
    <script type="text/javascript" src="//cdn.it.auth.gr/libraries/angular/angular-1.5.5/angular.min.js"></script>
    <script type="text/javascript" src="//cdn.it.auth.gr/libraries/angular/angular-1.5.5/angular-route.min.js"></script>
    <script type="text/javascript" src="//cdn.it.auth.gr/libraries/angular/angular-1.5.5/angular-sanitize.min.js"></script>
    <script type="text/javascript" src="js/angular/smart-table.js"></script>
    <script type="text/javascript" src="js/fullcalendar/calendar.js"></script>
    <!-- Angular Fullcalendar plugin -->

    <!-- Application -->
    <script type="text/javascript" src="app/app.js"></script>
    <!-- Controllers -->
    <script type="text/javascript" src="app/controllers/CalendarController.js"></script>
    <script type="text/javascript" src="app/controllers/ExportController.js"></script>
    <script type="text/javascript" src="app/controllers/FrontController.js"></script>
    <script type="text/javascript" src="app/controllers/RoomsController.js"></script>
  	<script type="text/javascript" src="app/controllers/RoomController.js"></script>
  	<script type="text/javascript" src="app/controllers/HeaderController.js"></script>
    <script type="text/javascript" src="app/controllers/CourseController.js"></script>
    <script type="text/javascript" src="app/controllers/FacultyController.js"></script>
    <script type="text/javascript" src="app/controllers/FacultyMembersController.js"></script>
    <script type="text/javascript" src="app/controllers/FacultyMembersNewController.js"></script>
    <script type="text/javascript" src="app/controllers/CoursesListController.js"></script>
    <script type="text/javascript" src="app/controllers/UsersController.js"></script>
    <script type="text/javascript" src="app/controllers/PeriodsController.js"></script>
    <script type="text/javascript" src="app/controllers/PeriodsUnitController.js"></script>
    <script type="text/javascript" src="app/controllers/ExcludedDatesController.js"></script>
    <script type="text/javascript" src="app/controllers/ExcludedDatesUnitController.js"></script>
    <script type="text/javascript" src="app/controllers/AboutController.js"></script>
    <script type="text/javascript" src="app/controllers/ReservationsController.js"></script>
    <script type="text/javascript" src="app/controllers/ReservationsListController.js"></script>
    <script type="text/javascript" src="app/controllers/RoomAssignController.js"></script>
    <script type="text/javascript" src="app/controllers/UnitCoursesController.js"></script>

    <!-- Application CSS files -->
    <link href="css/custom.css" rel="stylesheet" type="text/css" />
    <link href="css/fullcalendar_custom.css" rel="stylesheet" type="text/css" />
    <link href="css/front.css" rel="stylesheet" type="text/css" />
    <link href="css/rooms.css" rel="stylesheet" type="text/css" />
    <link href="css/dataTable.css" rel="stylesheet" type="text/css" />

    <script src="app/utils.js"></script>
    
    <!-- X-editable -->
    <!-- <link href="js/angular-xeditable-0.8.1/css/xeditable.css" rel="stylesheet"/>
	<script src="js/angular-xeditable-0.8.1/js/xeditable.js"></script> -->
	<!-- nya-bootstrap-select -->
	<!-- <link href="js/nya-bootstrap-select/css/nya-bs-select.css" rel="stylesheet"> -->
	<!-- <script src="js/nya-bootstrap-select/js/nya-bs-select.js"></script> -->
	
	<!-- <script type="text/javascript" src="js/angular/angularjs-dropdown-multiselect.js"></script> -->
	<script type="text/javascript" src="js/angular/ui-bootstrap-tpls-2.5.0.min.js"></script>
	<!--  https://www.npmjs.com/package/angularjs-datepicker -->
	<link href="js/angular/angular-datepicker.css" rel="stylesheet"/>
	<script src="js/angular/angular-datepicker.js"></script> 
	
  	<link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/css/select2.min.css" rel="stylesheet" />
  	<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/js/select2.min.js"></script>
  	<link href="https://cdnjs.cloudflare.com/ajax/libs/clockpicker/0.0.7/bootstrap-clockpicker.css" rel="stylesheet" />
   	<script src="https://cdnjs.cloudflare.com/ajax/libs/clockpicker/0.0.7/bootstrap-clockpicker.js"></script>
</head>

<body ng-app="rooms">
    <?php echo $this->fetch('header.phtml', ['user' => $user]); ?>
    <div id="content" ng-view></div>
    <?php echo $this->fetch('footer.phtml', ['user' => $user]); ?>
</body>

</html>
