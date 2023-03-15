import React, { FC, ReactElement } from "react";

export const FatIconsGrid: FC = ({ children }): ReactElement => {
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
