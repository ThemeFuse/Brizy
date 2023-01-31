import { useCallback, useEffect, useRef, useState } from "react";
import { useMutationObservable, useWindowSize } from "core/hooks";
import { getScrollbarWidth, scrollbarVisible } from "./utils";

interface Props {
  doc?: Document;
  appendCSSVar?: boolean;
  cssVarName?: string;
}

export const useScrollbar = (
  props: Props
): { isShow: boolean; width: number } => {
  const {
    appendCSSVar,
    cssVarName = "brz-scrollbar-width",
    doc = document
  } = props;
  const wSize = useWindowSize();
  const [isShow, setShow] = useState(false);
  const widthRef = useRef(0);
  const showRef = useRef(false);
  const handleMutation = useCallback(() => {
    const _isShow = scrollbarVisible(doc, doc.defaultView ?? window);

    if (showRef.current !== _isShow) {
      showRef.current = _isShow;
      setShow(_isShow);
    }
  }, []);

  useMutationObservable(doc.body, handleMutation);

  useEffect(() => {
    const isShow = scrollbarVisible(doc, doc.defaultView ?? window);
    showRef.current = isShow;
    setShow(isShow);
    widthRef.current = getScrollbarWidth();
  }, []);

  useEffect(() => {
    const _isShow = scrollbarVisible(doc, doc.defaultView ?? window);

    if (showRef.current !== _isShow) {
      showRef.current = _isShow;
      setShow(_isShow);
    }
  }, [wSize]);

  useEffect(() => {
    if (!appendCSSVar) {
      return;
    }

    const cssVar = `--${cssVarName}`;

    if (isShow) {
      const cssVarValue = `${widthRef.current}px`;
      doc.body.style.setProperty(cssVar, cssVarValue);
    } else {
      doc.body.style.removeProperty(cssVar);
    }
  }, [isShow, appendCSSVar]);

  return { width: widthRef.current, isShow };
};
