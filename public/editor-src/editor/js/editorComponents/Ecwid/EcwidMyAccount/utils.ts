import { EcwidConfig } from "visual/libs/Ecwid/types/EcwidConfig";
import { Value } from "./types/Value";
import { onOffToBool } from "visual/utils/boolean";

export function valueToEciwdConfig(v: Value): EcwidConfig {
  return {
    show_footer_menu: onOffToBool(v.footerDisplay),
    show_signin_link: onOffToBool(v.signinLink),
    show_breadcrumbs: onOffToBool(v.breadcrumbs)
  };
}
