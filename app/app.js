(function() {

    var app = angular.module("rooms", ["ngRoute", "ui.calendar", "smart-table", "ngSanitize", "720kb.datepicker"]);

    app.config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "app/templates/front.php",
                controller: "FrontController"
            })
            .when("/calendar", {
                templateUrl: "app/templates/calendar.php",
                controller: "CalendarController"
            })
            .when("/rooms", {
                templateUrl: "app/templates/rooms.php",
                controller: "RoomsController",
                reloadOnSearch: false
            })
	    	.when("/about", {
	        templateUrl: "app/templates/about.php",
	        controller: "AboutController"
		    })
		    .when("/users", {
              templateUrl: "views/users",
              controller: "UsersController"
            })
            .when("/myCalendar", {
                templateUrl: "/views/myCalendar",
                controller: "CalendarController"
            })
            .when("/teacherCalendar", {
              templateUrl: "/views/myCalendar",
              controller: "CalendarController"
            })
            .when("/room/:roomId", {
                templateUrl: "app/templates/room.php",
                controller: "RoomController"
            })
            .when("/course/:courseId", {
              templateUrl: "app/templates/course.php",
              controller: "CourseController"
            })
            .when("/faculty/:apmId", {
              templateUrl: "app/templates/faculty.php",
              controller: "FacultyController"
            })
            .when("/faculty", {
              templateUrl: "app/templates/facultymembers.php",
              controller: "FacultyMembersController",
              controllerAs: "ctrl"
            })
            .when("/facultyNew", {
              templateUrl: "app/templates/facultymembersnew.php",
              controller: "FacultyMembersNewController",
            })
            .when("/courses", {
              templateUrl: "app/templates/courseslist.php",
              controller: "CoursesListController",
              controllerAs: "ctrl"
            })
            .when("/periods", {
              templateUrl: "views/periods",
              controller: "PeriodsController"
            })
             .when("/periodsUnit", {
              templateUrl: "views/periodsUnit",
              controller: "PeriodsUnitController"
            })
           .when("/excludedDates", {
              templateUrl: "views/excludedDates",
              controller: "ExcludedDatesController"
            })
           .when("/excludedDatesUnit", {
              templateUrl: "views/excludedDatesUnit",
              controller: "ExcludedDatesUnitController"
            })
          	.when("/reservations", {
              templateUrl: "views/reservations",
              controller: "ReservationsController"
            })
          	.when("/reservationsList", {
              templateUrl: "views/reservationsList",
              controller: "ReservationsListController"
            })
        	.when("/roomassign", {
              templateUrl: "views/roomassign",
              controller: "RoomAssignController"
            })
          	.when("/unitcourses", {
              templateUrl: "views/unitCourses",
              controller: "UnitCoursesController"
            })
            .otherwise({
                redirectTo: "/"
            });
    });

}());

/*
 * NOTE If you want to remove the hashtag (#) for pretty url creation
 * https://scotch.io/quick-tips/pretty-urls-in-angularjs-removing-the-hashtag
 *
If you use apache you'll want to put this in your .htaccess-file to allow incoming deep links:

RewriteEngine on

# Don't rewrite files or directories
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Rewrite everything else to index.html to allow html5 state links
RewriteRule ^ index.html [L]

*/
