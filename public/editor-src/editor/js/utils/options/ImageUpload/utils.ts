import { checkValue2 } from "visual/utils/checkValue";
import { ImageType } from "visual/utils/image/types";

export const readImageType = checkValue2<ImageType>(ImageType);
