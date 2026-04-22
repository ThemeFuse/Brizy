import type { Value } from "./types";
import { AddonType } from "./types";

export interface EmbedAnchorProps {
  href: string;
  "data-pin-do": string;
}

export function getEmbedAnchorProps(v: Value): EmbedAnchorProps {
  const { addonType, url } = v;

  switch (addonType) {
    case AddonType.FollowButton:
      return {
        href: url || "https://www.pinterest.com/",
        "data-pin-do": "buttonFollow"
      };
    case AddonType.PinWidget:
      return {
        href: url || "https://www.pinterest.com/pin/0/",
        "data-pin-do": "embedPin"
      };
    case AddonType.BoardWidget:
      return {
        href: url || "https://www.pinterest.com/",
        "data-pin-do": "embedBoard"
      };
    case AddonType.ProfileWidget:
      return {
        href: url || "https://www.pinterest.com/",
        "data-pin-do": "embedUser"
      };
  }
}
