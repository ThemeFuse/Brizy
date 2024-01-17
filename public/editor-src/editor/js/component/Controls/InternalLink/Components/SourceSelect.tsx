import React, { FC } from "react";
import { OptionLabel } from "visual/component/OptionLabel";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { Async } from "visual/component/Options/types/dev/Select/Async";
import { t } from "visual/utils/i18n";
import { SourceSelectProps } from "./types";

export const SourceSelect: FC<SourceSelectProps> = ({
  label = t("Type"),
  helper,
  config,
  ...props
}) => (
  <OptionWrapper className="brz-ed-option-type__internalLink-select">
    <OptionLabel label={label} helper={helper} />
    <Async {...props} config={config} />
  </OptionWrapper>
);
