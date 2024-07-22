import { ImageType } from "visual/utils/image/types";
import { checkValue2 } from "visual/utils/checkValue";

export const readImageType = checkValue2<ImageType>(ImageType);
