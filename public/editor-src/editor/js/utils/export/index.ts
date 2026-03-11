import { DeviceMode } from "visual/types";
import { DESKTOP, MOBILE, TABLET } from "../responsiveMode";

const isBrowser =
  typeof window !== "undefined" && typeof window.matchMedia !== "undefined";

const mobileQuery = isBrowser ? window.matchMedia("(max-width: 767px)") : null;
const tabletQuery = isBrowser
  ? window.matchMedia("(min-width: 768px) and (max-width: 991px)")
  : null;

export const getCurrentDevice = (): DeviceMode => {
  if (!isBrowser) return DESKTOP;
  if (mobileQuery?.matches) return MOBILE;
  if (tabletQuery?.matches) return TABLET;
  return DESKTOP;
};
