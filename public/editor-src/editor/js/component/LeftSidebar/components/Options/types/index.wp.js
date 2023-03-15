import Template from "./Template";
import WPFeatureImage from "./WPFeatureImage";
import nonWP from "./index.js";

export default {
  ...nonWP,
  wpTemplate: Template,
  featuredImage: WPFeatureImage
};
