import classNames from "classnames";
import React from "react";
import { useSelector } from "react-redux";
import { ConditionsComponent } from "visual/component/ConditionsComponent";
import { globalBlocksSelector } from "visual/redux/selectors";
import { t } from "visual/utils/i18n";
import { Props } from "./types";

export const GbCondition = ({
  className: _className = "",
  context,
  config,
  attr: _attr = {}
}: Props) => {
  const { className: attrClassName, ...rest } = _attr;

  const className = classNames(
    "brz-ed-option__popup_conditions",
    _className,
    attrClassName
  );

  const globalBlocks = useSelector(globalBlocksSelector);
  const { globalBlockId } = config;
  const { rules = [] } = globalBlocks[globalBlockId] ?? {};

  return (
    <ConditionsComponent context={context} value={globalBlockId}>
      <div className={className} {...rest}>
        <span className="brz-ed-option__popup_conditions-count">
          {rules.length}
        </span>
        {t("Display Conditions")}
      </div>
    </ConditionsComponent>
  );
};
