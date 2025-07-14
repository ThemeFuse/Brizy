import classnames from "classnames";
import React, { ReactElement } from "react";
import RoundPlus from "visual/component/RoundPlus";
import { t } from "visual/utils/i18n";
import { makeBzelmAttr } from "visual/utils/i18n/attribute";

export interface Props {
  className?: string;
  onClick?: VoidFunction;
}

export const Last = (props: Props): ReactElement => {
  const { className: cls, onClick } = props;
  const className = classnames("brz-ed-container-adder", cls);

  return (
    <div className={className} {...makeBzelmAttr("add-block-rectangle")}>
      <span className="brz-span brz-ed-block-adder-title">
        {t("Add a new block")}
      </span>
      <RoundPlus onClick={onClick} />
      <span className="brz-span brz-ed-block-adder-desc">
        {t("Press the button to add blocks")}
      </span>
    </div>
  );
};
