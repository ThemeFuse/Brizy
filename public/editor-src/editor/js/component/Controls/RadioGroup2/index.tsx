import classNames from "classnames";
import React, { ReactElement } from "react";
import { WithClassName, WithOnChange } from "visual/types/attributes";
import { Props as ItemProps } from "./Item";

export type Props<T> = WithOnChange<T> &
  WithClassName & {
    children: ReactElement<ItemProps<T>>[];
  };

export function RadioGroup2<T>({
  children,
  onChange,
  className
}: Props<T>): ReactElement<Props<T>> {
  const _className = classNames("brz-ed-control__radio-group2", className);

  return (
    <div className={_className}>
      {children.map((item, i) => {
        const _className = classNames("brz-ed-control__radio-group2__item", {
          "brz-ed-control__radio-group2__item--active": item.props.active
        });

        const { title, value } = item.props;

        return (
          <div
            className={_className}
            key={i}
            onClick={(): void => onChange(value)}
            title={title}
            data-value={value}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
}
