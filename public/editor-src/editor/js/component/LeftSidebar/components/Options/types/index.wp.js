import Template from "./Template";
import WPFeatureImage from "./WPFeatureImage";
import nonWP from "./index.ts";

export default {
  ...nonWP,
  wpTemplate: Template,
  featuredImage: WPFeatureImage
};
