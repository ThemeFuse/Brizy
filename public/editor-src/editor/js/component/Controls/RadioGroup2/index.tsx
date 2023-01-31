import classNames from "classnames";
import React, { ReactElement } from "react";
import { WithClassName, WithOnChange } from "visual/utils/options/attributes";
import { Props as ItemProps } from "./Item";

type Props<T> = WithOnChange<T> &
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
          "brz-ed-control__radio-group2__item flex m-0 flex w-[37px] h-[30px] border-t-0 border-r border-b-0 border-l-0 border-solid border-r-control-color bg-inkblot text-white overflow-hidden items-center justify-center text-[16px] cursor-pointer transition-[background-color] duration-200 ease-linear delay-[0s] first:rounded-tl-[4px] first:rounded-bl-[4px] last:border-r-0 last:rounded-tr-[4px] last:rounded-br-[4px]",
          {
            ["brz-ed-control__radio-group2__item--active flex m-0 bg-brand-primary"]:
              item.props.active
          }
        );

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
