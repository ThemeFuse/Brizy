import { EcwidConfig } from "visual/libs/Ecwid/types/EcwidConfig";
import { Value } from "./types/Value";

function onOffToBool(v: "on" | "off"): boolean {
  switch (v) {
    case "off":
      return false;
    case "on":
      return true;
  }
}

export function valueToEciwdConfig(v: Value): EcwidConfig {
  return {
    show_footer_menu: onOffToBool(v.footerDisplay),
    show_signin_link: onOffToBool(v.signinLink),
    show_breadcrumbs: onOffToBool(v.breadcrumbs)
  };
}
