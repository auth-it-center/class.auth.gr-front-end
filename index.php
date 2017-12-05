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
    <script type="text/javascript" src="app/controllers/CoursesListController.js"></script>


    <!-- Application CSS files -->
    <link href="css/custom.css" rel="stylesheet" type="text/css" />
    <link href="css/fullcalendar_custom.css" rel="stylesheet" type="text/css" />
    <link href="css/front.css" rel="stylesheet" type="text/css" />
    <link href="css/rooms.css" rel="stylesheet" type="text/css" />
    <link href="css/dataTable.css" rel="stylesheet" type="text/css" />

    <script src="app/utils.js"></script>

</head>

<body ng-app="rooms">
    <?php include( "header.php"); ?>
    <div id="content" ng-view></div>
    <?php include( "footer.php"); ?>
</body>

</html>
