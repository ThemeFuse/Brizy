import classNames from "classnames";
import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { IconToggle } from "visual/component/Controls/IconToggle";
import { IconToggleItem } from "visual/component/Controls/IconToggle/IconToggleItem";
import { getCurrentTooltip } from "visual/component/Controls/Tooltip";
import { showHiddenElementsSelector } from "visual/redux/selectors";
import { Toggle } from "visual/utils/options/utils/Type";
import { Literal } from "visual/utils/types/Literal";
import { Props } from "./types";
import { isNonEmptyArray } from "./utils";

export const ShowOnDevice = ({
  className,
  choices,
  value: { value },
  onChange,
  closeTooltip = true
}: Props) => {
  const showHiddenElements = useSelector(showHiddenElementsSelector);
  const _className = classNames("brz-ed-option__toggle", className);

  const handleChange = useCallback(
    (v: Literal) => {
      if (v === Toggle.OFF && closeTooltip && !showHiddenElements) {
        const tooltip = getCurrentTooltip();

        if (tooltip) {
          tooltip.close();
        }
      }
      onChange({ value: v });
    },
    [closeTooltip, showHiddenElements, onChange]
  );

  const items = choices.map(({ icon, value, title }, i) => (
    <IconToggleItem<Literal> key={i} value={value} icon={icon} title={title} />
  ));

  return isNonEmptyArray(items) ? (
    <IconToggle<Literal>
      value={value}
      onChange={handleChange}
      className={_className}
    >
      {items}
    </IconToggle>
  ) : null;
};
