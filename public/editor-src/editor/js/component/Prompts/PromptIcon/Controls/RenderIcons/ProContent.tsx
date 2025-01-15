import React from "react";
import { ProBlocked } from "visual/component/ProBlocked";
import { t } from "visual/utils/i18n";

interface Props {
  upgradeToPro?: string;
}

export const ProContent = ({ upgradeToPro }: Props): JSX.Element => (
  <div className="brz-ed-popup-body-pro-content">
    <ProBlocked
      text={t("Option")}
      message={t("Upgrade to PRO to use this")}
      upgradeLink={upgradeToPro ?? ""}
      upgradeText={t("Get a PRO plan")}
      needElementTitle={false}
      className="brz-ed-popup-body-pro-blocked"
    />
  </div>
);
