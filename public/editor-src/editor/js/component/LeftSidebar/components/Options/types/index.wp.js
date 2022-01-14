import nonWP from "./index.js";
import WPFeatureImage from "./WPFeatureImage";
import Template from "./Template";

export default {
  ...nonWP,
  wpTemplate: Template,
  wpFeatureImage: WPFeatureImage
};
