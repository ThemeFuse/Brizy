export function detectOS() {
  let OSName = "Unknown OS";
  if (navigator.appVersion.indexOf("Win") !== -1) OSName = "Windows";
  if (navigator.appVersion.indexOf("Mac") !== -1) OSName = "MacOS";
  if (navigator.appVersion.indexOf("Linux") !== -1) OSName = "Linux";

  return OSName;
}
