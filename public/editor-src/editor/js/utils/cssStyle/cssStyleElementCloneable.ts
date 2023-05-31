import { defaultValueValue } from "../onChange";
import { CSSValue } from "../style2/types";

export function cssStyleElementCloneablePadding({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ key, v, device });
  const padding = dvv("itemPadding");

  return `padding:0 ${padding / 2}px 20px ${padding / 2}px;`;
}
