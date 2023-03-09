import React, { CSSProperties, FC, MouseEvent, ReactElement } from "react";
import { IconsName } from "../types";
import { Icons } from "../utils/icons";

interface Props {
  name: IconsName;
  className?: string;
  style?: CSSProperties;
  onClick?: (e: MouseEvent<SVGElement>) => void;
}

export const Icon: FC<Props> = ({
  name,
  className,
  style,
  onClick
}): ReactElement | null => {
  const Icon = Icons[name];
  return Icon ? (
    <Icon className={className} onClick={onClick} style={style} />
  ) : null;
};

Icon.displayName = "Icon";
