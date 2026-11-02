import nonWP from "./index.ts";
import Template from "./Template";
import WPFeatureImage from "./WPFeatureImage";

export default {
  ...nonWP,
  wpTemplate: Template,
  featuredImage: WPFeatureImage
};
