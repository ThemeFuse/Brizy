import React, { ReactElement } from "react";
import { t } from "visual/utils/i18n";

export const Info = (): ReactElement => {
  return (
    <div className="brz-ed-tooltip-content__pro">
      <p className="brz-p brz-ed-tooltip-content__pro-title">
        {t("You can't add it again")}
      </p>
    </div>
  );
};
