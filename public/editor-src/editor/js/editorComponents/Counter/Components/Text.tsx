import React from "react";
import { FCC } from "visual/utils/react/types";

interface Props {
  prefix?: string;
  suffix?: string;
  className: string;
}

export const Text: FCC<Props> = ({ className, prefix, suffix, children }) => (
  <div className={className}>
    {prefix && <span>{prefix}</span>}
    <span className="brz-counter-numbers">{children}</span>
    {suffix && <span>{suffix}</span>}
  </div>
);
