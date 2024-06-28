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
  if (status === "draft" || status === "future") {
    const message =
      status === "draft"
        ? t(
            "This page is currently a Draft. To enable it on your website, choose Publish after clicking the Up Arrow button."
          )
        : t(
            "This page is currently set to Scheduled. If you want to publish it now, please change the status from the page settings."
          );

    const overlay = (
      <TooltipItem className="brz-ed-tooltip__overlay-publish-button--draft__item">
        {message}
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
