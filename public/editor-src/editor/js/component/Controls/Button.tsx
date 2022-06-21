import React, { ReactElement } from "react";
import classNames from "classnames";
import { WithClassName } from "visual/utils/options/attributes";
import EditorIcon from "visual/component/EditorIcon";

export interface Props extends WithClassName {
  onClick: VoidFunction;
  reverse?: boolean;
  label?: string;
  icon?: string;
  align?: "left" | "center" | "right";
}

export const Button = ({
  className,
  onClick,
  icon,
  label,
  reverse,
  align = "center"
}: Props): ReactElement | null => {
  return label || icon ? (
    <div
      className={classNames(
        "brz-ed-control__button",
        `brz-ed-control__button-${align}`,
        className,
        {
          reverse: !!reverse
        }
      )}
      onClick={onClick}
    >
      {icon && <EditorIcon icon={icon} />}
      <span className={"brz-ed-control__label"}>{label}</span>
    </div>
  ) : null;
};
