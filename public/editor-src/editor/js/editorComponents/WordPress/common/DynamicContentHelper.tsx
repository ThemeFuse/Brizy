import React from "react";
import classnames from "classnames";
import { useDynamicContent } from "visual/component/DynamicContent";

type JSI = JSX.IntrinsicElements;
type Props<T extends keyof JSI, P extends JSI[T] = JSI[T]> = {
  placeholder: string;
  tagName: T;
  props?: P;
};

export function DynamicContentHelper<T extends keyof JSI>({
  placeholder,
  tagName,
  props = {}
}: Props<T>): React.ReactElement {
  const { status, data } = useDynamicContent(placeholder);
  let innerHtml = placeholder;

  if (status === "success") {
    innerHtml = String(data);
  }

  const className = classnames((props as { className?: string }).className, {
    "brz-blocked": IS_EDITOR
  });
  return React.createElement(tagName, {
    ...props,
    className,
    dangerouslySetInnerHTML: { __html: innerHtml }
  });
}
