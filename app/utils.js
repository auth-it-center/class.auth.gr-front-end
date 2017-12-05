function getCurrentPeriodIndex(periods) {
    var date = new Date();
    var month = date.getMonth() + 1;
    var period = 1;

    if (2 <= month && month <= 5)
    {
        period = 2;
    }
    else if(month >= 6 && month < 9)
    {
        period = 4;
    }
    else if(month == 9)
    {
        period = 5;
    }
    else if(month == 1)
    {
        period = 3;
    }

    var index = 0;
    for (var i = 0; i < periods.length; i++) {
      if (periods[i].periodTypeId == period){
        index = i;
        break;
      }
    }

    return index;
}

function getRoomPeriodIndex() {
  var date = new Date();
  var month = date.getMonth() + 1;
  var period = 1;

  if (2 <= month && month <= 9)
  {
      period = 2;
  }

  return period;
}

function getPeriodString(period) {
  period = parseInt(period);
  switch (period) {
    case 1:
      return "Χειμερινό Εξάμηνο";
    case 2:
      return "Εαρινό Εξάμηνο";
    case 3:
      return "Εξεταστική Φεβρουαρίου";
    case 4:
      return "Εξεταστική Ιουνίου";
    case 5:
      return "Εξεταστική Σεπτεμβρίου";
    default:
      return "Άγνωστη Περίοδος";
  }
}

function examIdToString(examId){
  var examString = " εξάμηνο";
  examId = parseInt(examId);
  switch (examId) {
    case 255:
      examString = "Χειμερινού / Εαρινού εξαμήνου";
      break;
    case 251:
      examString = "Χειμερινού εξαμήνου";
      break;
    case 252:
      examString = "Εαρινού εξαμήνου";
      break;
    default:
      examString = examId + examString;
  }
  return examString;
}

function getFilterOptions(periods){

    function compare(a, b) {
      var startA = new Date(a.startDate);
      var startB = new Date(b.startDate);
      return startA.getTime() - startB.getTime();
    }

    periods = periods.sort(compare);

    var options = [];
    for (var i = 0; i < 5; i++) {
      period = periods[i];
      options.push({'value':[period.periodTypeId, period.year],'text': period.name + ' ' + period.year.toString() + ' - ' + (parseInt(period.year) + 1).toString()});
    }
    return options;
}

function getRandomColor(unitId, examId) {
  // hue range 0 - 360
  var hue = (unitId * 659) % 361;

  // saturation range 40 - 60
  var saturation = 40 + ( (unitId * 107 ) % 21 );
  // var saturation = 30;

  // light range (dark) 35 - 65  (light)
  var light = 100 - (50 + 3 * (examId - 1));
  if (examId >= 250) {
    light = 55;
  }
  return "hsl(" + hue + ", " + saturation + "%, " + light + "%)";
}

function getPeriodFromParameters(periods, period) {
  var index = 0;
  for (var i = 0; i < periods.length; i++) {
    if (periods[i].value[0] == period) {
      index = i;
      break;
    }
  }
  return periods[index];
}

function getTeacherLinks(staffData, period) {
  if (staffData.length == 0){
    return "-";
  }
  var html = "";
  var i = 0;
  var staff;

  for (i = 0; i < staffData.length - 1; i++) {
    staff = staffData[i];
    html += '<a target="_blank" href="/#/faculty/' + staff.apmId + '?period=' + period + '">';
    html += staff.first + ' ' + staff.last;
    html += '</a>, ';
  }

  staff = staffData[i];
  html += '<a target="_blank" href="/#/faculty/' + staff.apmId + '?period=' + period + '">';
  html += staff.first + ' ' + staff.last;
  html += '</a>';

  return html;
}
