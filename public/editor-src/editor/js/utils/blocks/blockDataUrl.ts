import { assetUrl } from "visual/utils/asset";

type AssetType = "kits" | "popups" | "stories" | "templates";

export const getBlockDataUrl = (type: AssetType, id: string): string => {
  switch (type) {
    case "popups": {
      return assetUrl(`popups/resolves/${id}.json`);
    }
    case "stories": {
      return assetUrl(`stories/resolves/${id}.json`);
    }
    case "templates": {
      return assetUrl(`templates/resolves/${id}.json`);
    }
    default: {
      return assetUrl(`kits/resolves/${id}.json`);
    }
  }
};
