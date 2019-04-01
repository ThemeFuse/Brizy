export function detectOS() {
  let OSName = "Unknown OS";
  if (IS_EDITOR) {
    const { appVersion } = navigator;
    if (appVersion.indexOf("Win") !== -1) OSName = "Windows";
    if (appVersion.indexOf("Mac") !== -1) OSName = "MacOS";
    if (appVersion.indexOf("Linux") !== -1) OSName = "Linux";
  }

  return OSName;
}
