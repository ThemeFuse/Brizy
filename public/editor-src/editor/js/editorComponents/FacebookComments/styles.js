import classnames from "classnames";

export function styleClassName(v) {
  const { className } = v;

  return classnames("brz-fb-comments", className);
}
