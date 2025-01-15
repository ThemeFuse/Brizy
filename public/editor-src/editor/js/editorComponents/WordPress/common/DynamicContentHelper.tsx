import classnames from "classnames";
import React, { ReactElement, useEffect } from "react";
import Placeholder from "visual/component/Placeholder";
import { useDC } from "visual/editorComponents/EditorComponent/DynamicContent/useDC";
import { isEditor, isView, useRender } from "visual/providers/RenderProvider";

type Props<T extends keyof JSX.IntrinsicElements> = {
  placeholder: string;
  tagName: T;
  props?: JSX.IntrinsicElements[T];
  placeholderIcon?: string;
  placeholderHeight?: number;
  onSuccess?: (data: string) => void;
  blocked?: boolean;
  fallbackComponent?: ReactElement;
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
  blocked: _blocked,
  fallbackComponent
}: Props<T>): ReactElement {
  const state = useDC(placeholder);
  const innerHtml = state.status === "success" ? state.data : placeholder;
  const status = state.status;
  const { renderType } = useRender();

  const blocked = _blocked !== undefined ? _blocked : isEditor(renderType);

  useEffect(() => {
    if (status === "success" && onSuccess) {
      onSuccess(innerHtml);
    }
  }, [status, innerHtml, onSuccess]);

  if (isView(renderType) || (status === "success" && !dataIsEmpty(innerHtml))) {
    const className = classnames(props?.className, { "brz-blocked": blocked });
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
      fallbackComponent ?? (
        <Placeholder
          className="placeholder-is-empty"
          style={style}
          icon={placeholderIcon}
        />
      )
    );
  }
}
