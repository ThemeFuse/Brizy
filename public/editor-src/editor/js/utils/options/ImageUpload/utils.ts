import { ImageType } from "visual/utils/image/types";
import { Reader } from "visual/utils/reader/types";

export const readImageType: Reader<ImageType> = (v) => {
  switch (v) {
    case ImageType.Internal:
    case ImageType.External:
      return v;
    default:
      return undefined;
  }
};
