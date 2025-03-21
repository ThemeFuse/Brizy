import React, {
  Children,
  ReactElement,
  RefObject,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef
} from "react";
import { useRender } from "visual/providers/RenderProvider";
import {
  makeAttr,
  makeDataAttr,
  makeDataAttrString
} from "visual/utils/i18n/attribute";

const styles: Record<string, string> = {};

function toCSS(stylesObj: Record<string, string>) {
  return Object.entries(stylesObj).reduce((acc, [key, value]) => {
    acc += value.replace(
      /element/g,
      makeDataAttrString({ name: "custom-id", value: key })
    );
    return acc;
  }, "");
}

interface ArgsProps extends Record<string, unknown> {
  ref: RefObject<HTMLDivElement>;
}

interface Props extends Record<string, unknown> {
  selectorName?: string;
  css?: string;
  children: ReactElement | ((props: ArgsProps) => ReactElement);
}

const CustomCSS = ({
  selectorName = "",
  css = "",
  children,
  ...props
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { renderType } = useRender();

  const updateCSS = useCallback(() => {
    const customIdAttr = makeAttr("custom-id");

    const node = ref.current;

    if (styles[selectorName] === css) {
      return;
    }

    if (node) {
      if (!css) {
        node.removeAttribute(customIdAttr);
        delete styles[selectorName];
      } else {
        node.setAttribute(customIdAttr, selectorName);
        styles[selectorName] = css;
      }
    }

    let styleNODE = document.getElementById("custom-css");
    if (!styleNODE) {
      styleNODE = document.createElement("style");

      styleNODE.id = "custom-css";
      styleNODE.innerHTML = toCSS(styles);
      document.head.appendChild(styleNODE);
    } else {
      styleNODE.innerHTML = toCSS(styles);
    }
  }, [selectorName, css]);

  useEffect(() => {
    updateCSS();
  }, [updateCSS]);

  if (renderType === "view") {
    return (
      <div
        {...makeDataAttr({ name: "custom-id", value: selectorName })}
        {...makeDataAttr({
          name: "custom-css",
          value: toCSS({ [selectorName]: css })
        })}
      >
        {typeof children === "function"
          ? children({ ref })
          : Children.only(children)}
      </div>
    );
  }

  if (typeof children === "function") {
    return children({ ref });
  }

  if (isValidElement(children)) {
    return cloneElement(Children.only(children), props);
  }

  return <></>;
};

export default CustomCSS;
