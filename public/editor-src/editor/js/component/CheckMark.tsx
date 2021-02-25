import React, { MouseEventHandler, ReactElement } from "react";
import EditorIcon from "visual/component/EditorIcon";
import classNames from "classnames";
import { WithClassName } from "visual/utils/options/attributes";

export interface Props extends WithClassName {
  checked: boolean;
  onClick?: MouseEventHandler;
}

export const CheckMark = ({
  checked,
  onClick,
  className
}: Props): ReactElement => {
  return (
    <span
      className={classNames("brz-ed--check-mark", className, { checked })}
      onClick={onClick}
    >
      <EditorIcon icon="nc-check-circle" />
    </span>
  );
};
