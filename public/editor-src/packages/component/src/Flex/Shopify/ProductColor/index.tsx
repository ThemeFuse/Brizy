import classnames from "classnames";
import React, { ReactElement } from "react";
import { Props } from "./types";

export const ProductColors = ({
  className,
  color,
  colors,
  onChange
}: Props): ReactElement => {
  const inputClassname = classnames(`w-[50px] h-[50px]`, className);

  return (
    <div className="brz-product__variant-color">
      <legend className="mb-[20px]"> Colors:</legend>
      <div className="flex">
        {colors?.map((el, index) => {
          return (
            <input
              className={inputClassname}
              key={index}
              type="radio"
              name="color"
              style={{ accentColor: el.color }}
              checked={color === el.color}
              onChange={onChange}
            />
          );
        })}
      </div>
    </div>
  );
};
