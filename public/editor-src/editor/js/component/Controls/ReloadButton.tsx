import classNames from "classnames";
import React, { ReactElement } from "react";
import { WithClassName } from "visual/types/attributes";
import { t } from "visual/utils/i18n";
import { Button } from "./Button";

export interface Props extends WithClassName {
  onClick: VoidFunction;
}

export const ReloadButton = ({ className, onClick }: Props): ReactElement => {
  return (
    <Button
      className={classNames("brz-ed-control__reload-button", className)}
      icon={"nc-reverse"}
      onClick={onClick}
    >
      {t("Replay Animation")}
    </Button>
  );
};
