export default {
  labels: [
    ['Лет','Месяцев','Недель','Дней','Часов','Минут','Секунд'],
    ['Год','Месяц','Неделя','День','Час','Минута','Секунда'],
    ['Года','Месяца','Недели','Дня','Часа','Минуты','Секунды']
  ],
  whichLabels: function(amount) {
    var units = amount % 10;
    var tens = Math.floor((amount % 100) / 10);
    var labelNumber = (amount === 1 ? 1 : (units >= 2 && units <= 4 && tens !== 1 ? 2 :
      (units === 1 && tens !== 1 ? 1 : 0)));

    return this.labels[labelNumber];
  }
}