import classNames from "classnames";
import React, { ReactElement, ReactNode } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { WithClassName } from "visual/utils/options/attributes";

export interface Props extends WithClassName {
  onClick: VoidFunction;
  reverse?: boolean;
  children?: ReactNode;
  icon?: string;
  align?: "left" | "center" | "right";
}

export const Button = ({
  className,
  onClick,
  icon,
  children,
  reverse,
  align = "center"
}: Props): ReactElement | null => {
  return children || icon ? (
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
      <span className={"brz-ed-control__label"}>{children}</span>
    </div>
  ) : null;
};
