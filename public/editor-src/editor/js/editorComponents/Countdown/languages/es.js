export default {
  labels: [
    ['Años','Meses','Semanas','Días','Horas','Minutos','Segundos'],
    ['Año','Mes','Semana','Día','Hora','Minuto','Segundo']
  ],
  whichLabels: function(amount) {
    var labelNumber = amount === 0 ? 0 : 1;

    return this.labels[labelNumber];
  }
}