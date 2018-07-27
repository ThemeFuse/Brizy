export default {
  labels: [
    ['Years', 'Months', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'],
    ['Year', 'Month', 'Week', 'Day', 'Hour', 'Minute', 'Second']
  ],
  whichLabels: function(amount) {
    var labelNumber = Number(amount > 1 ? 0 : 1);

    return this.labels[labelNumber];
  }
}