import nonWP from "./index.js";
import WPTemplate from "./WPTemplate";
import WPFeatureImage from "./WPFeatureImage";
import { Roles } from "./Roles";

export default {
  ...nonWP,
  wpTemplate: WPTemplate,
  wpShowMembership: Roles,
  wpFeatureImage: WPFeatureImage
};
