import type { ElementModel } from "visual/component/Elements/Types";

export enum AddonType {
  FollowButton = "followButton",
  PinWidget = "pinWidget",
  BoardWidget = "boardWidget",
  ProfileWidget = "profileWidget"
}
export interface Value extends ElementModel {
  addonType: AddonType;
  url: string;
  buttonSize: "small" | "medium" | "large";
  customCSS: string;
}
