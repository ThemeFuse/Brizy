import { Cloud } from "visual/global/Config/types/configs/Cloud";

export interface WhiteLabel {
  brandingName: string;
  updateToProLink: string;
  supportLink: string;
  aboutUsLink: string;
}

export const getWhiteLabel = (fromConfig: Cloud): WhiteLabel => {
  return {
    brandingName: fromConfig.branding.name,
    updateToProLink: fromConfig.urls.upgradeToPro,
    supportLink: fromConfig.urls.support,
    aboutUsLink: fromConfig.urls.about
  };
};
