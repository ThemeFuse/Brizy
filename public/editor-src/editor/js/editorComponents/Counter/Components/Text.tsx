import React from "react";
import { FCC } from "visual/utils/react/types";

interface Props {
  prefix?: string;
  suffix?: string;
  className: string;
  prefixClassName?: string;
  suffixClassName?: string;
}

export const Text: FCC<Props> = ({
  className,
  prefix,
  suffix,
  children,
  prefixClassName,
  suffixClassName
}) => (
  <div className={className}>
    {prefix && <span className={prefixClassName}>{prefix}</span>}
    <span className="brz-counter-numbers">{children}</span>
    {suffix && <span className={suffixClassName}>{suffix}</span>}
  </div>
);
