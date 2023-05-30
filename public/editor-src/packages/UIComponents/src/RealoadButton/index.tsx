import classNames from "classnames";
import React, { FC } from "react";
import { Button } from "../Button";
import { IconsName } from "../EditorIcon/types";
import { Props } from "./types";

export const ReloadButton: FC<Props> = ({ className, onClick, children }) => {
  const _className = classNames("brz-ed-control__reload-button", className);
  return (
    <Button className={_className} icon={IconsName.Reverse} onClick={onClick}>
      {children}
    </Button>
  );
};
