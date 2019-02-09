function myday(date) {
  var strs = new Array(); //定义一数组 
  strs = date.split("-"); //字符分割 
  var day = new Date(strs);
  var minutes = 1000 * 60
  var hours = minutes * 60
  var days = hours * 24
  var result = Math.ceil(day / days) - 1
  return result
}
function irrResult(values, dates, rate) {
  var r = rate + 1;
  var result = values[0];
  for (var i = 1; i < values.length; i++) {
    var frac = (myday(dates[i]) - myday(dates[0])) / 365;
    if(r<0)
    {
      return "error";
    }
    result += values[i] / Math.pow(r, frac);
  }
  return result;
}
function irrResultDeriv(values, dates, rate) {
  var r = rate + 1;
  var result = 0;
  for (var i = 1; i < values.length; i++) {
    var frac = (myday(dates[i]) - myday(dates[0])) / 365;
    if (r < 0) 
    {
      return "error";
    }
    result -= frac * values[i] / Math.pow(r, frac + 1); 
  }
  return result;
}
function XIRR(values, dates, guess) {
  var positive = false;
  var negative = false;
  for (var i = 0; i < values.length; i++) {
    if (values[i] > 0) positive = true;
    if (values[i] < 0) negative = true;
  }
 
  if (!positive || !negative) return '#NUUUUUUUM';

  var guess = (typeof guess === 'undefined') ? 0.1 : guess;
  var resultRate = guess;

  var epsMax = 1e-10;
  var iterMax = 500;

  var newRate, epsRate, resultValue;
  var iteration = 0;
  var contLoop = true;

  var temp = 0;
  do {
    resultValue = irrResult(values, dates, resultRate);
    if (resultValue == "error")
    {
      return "error";
    }
    temp = irrResultDeriv(values, dates, resultRate);
    if (temp == "error")
    {
      return "error";
    }
    newRate = resultRate - resultValue / temp;
    epsRate = Math.abs(newRate - resultRate);
    resultRate = newRate;
    contLoop = (Math.abs(resultValue) > epsMax);
  } while (contLoop && (++iteration < iterMax));

  if (contLoop) return "#NUM!";
  return resultRate;
}
function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}
var month_day=[31,28,31,30,31,30,31,31,30,31,30,31];
function isLeapYear(year) 
{ 
  return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0); 
}
function monthplus(year,month,day) {
  month++;
  if (month > 12) {
    month = 1;
    year++;
  }
  else if(month == 2)
  {
    if (day > 28)
    {
      if(isLeapYear(year) == true)
      {
        day = 29;
      }
      else
      {
        day = 28;
      }
    } 
  }
  else
  {
    if (day > month_day[month-1])
    {
      day = month_day[month - 1];
    }
  }
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  /*if (day >= 0 && day <= 9) {
    day = "0" + day;
  }*/
  var date = year + "-" + month + "-" + day;
  return [date,year,month];
}
function getdate(date) {
  var strs = new Array(); //定义一数组 
  strs = date.split("-"); //字符分割 

  var year = strs[0];
  var month = strs[1];
  var day = strs[2];
  return [year,month,day];
}
module.exports = {
  XIRR: XIRR,
  getNowFormatDate: getNowFormatDate,
  monthplus: monthplus,
  getdate: getdate
}