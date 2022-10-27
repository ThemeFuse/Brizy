import { CSSValue } from "../style2/types";
import { cssStylePaddingFourFields } from "./cssStylePadding";

export const cssStyleElementCalendlyPadding = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStylePaddingFourFields({ v, device, state, prefix: "calendly" });
};
