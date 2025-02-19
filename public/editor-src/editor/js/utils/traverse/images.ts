import { Block } from "visual/types/Block";
import { modelTraverse } from "visual/utils/traverse";
import { getComponentDefaultValue } from "./common";

type UsedModelsImage = {
  models: Block | { items: Block[] };
  globalBlocks?: { [key: string]: Block };
};

export const getUsedModelsImages = ({
  models,
  globalBlocks
}: UsedModelsImage): Array<string> => {
  const images: Set<string> = new Set();

  modelTraverse(models, {
    Component({ type, value }: Block) {
      const defaultStyle = getComponentDefaultValue(type)?.content || {};

      Object.entries(defaultStyle.images || {}).forEach(([key, keyValue]) => {
        const imageValue = value[key] || keyValue;

        if (imageValue) {
          images.add(imageValue);
        }
      });
    },
    GlobalBlock({ value: { _id } }: Block) {
      if (_id && globalBlocks?.[_id]) {
        getUsedModelsImages({ models: globalBlocks[_id] }).forEach((image) => {
          images.add(image);
        });
      }
    }
  });

  return [...images];
};
