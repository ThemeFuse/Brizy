import classnames from "classnames";
import React, { useMemo } from "react";
import { FCC } from "visual/utils/react/types";
import { CustomIconProps as Props } from "./types";

export const CustomIcon: FCC<Props> = ({ src, className, ariaLabel }) => {
  const _className = classnames("brz-icon-svg-custom", className);

  const style = useMemo(
    () => ({
      mask: `url(${src}) no-repeat center / contain`
    }),
    [src]
  );

  return (
    <div
      className={_className}
      style={style}
      role="img"
      {...(ariaLabel && { "aria-label": ariaLabel })}
    />
  );
};
