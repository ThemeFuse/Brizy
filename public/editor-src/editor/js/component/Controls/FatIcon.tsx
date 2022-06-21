import React, { ReactElement } from "react";
import classNames from "classnames";
import { WithClassName } from "visual/utils/options/attributes";
import { EditorIcon } from "visual/component/EditorIcon";

export interface Props extends WithClassName {
  icon: string;
  label: string;
  onClick?: VoidFunction;
  active?: boolean;
}

export const FatIcon = ({
  active,
  className,
  icon,
  label,
  onClick
}: Props): ReactElement => {
  return (
    <div
      className={classNames(className, "brz-ed--fat-icon", {
        "brz-ed--fat-icon__active": !!active
      })}
      onClick={onClick}
    >
      <div className={"brz-ed--fat-icon__wrapper"}>
        <EditorIcon icon={icon} />
      </div>
      <div className={"brz-ed--fat-icon__label"}>{label}</div>
    </div>
  );
};
