import Loadable from "@loadable/component";
import classnames from "classnames";
import React, { CSSProperties, FC, MouseEvent, ReactElement } from "react";
import { IconsName } from "./types";

const LoadableIcon = Loadable(async () => {
  const { Icon } = await import("./components/Icon");
  return Icon;
});
export interface Props {
  className?: string;
  icon: IconsName;
  style?: CSSProperties;
  onClick?: (e: MouseEvent<SVGElement>) => void;
}

export const EditorIcon: FC<Props> = ({
  className,
  icon,
  style,
  onClick
}): ReactElement => {
  const _className = classnames(
    "brz-icon-svg brz-ed-icon-svg align-[initial]",
    className
  );

  return (
    <LoadableIcon
      name={icon}
      className={_className}
      style={style}
      onClick={onClick}
    />
  );
};
