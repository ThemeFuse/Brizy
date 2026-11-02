import classNames from "classnames";
import React, { type ReactElement } from "react";
import type { WithClassName, WithOnChange } from "visual/types/attributes";
import type { Literal } from "visual/utils/types/Literal";
import type { Props as ItemProps } from "./Item";

export type Props<T extends Literal> = WithOnChange<T> &
  WithClassName & {
    children: ReactElement<ItemProps<T>>[];
  };

export function RadioGroup2<T extends Literal>({
  children,
  onChange,
  className
}: Props<T>): ReactElement<Props<T>> {
  const _className = classNames("brz-ed-control__radio-group2", className);

  return (
    <div className={_className}>
      {children.map((item) => {
        const _className = classNames("brz-ed-control__radio-group2__item", {
          "brz-ed-control__radio-group2__item--active": item.props.active
        });

        const { title, value } = item.props;

        return (
          <div
            className={_className}
            key={value}
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
