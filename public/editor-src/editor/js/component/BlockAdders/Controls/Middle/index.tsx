import classnames from "classnames";
import React, { ReactElement } from "react";

export interface Props {
  className?: string;
  onClick?: VoidFunction;
}

export const Middle = (props: Props): ReactElement => {
  const { className: cls, onClick } = props;
  const className = classnames("brz-ed-container-plus", cls);

  return (
    <div className={className}>
      <div
        className="brz-ed-container-trigger brz-ed-container-trigger--small"
        onClick={onClick}
      />
    </div>
  );
};
