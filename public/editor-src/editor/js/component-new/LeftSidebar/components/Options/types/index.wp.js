import nonWP from "./index.js";
import WPTemplate from "./WPTemplate";
import WPFeatureImage from "./WPFeatureImage";

export default {
  ...nonWP,
  wpTemplate: WPTemplate,
  wpFeatureImage: WPFeatureImage
};
