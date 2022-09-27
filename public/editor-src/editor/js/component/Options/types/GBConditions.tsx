import classNames from "classnames";
import React from "react";
import _ from "underscore";
import { ConditionsComponent } from "visual/component/ConditionsComponent";
import { globalBlocksSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { t } from "visual/utils/i18n";

interface Props {
  context: "block" | "popup";
  value: string;
  className?: string;
  attr?: React.HTMLAttributes<HTMLDivElement>;
}

const GbConditionsOptionType: React.FC<Props> = ({
  className: _className = "",
  value,
  context,
  attr: _attr = {}
}) => {
  const className = classNames(
    "brz-ed-option__popup_conditions",
    _className,
    _attr.className
  );
  const attr = _.omit(_attr, "className");

  const state = getStore().getState();
  const globalBlocks = globalBlocksSelector(state);
  const { rules } = globalBlocks[value];

  return (
    <ConditionsComponent context={context} value={value}>
      <div className={className} {...attr}>
        <span className="brz-ed-option__popup_conditions-count">
          {rules.length}
        </span>
        {t(" Display Conditions")}
      </div>
    </ConditionsComponent>
  );
};

export default GbConditionsOptionType;
