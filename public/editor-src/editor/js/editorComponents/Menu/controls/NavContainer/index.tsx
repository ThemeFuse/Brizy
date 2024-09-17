import React, { HTMLAttributes } from "react";
import { FCC } from "visual/utils/react/types";
import {
  makeEndPlaceholder,
  makeStartPlaceholder
} from "visual/utils/dynamicContent";
import cn from "classnames";

interface Props {
  className?: string;
  id?: string;
  wrapInPlaceholder?: boolean;
  attr?: HTMLAttributes<HTMLElement>;
}

export const NavContainer: FCC<Props> = (props) => {
  const {
    id,
    attr,
    className: _className,
    wrapInPlaceholder,
    children
  } = props;
  const className = cn("brz-menu", attr?.className, _className);

  const content = (
    <nav {...attr} id={id} className={className}>
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
};
