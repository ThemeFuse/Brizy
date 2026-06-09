import classNames from "classnames";
import React, { ReactElement } from "react";
import { EditorIcon } from "visual/component/EditorIcon";
import { WithClassName } from "visual/types/attributes";

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
      title={label}
      className={classNames(className, "brz-ed--fat-icon", {
        "brz-ed--fat-icon__active": !!active
      })}
      onClick={onClick}
    >
      <div className="brz-ed--fat-icon__wrapper">
        <EditorIcon icon={icon} />
      </div>
      <div className="brz-ed--fat-icon__label">{label}</div>
    </div>
  );
};
