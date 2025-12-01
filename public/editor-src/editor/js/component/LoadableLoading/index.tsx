import { createElement } from "react";
import { Skeleton } from "visual/component/Skeleton";

const style = {
  width: "100%"
};
const skeletonStyle = {
  height: "65px"
};

export const LoadableLoading = createElement(
  "div",
  { style },
  createElement(Skeleton, { key: "1", style: skeletonStyle })
);
