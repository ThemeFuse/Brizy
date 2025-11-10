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
  const _className = classNames(
    "brz-ed-control__radio-group2 flex m-0",
    className
  );

  return (
    <div className={_className}>
      {children.map((item, i) => {
        const _className = classNames(
          "brz-ed-control__radio-group2__item flex m-0 flex w-[37px] h-[30px] border-t-0 border-r border-b-0 border-l-0 border-solid border-r-control-color bg-option-content-bg text-option-content-color overflow-hidden items-center justify-center text-[16px] cursor-pointer transition-[background-color] duration-200 ease-linear delay-[0s] first:rounded-s-[4px]  last:border-e-0 last:rounded-e-[4px] last:rounded-e-[4px] ",
          {
            ["brz-ed-control__radio-group2__item--active flex m-0 !bg-brand-primary"]:
              item.props.active
          }
        );

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
