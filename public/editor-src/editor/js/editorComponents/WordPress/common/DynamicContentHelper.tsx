import React, { useEffect } from "react";
import classnames from "classnames";
import { useDynamicContent } from "visual/component/DynamicContent";
import Placeholder from "visual/component/Placeholder";

type JSI = JSX.IntrinsicElements;
type Props<T extends keyof JSI, P extends JSI[T] = JSI[T]> = {
  placeholder: string;
  tagName: T;
  props?: P;
  placeholderIcon: string;
  placeholderHeight: number;
  onSuccess?: (data: string) => void;
  blocked?: boolean;
};

function dataIsEmpty(data: string | null): boolean {
  return data === null || data === "";
}

export function DynamicContentHelper<T extends keyof JSI>({
  placeholder,
  tagName,
  props = {},
  placeholderIcon = "wp-shortcode",
  placeholderHeight,
  onSuccess,
  blocked = IS_EDITOR
}: Props<T>): React.ReactElement {
  const { status, data } = useDynamicContent(placeholder, 1000);
  let innerHtml = placeholder;

  if (status === "success") {
    innerHtml = String(data ?? "");
  }

  useEffect(() => {
    if (status === "success" && onSuccess) {
      onSuccess(innerHtml);
    }
  }, [status]);

  const style = placeholderHeight ? { height: placeholderHeight } : {};

  if (IS_PREVIEW || (IS_EDITOR && status === "success" && !dataIsEmpty(data))) {
    const className = classnames((props as { className?: string }).className, {
      "brz-blocked": blocked
    });
    return React.createElement(tagName, {
      ...props,
      className: className !== "" ? className : undefined,
      dangerouslySetInnerHTML: { __html: innerHtml }
    });
  } else if (IS_EDITOR && status === "idle") {
    return <span />;
  } else {
    return (
      <Placeholder
        className="placeholder-is-empty"
        style={style}
        icon={placeholderIcon}
      />
    );
  }
}
