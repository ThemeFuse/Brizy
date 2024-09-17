import React from "react";
import { ProBlocked } from "visual/component/ProBlocked";
import { t } from "visual/utils/i18n";

export const ProContent = (): JSX.Element => (
  <div className="brz-ed-popup-body-pro-content">
    <ProBlocked
      text={t("Option")}
      needElementTitle={false}
      className="brz-ed-popup-body-pro-blocked"
    />
  </div>
);
