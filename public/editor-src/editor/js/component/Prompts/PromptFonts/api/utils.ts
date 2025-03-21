import { create } from "fontkit";
import { orElse } from "fp-utilities";
import { produce } from "immer";
import { VariationFont } from "visual/types/Fonts";
import { checkValue2 } from "visual/utils/checkValue";
import { pipe } from "visual/utils/fp";
import * as Obj from "visual/utils/reader/object";
import { Response, VariationAxes, VariationAxesTags } from "./types";

const readVariationAxes = (font: unknown) =>
  pipe(Obj.read, orElse({}), Obj.readKey("variationAxes"))(font);

export const getFontVariation = async (
  file: File
): Promise<VariationFont[]> => {
  try {
    const buffer = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    }).then((arrayBuffer) => {
      return Buffer.from(arrayBuffer ?? []);
    });

    const font = create(buffer);

    const variationAxes = readVariationAxes(font) as VariationAxes;
    if (variationAxes && Obj.length(variationAxes)) {
      return Object.entries(variationAxes)
        .filter(([tag]) => checkValue2(VariationAxesTags)(tag))
        .map(([tag, { min, max }]) => ({
          tag,
          min,
          max
        }));
    }
    return [];
  } catch (e) {
    return [];
  }
};

// uid for cloud is id in editor
export const normalizeFonts = (
  res: Response,
  variations?: VariationFont[]
): Response => {
  return produce(res, (draft) => {
    // renamed uid to id
    if (draft.data.uid) {
      draft.data.id = draft.data.uid;
      delete draft.data.uid;
    }

    if (variations && variations.length) {
      draft.data.variations = variations;
    }
  });
};
