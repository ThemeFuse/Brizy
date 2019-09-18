import _ from "underscore";
import * as languages from "./languages";

export const formatDate = (date, template = "d/m/Y") => {
  date = new Date(date);
  if (isNaN(Date.parse(date))) return date;

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return template
    .replace("Y", year)
    .replace("m", month)
    .replace("d", day)
    .replace("H", hours)
    .replace("i", minutes)
    .replace("s", seconds);
};

function isValidDate(date) {
  const matches = /^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/.exec(date);
  if (matches === null) return false;

  const d = matches[2];
  const m = matches[1] - 1;
  const y = matches[3];
  const composedDate = new Date(y, m, d);

  return (
    composedDate.getDate() == d &&
    composedDate.getMonth() == m &&
    composedDate.getFullYear() == y
  );
}

export function getTime(date, hours, minutes) {
  const [hour, suffix] = hours.split(" ");
  const timeZoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

  return isValidDate(date)
    ? new Date(`${date} ${hour}:${minutes} ${suffix}`).getTime() -
        timeZoneOffset
    : new Date(0).getTime();
}

export function getLanguage(id = "en") {
  return languages[id];
}
