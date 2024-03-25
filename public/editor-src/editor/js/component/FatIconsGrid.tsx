import React, { ReactElement } from "react";
import { FCC } from "visual/utils/react/types";

export const FatIconsGrid: FCC = ({ children }): ReactElement => {
  return (
    <div
      className={
        "brz-ed--fat-icons-grid grid grid-cols-[auto_auto_auto] gap-[12px_20px]"
      }
    >
      {children}
    </div>
  );
};
