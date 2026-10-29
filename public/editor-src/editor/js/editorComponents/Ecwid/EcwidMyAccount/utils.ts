import type { EcwidConfig } from "visual/libs/Ecwid/types/EcwidConfig";
import { onOffToBool } from "visual/utils/boolean";
import type { Value } from "./types/Value";

export function valueToEciwdConfig(v: Value): EcwidConfig {
  return {
    show_footer_menu: onOffToBool(v.footerDisplay),
    show_signin_link: onOffToBool(v.signinLink),
    show_breadcrumbs: false
  };
}
