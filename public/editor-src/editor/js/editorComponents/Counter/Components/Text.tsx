import React from "react";
import { FCC } from "visual/utils/react/types";

interface Props {
  prefix?: string;
  suffix?: string;
  className: string;
  prefixClassName?: string;
  suffixClassName?: string;
  ariaLabel?: string;
  role?: string;
  ariaLive?: "off" | "polite" | "assertive";
  ariaAtomic?: boolean;
}

export const Text: FCC<Props> = ({
  className,
  prefix,
  suffix,
  children,
  prefixClassName,
  suffixClassName,
  ariaLabel,
  role,
  ariaLive,
  ariaAtomic
}) => (
  <div
    className={className}
    role={role}
    aria-live={ariaLive}
    aria-atomic={ariaAtomic}
    aria-label={ariaLabel}
  >
    {prefix && <span className={prefixClassName}>{prefix}</span>}
    <span className="brz-counter-numbers">{children}</span>
    {suffix && <span className={suffixClassName}>{suffix}</span>}
  </div>
);
