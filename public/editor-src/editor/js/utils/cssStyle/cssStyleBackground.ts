import { defaultValueValue } from "visual/utils/onChange";
import { CSSValue } from "visual/utils/style2/types";
import { BgRepeat } from "visual/utils/containers/types";

export function cssStyleBgSize({ v, device, state }: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const bgSize = dvv("bgSize");

  return `background-size:${bgSize};`;
}

export function cssStyleBgRepeat({ v, device, state }: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const bgRepeat = dvv("bgRepeat");

  switch (bgRepeat) {
    case BgRepeat.On: {
      return "background-repeat: repeat;";
    }
    case BgRepeat.Off: {
      return "background-repeat: no-repeat;";
    }
    case BgRepeat.RepeatX:
    case BgRepeat.RepeatY: {
      return `background-repeat:${bgRepeat};`;
    }
    default: {
      return "";
    }
  }
}
