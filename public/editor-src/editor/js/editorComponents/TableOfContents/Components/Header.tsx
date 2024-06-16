import React, { ReactElement, ReactNode, forwardRef } from "react";

interface Props {
  icon?: ReactElement;
  onClick: VoidFunction;
  children: ReactNode;
}

export const Header = forwardRef<HTMLDivElement, Props>(
  ({ icon, onClick, children }, ref) => (
    <div className="brz-toc-header" onClick={onClick} ref={ref}>
      {children}
      {icon && <span className="brz-toc-icon-wrapper">{icon}</span>}
    </div>
  )
);
