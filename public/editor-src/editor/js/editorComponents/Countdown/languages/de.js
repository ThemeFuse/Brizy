export default {
  labels: [
    ['Jahre','Monate','Wochen','Tage','Stunden','Minuten','Sekunden'],
    ['Jahr','Monat','Woche','Tag','Stunde','Minute','Sekunde']
  ],
  whichLabels: function(amount) {
    var labelNumber = Number(amount > 1 ? 0 : 1);

    return this.labels[labelNumber];
  }
}