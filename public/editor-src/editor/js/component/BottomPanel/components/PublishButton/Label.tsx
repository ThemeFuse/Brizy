import React, { ReactElement } from "react";
import Tooltip, { TooltipItem } from "visual/component/Controls/Tooltip";
import { ReduxState } from "visual/redux/types";
import { t } from "visual/utils/i18n";

type status = ReduxState["page"]["status"];

interface Props {
  status: status;
  children: ReactElement;
}

export const Label = ({ status, children }: Props) => {
  if (status === "draft") {
    const overlay = (
      <TooltipItem className="brz-ed-tooltip__overlay-publish-button--draft__item">
        {t(
          "This page is currently a Draft. To enable it on your website, choose Publish after clicking the Up Arrow button."
        )}
      </TooltipItem>
    );

    return (
      <Tooltip
        overlayClassName="brz-ed-tooltip__overlay-publish-button--draft"
        openOnClick={false}
        inPortal={true}
        closeDelay={600}
        overlay={overlay}
        placement="top-end"
      >
        {children}
      </Tooltip>
    );
  } else {
    return children;
  }
};
