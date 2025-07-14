import classnames from "classnames";
import React, { ReactElement } from "react";
import RoundPlus from "visual/component/RoundPlus";
import { makeBzelmAttr } from "visual/utils/i18n/attribute";

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
      <div
        className="brz-ed-wrap-block-empty-page"
        onClick={onClick}
        {...makeBzelmAttr("start-building-page")}
      >
        <div className="brz-ed-wrap-block-empty-page-heading">{title}</div>
        <RoundPlus className={iconClassName} icon={icon} />
        <div className="brz-ed-wrap-block-empty-page-heading2">
          {description}
        </div>
      </div>
    </div>
  );
};
