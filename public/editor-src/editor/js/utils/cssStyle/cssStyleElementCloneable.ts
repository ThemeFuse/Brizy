import { defaultValueValue } from "../onChange";
import { CSSValue } from "../style2/types";

export function cssStyleElementCloneableGap({ v, device }: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ key, v, device });
  const padding = dvv("itemPadding");

  return `gap:20px ${padding}px;`;
}
