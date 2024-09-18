import { Str } from "@brizy/readers";
import React from "react";
import { ThemeIcon } from "visual/component/ThemeIcon";
import type { FCC } from "visual/utils/react/types";

interface Props {
  iconName: string;
  iconType: string;
  buttonType: "button" | "submit";
}

export const Button: FCC<Props> = ({
  iconName,
  iconType,
  buttonType,
  children
}) => {
  const _iconName = Str.read(iconName);
  const _iconType = Str.read(iconType);

  return (
    <button type={buttonType} className="brz-paypal-button">
      <span className="brz-paypal-icon-parent">
        {_iconName && _iconType && (
          <ThemeIcon
            className="brz-paypal-icon"
            name={_iconName}
            type={_iconType}
          />
        )}
      </span>
      {children}
    </button>
  );
};
