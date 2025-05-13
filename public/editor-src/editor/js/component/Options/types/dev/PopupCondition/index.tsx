import classNames from "classnames";
import React from "react";
import { ConditionsComponent } from "visual/component/ConditionsComponent";
import { useConfig } from "visual/providers/ConfigProvider";
import { t } from "visual/utils/i18n";
import { Props } from "./types";
import { useConditions } from "./utils";

export const PopupCondition = ({
  className: _className,
  attr: _attr = {}
}: Props) => {
  const config = useConfig();
  const { className: attrClassName, ...rest } = _attr;
  const className = classNames(
    "brz-ed-option__popup_conditions",
    _className,
    attrClassName
  );

  return (
    <ConditionsComponent context="popup" value={""}>
      <div className={className} {...rest}>
        <span className="brz-ed-option__popup_conditions-count">
          {useConditions({
            config
          })}
        </span>
        {t("Display Conditions")}
      </div>
    </ConditionsComponent>
  );
};
