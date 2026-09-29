import { Str } from "@brizy/readers";
import { defaultValueValue } from "../onChange";
import type { CSSValue } from "../style2/types";

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
