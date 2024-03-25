import React, { ComponentProps } from "react";
import classNames from "classnames";

type Props = ComponentProps<"div"> & {
  content?: string;
};

export const Html = ({ className, content, ...props }: Props): JSX.Element => {
  const _className = classNames(
    "brz-ed-popover__tooltip--icon-custom",
    className
  );
  return (
    <div
      {...props}
      className={_className}
      dangerouslySetInnerHTML={{ __html: content ?? "" }}
    />
  );
};
