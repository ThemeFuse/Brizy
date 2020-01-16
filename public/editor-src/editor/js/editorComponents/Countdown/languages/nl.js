export default {
  labels: [
    ["Jaren","Maanden","Weken","Dagen","Uren","Minuten","Seconden"],
    ["Jaar","Maand","Week","Dag","Uur","Minuut","Seconde"]
  ],
  whichLabels: function(amount) {
    var labelNumber = Number(amount > 1 ? 0 : 1);

    return this.labels[labelNumber];
  }
};