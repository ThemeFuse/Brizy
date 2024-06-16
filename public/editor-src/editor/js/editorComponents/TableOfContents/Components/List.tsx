import classnames from "classnames";
import { createElement } from "react";
import { FCC } from "visual/utils/react/types";

interface Props {
  tag: "ol" | "ul";
}

export const List: FCC<Props> = ({ tag, children }) => {
  const isMarkerNumbers = tag === "ol";

  const className = classnames("brz-toc-body__list", {
    "brz-toc-body__list-numbers": isMarkerNumbers
  });

  return createElement(tag, { className }, children);
};
