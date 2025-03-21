import cn from "classnames";
import React, { HTMLAttributes, ReactElement, forwardRef } from "react";
import {
  makeEndPlaceholder,
  makeStartPlaceholder
} from "visual/utils/dynamicContent";

interface Props {
  className?: string;
  id?: string;
  wrapInPlaceholder?: boolean;
  attr?: HTMLAttributes<HTMLElement>;
  children: ReactElement;
}

export const NavContainer = forwardRef<HTMLElement, Props>((props, ref) => {
  const {
    id,
    attr,
    className: _className,
    wrapInPlaceholder,
    children
  } = props;
  const className = cn("brz-menu", attr?.className, _className);

  const content = (
    <nav {...attr} id={id} className={className} ref={ref}>
      {children}
    </nav>
  );

  if (wrapInPlaceholder) {
    const startPlaceholder = makeStartPlaceholder({
      content: "{{ group }}"
    });
    const endPlaceholder = makeEndPlaceholder({
      content: "{{ end_group }}"
    });

    return (
      <>
        {startPlaceholder}
        {content}
        {endPlaceholder}
      </>
    );
  }

  return content;
});
