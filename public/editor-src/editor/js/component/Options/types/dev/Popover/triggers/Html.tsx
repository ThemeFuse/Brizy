import React, { ComponentProps, FC } from "react";
import classNames from "classnames";

type Props = ComponentProps<"div"> & {
  content?: string;
};

export const Html: FC<Props> = ({ className, content, ...props }) => {
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
