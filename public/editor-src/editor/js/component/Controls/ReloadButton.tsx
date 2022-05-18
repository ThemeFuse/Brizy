import React, { ReactElement } from "react";
import classNames from "classnames";
import { t } from "visual/utils/i18n";
import { WithClassName } from "visual/utils/options/attributes";
import { Button } from "./Button";

export interface Props extends WithClassName {
  onClick: VoidFunction;
}

export const ReloadButton = ({ className, onClick }: Props): ReactElement => {
  return (
    <Button
      className={classNames("brz-ed-control__reload-button", className)}
      icon={"nc-reverse"}
      label={t("Replay Animation")}
      onClick={onClick}
    />
  );
};
