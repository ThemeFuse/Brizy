import { getIn } from "timm";
import { ElementModel } from "visual/component/Elements/Types";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { getFlatShortcodes } from "visual/shortcodeComponents/utils";
import { Shortcode } from "visual/types";
import { Block } from "visual/types/Block";
import { isModel } from "visual/utils/models";
import { findDeep } from "visual/utils/object";

type UsedModelsImage = {
  config: ConfigCommon;
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

// we have some exceptions' element is from free but have some extra key for pro
const exceptions = ["WPFeaturedImage"];
const proSections = [
  "SectionPopup2",
  "SectionPopup",
  "SectionFooter",
  "SectionHeader"
];

export const blockIsPro = ({
  models,
  globalBlocks,
  config
}: UsedModelsImage): boolean => {
  const Shortcodes = getFlatShortcodes(config);
  const shortcodes = Object.values(Shortcodes)
    .reduce((acc, item) => acc.concat(item), [])
    .filter((item) => item.pro)
    .map(excludeWrapper);

  const { obj } = findDeep(models, (model: ElementModel) => {
    const type = String(model.type);

    if (type === "GlobalBlock" && globalBlocks) {
      const id = getIn(model, ["value", "_id"]) as string | undefined;

      if (id && globalBlocks[id]) {
        return blockIsPro({ models: globalBlocks[id], globalBlocks, config });
      }
    }

    if (proSections.includes(type)) {
      return true;
    }

    return shortcodes.find(({ resolve, id }) => {
      const isType = resolve.type === type;
      if (isType && exceptions.includes(id)) {
        return false;
      }

      return isType;
    });
  });

  return isModel(obj);
};
