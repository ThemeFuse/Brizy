export default {
  labels: [
    ["Anni","Mesi","Settimane","Giorni","Ore","Minuti","Secondi"],
    ["Anno","Mese","Settimana","Giorno","Ora","Minuto","Secondo"]
  ],
  whichLabels: function(amount) {
    var labelNumber = Number(amount > 1 ? 0 : 1);

    return this.labels[labelNumber];
  }
};