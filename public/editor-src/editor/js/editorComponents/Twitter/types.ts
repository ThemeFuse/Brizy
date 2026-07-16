import { ElementModel } from "visual/component/Elements/Types";

export interface Value extends ElementModel {
  twitterType: "embed" | "followButton" | "mentionButton";
  twitterUsername: string;
  twitterTheme: string;
  buttonLarge: string;
  buttonShowCount: string;
  buttonShowScreenName: string;
  customCSS: string;
  tweet: string;
  mobileHeight: number;
  tabletHeight: number;
}

type ButtonSize = "small" | "large";

export interface TwitterOptions {
  type: "embed" | "followButton" | "mentionButton";
  name: string;
  buttonSize: ButtonSize;
  buttonShowCount: boolean;
  buttonShowScreenName: boolean;
}

export interface PreviewTwitterOptions extends TwitterOptions {
  tweet: string;
}
