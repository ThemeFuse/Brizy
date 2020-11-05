import React, { useEffect } from "react";
import classnames from "classnames";
import { useDynamicContent } from "visual/component/DynamicContent/useDynamicContent";
import Placeholder from "visual/component/Placeholder";

type Props<T extends keyof JSX.IntrinsicElements> = {
  placeholder: string;
  tagName: T;
  props?: JSX.IntrinsicElements[T];
  placeholderIcon: string;
  placeholderHeight: number;
  onSuccess?: (data: string) => void;
  blocked?: boolean;
};

function dataIsEmpty(data: string | null): boolean {
  return data === null || data === "";
}

export function DynamicContentHelper<T extends keyof JSX.IntrinsicElements>({
  placeholder,
  tagName,
  props,
  placeholderIcon = "wp-shortcode",
  placeholderHeight,
  onSuccess,
  blocked = IS_EDITOR
}: Props<T>): React.ReactElement {
  const state = useDynamicContent(placeholder, 2000);
  const innerHtml = state.status === "success" ? state.data : placeholder;
  const status = state.status;

  useEffect(() => {
    if (status === "success" && onSuccess) {
      onSuccess(innerHtml);
    }
  }, [status]);

  if (IS_PREVIEW || (status === "success" && !dataIsEmpty(innerHtml))) {
    const className = classnames(props?.className, {
      "brz-blocked": blocked
    });
    return React.createElement(tagName, {
      ...props,
      className: className !== "" ? className : undefined,
      dangerouslySetInnerHTML: { __html: innerHtml },
      style: { minHeight: "20px" }
    });
  } else if (status === "waiting_delay") {
    return <div style={{ height: "20px" }} />;
  } else {
    const style = placeholderHeight ? { height: placeholderHeight } : {};
    return (
      <Placeholder
        className="placeholder-is-empty"
        style={style}
        icon={placeholderIcon}
      />
    );
  }
}
