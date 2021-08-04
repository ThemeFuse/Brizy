import { readWithParser } from "visual/utils/reader/readWithParser";
import { ElementModel } from "visual/component/Elements/Types";
import { mPipe } from "visual/utils/fp";
import * as Num from "visual/utils/math/number";
import * as Str from "visual/utils/string/specs";
import { prop } from "visual/utils/object/get";

export interface ImagePatch {
  imageExtension: string;
  imageHeight: number;
  imageSrc: string;
  imageWidth: number;
}

export interface ImageDCPatch {
  imagePopulation: string;
}

// is it correct fn name?
export const fromImageElementModel = readWithParser<ElementModel, ImagePatch>({
  imageSrc: mPipe(prop("imageSrc"), Str.read),
  imageExtension: mPipe(prop("imageExtension"), Str.read),
  imageHeight: mPipe(prop("imageHeight"), Num.read),
  imageWidth: mPipe(prop("imageWidth"), Num.read)
});

export const fromImageDCElementModel = readWithParser<
  ElementModel,
  ImageDCPatch
>({
  imagePopulation: mPipe(prop("imagePopulation"), Str.read)
});
