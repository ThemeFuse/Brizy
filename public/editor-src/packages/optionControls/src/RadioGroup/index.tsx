import classNames from "classnames";
import React, { FC, ReactElement, useCallback } from "react";
import { Props } from "./types";

export const RadioGroup: FC<Props> = ({
  children,
  onChange,
  className,
  value
}): ReactElement => {
  const _className = classNames("brz-ed-control__radio-group2", className);
  const handleClick = useCallback(
    (value: string): void => onChange(value),
    [onChange]
  );
  return (
    <div className={_className}>
      {children.map((item, i) => {
        const _className = classNames("brz-ed-control__radio-group2__item", {
          ["brz-ed-control__radio-group2__item--active"]:
            value === item.props.value
        });

        return (
          <div
            className={_className}
            key={i}
            onClick={() => handleClick(item.props.value)}
            title={item.props.title}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
};
