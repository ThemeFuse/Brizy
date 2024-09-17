import React, { JSX } from "react";
import { Tooltip } from "visual/component/Controls/Tooltip";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";
import { Description as DescriptionProps } from "./types";

export const Description = ({ children }: DescriptionProps): JSX.Element => (
  <div className="brz-ed-popup-common__confirmation">
    <div className="brz-label">
      {t("Allow us to connect to your Adobe")}
      <br className="brz-br" />
      {t("account via API access ")}
      <div className="brz-ed-option__helper">
        <Tooltip
          openOnClick={false}
          overlay={
            <div className="brz-ed-option__helper__content">{children}</div>
          }
        >
          <EditorIcon
            className="brz-ed-option__helper--center"
            icon="nc-alert-circle-que"
          />
        </Tooltip>
      </div>
    </div>
  </div>
);
