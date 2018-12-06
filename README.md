# class.auth.gr Front End<img src="https://user-images.githubusercontent.com/6997990/33650415-90e07842-da6a-11e7-9f42-f8da1fd90f71.png" align="left" width="40">

## About
This project is the front-end code of the Class Scheduling System of the [Aristotle Univesity of Thessaloniki](https://www.auth.gr/). It was initially developed to serve the needs of our university, but in the course we thought the solution may prove useful to other institutions as well. While only available in Greek, we are in the process of internationalizing the code, with English as the first alternative language.

You can check the live production service at https://class.auth.gr.

## Functionality
In its heart, the solution is a calendaring application to publish the timetable of classes taught in the different university departments during each semester/period. 

* department registrars update the schedule each semester, by setting the weekly recurrent sessions for each course and instructor, the location/venue and the exact semester duration (begin/end dates).
* isolated (not recurring) events can also be scheduled, to allow full view into venue availability. Support for requesting a venue available to a different department is also supported.
* full class schedule for all departments is publicly available.
* students can login to view or export their personalized schedule, according to their class enrollment.
* instructors can login to view or export their personalized schedule, according to class teaching assignements, but they can also cancel and reschedule a session, based on availability of venues.
* venue information is also publicly available, with basic info about venue schedule, capacity, location, photos and maps.

## Technologies
The solution is currently based on a mix of different technologies:
 - AngularJS (1.5), Javascript and HTML are employed for the publicly available front-end
 - PHP, Slim3 microframework are used for the back-end
 - FullCalendar(https://fullcalendar.io/) is the core library used for displaying & handling the calendar events
 - mPDF library is used for printing/exporting the calendar schedule in pdf format
 - SimpleSAMLphp is used for authentication
 - MySQL & MSSQL. The MSSQL student information system DB is queried for course, class and instructor info. A separate custom MySQL DB is queried for session scheduling and venue info. 
 - An intermediate (custom made) JSON API provides all scheduled session info to the front-end.

Currently, only the front-end code is available. We intend to gradually open source the whole system to allow for a fully stand-alone solution.

## class.auth.gr Images
### Home Screen
<img width="500" alt="class home screen" src="/screenshots/homeScreen.png"/>

### Public Calendar
<img width="500" alt="public calendar" src="/screenshots/publicCalendarScreen.png"/>

### University Venues
<img width="500" alt="public calendar" src="/screenshots/universityVenuesScreen.png"/>


## License
GNU General Public License v3.0

See <a href ="https://github.com/auth-it-center/class.auth.gr-front-end/blob/master/LICENSE">LICENSE</a> to see the full text.


