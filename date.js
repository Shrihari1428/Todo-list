//jshint esversion:6

exports.getDate = function() {
  var date = new Date();

  var dateObj = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  var currentDay = date.toLocaleDateString("en-US", dateObj);
  return currentDay;
}

exports.getDay = function() {
  var date = new Date();

  var dateObj = {
    weekday: "long",
  };

  var currentDay = date.toLocaleDateString("en-US", dateObj);
  return currentDay;
}
