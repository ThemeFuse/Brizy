import React, { ReactElement } from "react";
import classNames from "classnames";
import { Props as ItemProps } from "./Item";
import { WithClassName, WithOnChange } from "visual/utils/options/attributes";

type Props<T> = WithOnChange<T> &
  WithClassName & {
    children: ReactElement<ItemProps<T>>[];
  };

export function RadioGroup2<T>({
  children,
  onChange,
  className
}: Props<T>): ReactElement<Props<T>> {
  const base = "brz-ed-control__radio-group2";
  const _className = classNames(base, className);
  return (
    <div className={_className}>
      {children.map((item, i) => {
        const _className = classNames(`${base}__item`, {
          [`${base}__item--active`]: item.props.active
        });
        return (
          <div
            className={_className}
            key={i}
            onClick={(): void => onChange(item.props.value)}
            title={item.props.title}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
}
