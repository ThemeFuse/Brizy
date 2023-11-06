import React, { ComponentProps, JSXElementConstructor } from "react";
import Placeholder from "visual/component/Placeholder";
import { useDC } from "visual/editorComponents/EditorComponent/DynamicContent/useDC";

interface Props<
  P,
  T extends JSXElementConstructor<P> = JSXElementConstructor<P>
> {
  Component: T;
  placeholder: string;
  componentProps: ComponentProps<T> | undefined;
  placeholderIcon?: string;
}

export const DCWrapper = <P extends Record<string, unknown>>(
  props: Props<P>
) => {
  const {
    placeholder,
    Component,
    componentProps,
    placeholderIcon = "wp-shortcode"
  } = props;
  const res = useDC(placeholder);
  const data = res.status === "success" ? res.data : null;

  return data ? (
    // @ts-expect-error could be instantiated with an arbitrary type which could be unrelated to { children: string; }
    <Component {...componentProps}>{data}</Component>
  ) : (
    <Placeholder icon={placeholderIcon} style={{ height: "40px" }} />
  );
};
