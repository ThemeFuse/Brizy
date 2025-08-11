import { ElementModel } from "visual/component/Elements/Types";

export interface Value extends ElementModel {
  twitterType: "embed" | "followButton" | "mentionButton";
  twitterUsername: string;
  twitterTheme: string;
  buttonLarge: string;
  buttonShowCount: string;
  buttonShowScreenName: string;
  customCSS: string;
  height: number;
  tweet: string;
  mobileHeight: number;
  tabletHeight: number;
}

type Theme = "light" | "dark";
type ButtonSize = "small" | "large";

export interface TwitterOptions {
  type: "embed" | "followButton" | "mentionButton";
  name: string;
  height: number;
  theme: Theme;
  buttonSize: ButtonSize;
  buttonShowCount: boolean;
  buttonShowScreenName: boolean;
}

export interface PreviewTwitterOptions extends TwitterOptions {
  tweet: string;
}
