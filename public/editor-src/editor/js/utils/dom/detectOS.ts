export function detectOS() {
  let OSName = "Unknown OS";
  if (typeof window !== "undefined") {
    const { appVersion } = navigator;
    if (appVersion.indexOf("Win") !== -1) OSName = "Windows";
    if (appVersion.indexOf("Mac") !== -1) OSName = "MacOS";
    if (appVersion.indexOf("Linux") !== -1) OSName = "Linux";
  }

  return OSName;
}
