import classnames from "classnames";
import React, { forwardRef, useCallback } from "react";
import { Change, OptionProps, Props } from "./types";

export const CheckGroup = forwardRef<HTMLDivElement, Props>(
  ({ className, defaultValue, children, onChange }, ref): JSX.Element => {
    const _className = classnames("brz-control__check-group", className);

    const handleChange = useCallback(
      ({ key, value }: Change) => {
        if (onChange) {
          onChange({
            ...defaultValue,
            ...(key && { [key]: !value }),
            value: !value
          });
        }
      },
      [defaultValue, onChange]
    );

    const options = React.Children.map(
      children,
      (child: JSX.Element, index: number) => {
        const { value, disabled } = child.props;

        const isActive = Boolean(defaultValue?.[value]);

        const updatedProps: OptionProps = {
          ...child.props,
          key: index,
          active: isActive,
          onClick: disabled
            ? null
            : () => handleChange({ key: value, value: isActive })
        };

        return React.cloneElement(child, updatedProps);
      }
    );

    const keys = Object.keys(defaultValue ?? {}).filter(
      (k) => defaultValue?.[k]
    );
    const toValueStr = keys.length > 0 ? keys.join(",") : "";

    return (
      <div className={_className} ref={ref} data-value={toValueStr}>
        {options}
      </div>
    );
  }
);
