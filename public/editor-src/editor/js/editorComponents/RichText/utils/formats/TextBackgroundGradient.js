import { getBackgroundGradient } from "./BackgroundGradient";

export const getTextBackgroundGradient = (getConfig) => {
  const BackgroundGradient = getBackgroundGradient(getConfig);

  class TextBackgroundGradient extends BackgroundGradient {
    static className = "text-gradient-bg";
    static setValue(value, node) {
      super.setValue(value, node);
      node.classList.remove("brz-image-gradient");
    }
  }
  TextBackgroundGradient.blotName = "textBackgroundGradient";

  return TextBackgroundGradient;
};
