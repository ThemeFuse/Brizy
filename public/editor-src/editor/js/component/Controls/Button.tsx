import classNames from "classnames";
import React, { MouseEvent, ReactElement, ReactNode } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { WithClassName } from "visual/types/attributes";

export interface Props extends WithClassName {
  onClick: (event: MouseEvent<HTMLDivElement>) => void;
  reverse?: boolean;
  children?: ReactNode;
  icon?: string;
  align?: "left" | "center" | "right";
  reverseTheme?: boolean;
  title?: string;
}

export const Button = ({
  className,
  onClick,
  icon,
  children,
  reverse,
  align = "center",
  reverseTheme = false,
  title
}: Props): ReactElement | null => {
  return children || icon ? (
    <div
      className={classNames(
        "brz-ed-control__button",
        `brz-ed-control__button-${align}`,
        className,

        {
          reverse: !!reverse,
          reverseTheme: !!reverseTheme
        }
      )}
      onClick={onClick}
      title={title}
    >
      {icon && <EditorIcon icon={icon} />}
      {children && <span className={"brz-ed-control__label"}>{children}</span>}
    </div>
  ) : null;
};
