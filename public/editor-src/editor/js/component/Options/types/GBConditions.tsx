import React from "react";
import _ from "underscore";
import classNames from "classnames";
import { ConditionsComponent } from "visual/component/ConditionsComponent";
import { t } from "visual/utils/i18n";
import { getStore } from "visual/redux/store";
import { globalBlocksSelector } from "visual/redux/selectors";

interface Props {
  value: string;
  className?: string;
  attr?: React.HTMLAttributes<HTMLDivElement>;
}

const GbConditionsOptionType: React.FC<Props> = ({
  className: _className = "",
  value,
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
    <ConditionsComponent value={value}>
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
