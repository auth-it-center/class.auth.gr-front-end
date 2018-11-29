function convertMS(s) {
	var d, h, m;
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    h += d * 24;
    return addZero(h) + ':' + addZero(m);
}


        
        
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

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
      examString = examId + "ο "+ examString;
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

function getPeriodsWithYear(periods){

	// SORT BY DATE
    // function compare(a, b) {
      // var startA = new Date(a.startDate);
      // var startB = new Date(b.startDate);
      // return startA.getTime() - startB.getTime();
    // }
	// 
    // periods = periods.sort(compare);
    
    // SORT BY periodType
    function compareType(a, b) {
       return a.id - b.id;
    }
	periods = periods.sort(compareType);

    var options = [];
    for (var i = 0; i < 5; i++) {
      period = periods[i];
      // console.log(period);
      options.push({'id':period.periodTypeId,'text': period.name + ' ' + period.year.toString() + ' - ' + (parseInt(period.year) + 1).toString(), 'startDate':period.startDate, 'endDate':period.endDate, 'year':period.year});
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

  function checkDate(ExpiryDate){ 
  		if (ExpiryDate!=null){
		    // check date and print message 
		    if (isDate(ExpiryDate)) { 
		        return true; 
		    } 
		    else { 
		        return false;
		    } 			          
	   }
	   else 
	   	return false;
	}
			
	function isDate(ExpiryDate) { 
	    var objDate,  // date object initialized from the ExpiryDate string 
	        mSeconds, // ExpiryDate in milliseconds 
	        day,      // day 
	        month,    // month 
	        year;     // year 
	    // date length should be 10 characters (no more no less) 
	    if (ExpiryDate.length !== 10) { 
	        return false; 
	    } 
	    // console.log(ExpiryDate);
	    // third and sixth character should be '-' 
	    if (ExpiryDate.substring(2, 3) !== '-' || ExpiryDate.substring(5, 6) !== '-') { 
	        return false; 
	    } 
	    // extract month, day and year from the ExpiryDate (expected format is mm/dd/yyyy) 
	    // subtraction will cast variables to integer implicitly (needed 
	    // for !== comparing) 
	    day = ExpiryDate.substring(0, 2) - 0; 
	    month = ExpiryDate.substring(3, 5) - 1; // because months in JS start from 0 
	    year = ExpiryDate.substring(6, 10) - 0; 
	    // test year range 
	    if (year < 1000 || year > 3000) { 
	        return false; 
	    } 
	    // convert ExpiryDate to milliseconds 
	    mSeconds = (new Date(year, month, day)).getTime(); 
	    // initialize Date() object from calculated milliseconds 
	    objDate = new Date(); 
	    objDate.setTime(mSeconds); 
	    // compare input date and parts from Date() object 
	    // if difference exists then date isn't valid 
	    if (objDate.getFullYear() !== year || 
	        objDate.getMonth() !== month || 
	        objDate.getDate() !== day) { 
	        return false; 
	    } 
	    // otherwise return true 
	    return true; 
	}

