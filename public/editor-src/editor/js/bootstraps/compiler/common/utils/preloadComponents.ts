import { ElementModelType2 } from "visual/component/Elements/Types";
import {
  ecwidLazyComponents,
  ministryBrandsLazyComponents,
  shopifyLazyComponents
} from "visual/editorComponents";
import { Config } from "visual/global/Config";
import { isCloud } from "visual/global/Config/types/configs/Cloud";
import { Page } from "visual/types/Page";
import { mapModels } from "visual/utils/models";

interface Data {
  config: Config;
  page: Page;
}

const getUsedModelComponents = (data: Data): Set<string> => {
  const { page, config } = data;
  const globalBlocks = config.globalBlocks ?? [];
  const components = new Set<string>();

  mapModels((model: ElementModelType2) => {
    components.add(model.type);
    return model;
  }, page.data.items);

  globalBlocks.forEach((block) => {
    mapModels((model: ElementModelType2) => {
      components.add(model.type);
      return model;
    }, block.data.value);
  });

  return components;
};

export function preloadComponents(data: Data) {
  const { config } = data;

  // Preload lazy-loaded elements (MinistryBrands, Ecwid, Shopify)
  if (isCloud(config)) {
    const usedComponents = getUsedModelComponents(data);
    const lazyComp = [
      ...Object.values(ministryBrandsLazyComponents),
      ...Object.values(ecwidLazyComponents),
      ...Object.values(shopifyLazyComponents)
    ];

    for (const { component, id } of lazyComp) {
      try {
        if (usedComponents.has(id)) {
          component.preload();
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn("Failed to preload component:", error);
      }
    }
  }
}
