import Image from "./index.jsx";

const formatPopulation = population => population.replace(/{{|}}/g, "");

export default class WPImage extends Image {
  getExtraImageProps(v) {
    const { alt: alt_, imageSrc, imagePopulation } = v;
    const alt = alt_
      ? alt_
      : imagePopulation
      ? `{{ brizy_dc_image_alt placeholder='${formatPopulation(
          imagePopulation
        )}' }}`
      : `{{ brizy_dc_image_alt uid='${imageSrc}' }}`;

    return { alt };
  }
}
