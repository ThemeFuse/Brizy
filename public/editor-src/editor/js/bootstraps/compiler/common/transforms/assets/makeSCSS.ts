import type { Config } from "visual/global/Config";
import {
  EcwidGroups,
  ElementTypes,
  MinistryBrandsGroups,
  ShopifyGroups
} from "visual/global/Config/types/configs/ElementTypes";
import type { SCSSSheet } from "visual/providers/StyleProvider/SCSSSheet";
import { compileAssetUrl } from "visual/utils/asset";
import type { Asset } from "./index";
import { withRel } from "./makeStyles";
import { SCSS_COMPONENT_SCORE } from "./scores";

interface AssetData {
  chunkName: string;
  modulePath: string;
  config: Config;
}

const makeAsset = ({ chunkName, modulePath, config }: AssetData): Asset => {
  const asset: Asset = {
    name: chunkName,
    score: SCSS_COMPONENT_SCORE,
    content: {
      type: "file",
      url: compileAssetUrl(modulePath, config),
      attr: withRel(
        {
          class: "brz-link brz-link-scss",
          media: "print",
          onload: "this.media='all'"
        },
        config
      )
    },
    pro: false
  };

  return asset;
};

interface Data {
  scssSheet: SCSSSheet;
  usedComponents: Array<string>;
  config: Config;
}

export const makeSCSS = (data: Data): Array<Asset> => {
  const { scssSheet, usedComponents, config } = data;
  const { free } = scssSheet.getImports();
  const assets = new Map<string, Asset>();
  const hasMinistryBrands = usedComponents.some((c) =>
    MinistryBrandsGroups.includes(c as ElementTypes)
  );
  const hasEcwid = usedComponents.some((c) =>
    EcwidGroups.includes(c as ElementTypes)
  );
  const hasShopify = usedComponents.some((c) =>
    ShopifyGroups.includes(c as ElementTypes)
  );

  free.forEach(({ modulePath, chunkName, componentId, groupName }) => {
    const elementType = componentId ?? chunkName;
    const shouldInclude =
      usedComponents.includes(elementType) ||
      (groupName === "ministryBrands" && hasMinistryBrands) ||
      (groupName === "ecwid" && hasEcwid) ||
      (groupName === "shopify" && hasShopify);

    if (shouldInclude) {
      assets.set(chunkName, makeAsset({ modulePath, chunkName, config }));
    }
  });

  return [...assets].map(([, asset]) => asset);
};
