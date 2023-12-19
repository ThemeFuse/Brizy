import classnames from "classnames";
import React, { ReactElement } from "react";
import RoundPlus from "visual/component/RoundPlus";

export interface Props {
  title: string;
  description: string;
  onClick: VoidFunction;
  icon?: string;
  className?: string;
  iconClassName?: string;
}

export const First = (props: Props): ReactElement => {
  const {
    title,
    description,
    icon,
    className: cls,
    iconClassName,
    onClick
  } = props;
  const className = classnames(
    "brz-ed-wrap-block-wrap brz-ed-wrap-block-wrap--first",
    cls
  );

  return (
    <div className={className}>
      <div className="brz-ed-wrap-block-empty-page" onClick={onClick}>
        <div className="brz-ed-wrap-block-empty-page-heading">{title}</div>
        <RoundPlus className={iconClassName} icon={icon} />
        <div className="brz-ed-wrap-block-empty-page-heading2">
          {description}
        </div>
      </div>
    </div>
  );
};
