import classnames from "classnames";
import React, { ReactElement } from "react";
import { PropsSize } from "./types";

export const Size = ({
  value,
  disabled,
  isActive,
  onClick
}: PropsSize): ReactElement => {
  const className = classnames("brz-shopify-product__grid-item", {
    "brz-shopify-product__grid-item--selected": isActive,
    "brz-shopify-product__grid-item--disabled": disabled
  });

  return (
    <span className={className} onClick={onClick}>
      {value}
    </span>
  );
};
