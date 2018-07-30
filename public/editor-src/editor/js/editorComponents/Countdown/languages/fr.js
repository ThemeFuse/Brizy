export default {
  labels: [
    ['Années','Mois','Semaines','Jours','Heures','Minutes','Secondes'],
    ['Année','Mois','Semaine','Jour','Heure','Minute','Seconde']
  ],
  whichLabels: function(amount) {
    var labelNumber = Number(amount > 1 ? 0 : 1);

    return this.labels[labelNumber];
  }
}