import classnames from "classnames";
import React, { ReactElement } from "react";

export interface Props {
  title: string;
  boxed?: boolean;
}

export const Title = ({ title, boxed }: Props): ReactElement => {
  const className = classnames("brz-ed-popup-two__select-title", {
    "brz-ed-popup-two__select-title--boxed": boxed
  });

  return (
    <span title={title} className={className}>
      {title}
    </span>
  );
};
