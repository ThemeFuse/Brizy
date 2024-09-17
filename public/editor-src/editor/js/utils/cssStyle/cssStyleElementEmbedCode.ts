import { defaultValueValue } from "../onChange";
import { CSSValue } from "../style2/types";
import { Str } from "@brizy/readers";

export const cssStyleElementEmbedCodeOverflow = ({
  v,
  device,
  state
}: CSSValue): string => {
  const overflow = Str.read(
    defaultValueValue({ v, key: "overflow", device, state })
  );
  const _overflow = overflow === "on" ? "visible" : "hidden";

  return `overflow: ${_overflow};`;
};
