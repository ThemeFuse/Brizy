import { match } from "fp-utilities";
import { WhiteLabel } from "visual/component/LeftSidebar/components/Cms/types/WhiteLabel";
import Conf from "visual/global/Config";
import { Config } from "visual/global/Config/types";
import { isCloud } from "visual/global/Config/types/configs/Cloud";
import { isWp } from "visual/global/Config/types/configs/WP";

export const getWhiteLabel = (): boolean => {
  const pro = Conf.get("pro");

  return pro?.whiteLabel ?? false;
};

export const _getWhiteLabel: (config: Config) => WhiteLabel | undefined = match(
  [
    isWp,
    (c): WhiteLabel | undefined =>
      c.pro?.whiteLabel
        ? {
            brandingName: c.branding.name,
            updateToProLink: c.urls.upgradeToPro,
            supportLink: c.urls.support,
            aboutUsLink: c.urls.about
          }
        : undefined
  ],
  [isCloud, (c): WhiteLabel | undefined => c.whiteLabel]
);
