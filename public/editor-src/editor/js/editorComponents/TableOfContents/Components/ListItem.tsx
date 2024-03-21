import React from "react";
import { FCC } from "visual/utils/react/types";

interface Props {
  numberText?: string;
}

export const ListItem: FCC<Props> = ({ numberText, children }) => (
  <li className="brz-li">
    {numberText && (
      <span className="brz-toc-body__list-marker">{numberText}.</span>
    )}
    <span className="brz-toc-body__list-content">{children}</span>
  </li>
);
