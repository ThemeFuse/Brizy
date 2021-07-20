import { CMS, Shopify } from "visual/global/Config/types/configs/Cloud";
import { WhiteLabel } from "visual/global/Config/types/WhiteLabel";
import { t } from "visual/utils/i18n";

export const getWhiteLabel = (config: CMS | Shopify): WhiteLabel => {
  return (
    config.whiteLabel ?? {
      brandingName: t("Brizy"),
      updateToProLink: config.urls.upgradeToPro,
      supportLink: config.urls.support,
      aboutUsLink: config.urls.about
    }
  );
};
