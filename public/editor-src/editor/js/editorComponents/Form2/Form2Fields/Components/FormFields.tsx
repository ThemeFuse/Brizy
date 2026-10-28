import React, { type CSSProperties } from "react";
import type { FCC } from "visual/utils/react/types";

interface Props {
  style?: CSSProperties;
}

export const FormFields: FCC<Props> = ({ style, children }) => (
  <div className="brz-form-ms-content-item" style={style}>
    {children}
  </div>
);
