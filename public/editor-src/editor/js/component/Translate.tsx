import React, {
  HTMLAttributes,
  PropsWithChildren,
  ReactElement,
  Ref,
  forwardRef
} from "react";

type TranslateTagProps = PropsWithChildren<{
  tagName?: keyof JSX.IntrinsicElements;
  className?: string;
  dangerouslySetInnerHTML?: HTMLAttributes<HTMLElement>["dangerouslySetInnerHTML"];
}>;

interface ExtendedHTMLAttributes<T> extends HTMLAttributes<T> {
  contentEditable?: boolean;
}

interface TranslateProps
  extends PropsWithChildren<TranslateTagProps>,
    ExtendedHTMLAttributes<HTMLElement> {}

export const Translate = forwardRef<HTMLElement, TranslateProps>(
  function Translate(
    {
      children,
      tagName = "div",
      className,
      dangerouslySetInnerHTML,
      contentEditable,
      ...props
    }: TranslateProps,
    ref: Ref<HTMLElement>
  ): ReactElement {
    const elementProps = {
      "data-brz-translate-text": "1",
      className,
      ref,
      contentEditable,
      ...props
    };

    if (dangerouslySetInnerHTML) {
      return React.createElement(tagName, {
        ...elementProps,
        dangerouslySetInnerHTML
      });
    }

    return React.createElement(tagName, elementProps, children);
  }
);
