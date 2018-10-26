import Image from "./index.jsx";

const formatPopulation = population => population.replace(/{{|}}/g, "");

export default class WPImage extends Image {
  getExtraImageProps(v) {
    const { imageSrc, imagePopulation } = v;
    const alt = imagePopulation
      ? `{{ brizy_dc_image_alt placeholder='${formatPopulation(
          imagePopulation
        )}' }}`
      : `{{ brizy_dc_image_alt uid='${imageSrc}' }}`;
    const title = imagePopulation
      ? `{{ brizy_dc_image_title placeholder='${formatPopulation(
          imagePopulation
        )}' }}`
      : `{{ brizy_dc_image_title uid='${imageSrc}' }}`;

    return { alt, title };
  }
}
