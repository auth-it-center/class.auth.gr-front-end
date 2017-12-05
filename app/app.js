(function() {

    var app = angular.module("rooms", ["ngRoute", "ui.calendar", "smart-table", "ngSanitize"]);

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
                templateUrl: "app/templates/about.php",
                controller: "RoomsController",
                reloadOnSearch: false
            })
            .when("/about", {
	            templateUrl: "app/templates/front.php",
	            controller: "AboutController"
	        })
            .when("/myCalendar", {
                templateUrl: "app/templates/myCalendar.php",
                controller: "CalendarController"
            })
            .when("/teacherCalendar", {
              templateUrl: "app/templates/myCalendar.php",
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
            .when("/courses", {
              templateUrl: "app/templates/courseslist.php",
              controller: "CoursesListController",
              controllerAs: "ctrl"
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
