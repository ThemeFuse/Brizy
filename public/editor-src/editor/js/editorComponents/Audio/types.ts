import { ElementModel } from "visual/component/Elements/Types";

enum BaseSwitchTypes {
  on = "on",
  off = "off"
}

type BaseSwitchType = keyof typeof BaseSwitchTypes;

interface SoundCloudAppeareanceOptions {
  artWork: BaseSwitchType;
  comments: BaseSwitchType;
  playCounts: BaseSwitchType;
  username: BaseSwitchType;
}

interface SoundCloudButtonOptions {
  likeButton: BaseSwitchType;
  buyButton: BaseSwitchType;
  downloadButton: BaseSwitchType;
  shareButton: BaseSwitchType;
}

interface SoundCloudOptions
  extends SoundCloudAppeareanceOptions,
    SoundCloudButtonOptions {}

//TODO: review if Value contain all the Element keys
export interface Value extends ElementModel, SoundCloudOptions {
  customCSS: string;
  url: string;
  audio: string;
  bgColorHex: string;
  bgColorPalette: string;
  borderColorHex: string;
  borderColorPalette: string;
  controlsHex: string;
  controlsPalette: string;
  style: "basic" | "artwork";
  autoplay: BaseSwitchType;
  caption: string;
}
