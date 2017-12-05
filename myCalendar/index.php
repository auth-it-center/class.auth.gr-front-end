<?php
  if (isset($_SERVER['email']) and $_SERVER['eduPersonPrimaryAffiliation'] == 'student') {
    header('Location:'."/#myCalendar?".$_SERVER['QUERY_STRING']);
  } else if (isset($_SERVER['email']) and $_SERVER['eduPersonPrimaryAffiliation'] == 'faculty') {
    header('Location:'."/#teacherCalendar?".$_SERVER['QUERY_STRING']);
  } else {
    header('Location:'."/");
  }
?>
