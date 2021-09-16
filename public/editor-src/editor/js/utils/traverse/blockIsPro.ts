import { getIn } from "timm";
import { Block, Shortcode } from "visual/types";
import { ElementModel } from "visual/component/Elements/Types";
import Shortcodes from "visual/shortcodeComponents";
import { findDeep } from "visual/utils/object";
import { isModel } from "visual/utils/models";

type UsedModelsImage = {
  models: Block | { items: Block[] };
  globalBlocks?: { [key: string]: Block };
};

const excludeWrapper = (
  shortcode: Shortcode
): { resolve: ElementModel; id: string } => {
  const resolve = shortcode.component.resolve ?? {};
  return {
    id: shortcode.component.id,
    resolve: (getIn(resolve, ["value", "items", 0]) ?? {}) as ElementModel
  };
};

// we have some exceptions element is from free but have some extra key for pro
const exceptions = ["WPFeaturedImage"];

export const blockIsPro = ({
  models,
  globalBlocks
}: UsedModelsImage): boolean => {
  const shortcodes = Object.values(Shortcodes)
    .reduce((acc, item) => acc.concat(item), [])
    .filter(item => item.pro)
    .map(excludeWrapper);

  const { obj } = findDeep(models, (model: ElementModel) => {
    if (model.type === "GlobalBlock" && globalBlocks) {
      const id = getIn(model, ["value", "_id"]) as string | undefined;

      if (id && globalBlocks[id]) {
        return blockIsPro({ models: globalBlocks[id], globalBlocks });
      }
    }

    return shortcodes.find(({ resolve, id }) => {
      const isType = resolve.type === model.type;
      if (isType && exceptions.includes(id)) {
        return false;
      }

      return isType;
    });
  });

  return isModel(obj);
};
