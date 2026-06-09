import { useEffect, useRef } from "react";
import { useStyleProvider } from "visual/providers/StyleProvider";
import { murmurhash2 } from "visual/utils/crypto";
import type { OutputStyle } from "visual/utils/cssStyle/types";
import type { MValue } from "visual/utils/value";
import { createCache, createSheet } from "../Sheet";

interface Props {
  id: string;
  componentId: string;
  css: Array<string>;
  customStylesClassName?: string;
}

const isCSSOutput = (css: Array<string>): css is OutputStyle =>
  css.length === 3;

export const useCSS = (props: Props): MValue<string> => {
  const { sheet } = useStyleProvider();

  const {
    id,
    componentId,
    css,
    customStylesClassName: _customStylesClassName
  } = props;

  const cssClassNames = useRef<Set<string>>(new Set());

  useEffect(() => {
    const cssClassNamesRef = cssClassNames.current;

    return () => {
      const classNames = Array.from(cssClassNamesRef);

      classNames.forEach((className) => {
        sheet.cleanupClassName(
          className,
          sheet.isIncrementalClassName(className)
        );
      });

      cssClassNamesRef.clear();
    };
  }, [sheet]);

  // Specific Case when we need to add or not css by some option
  if (isCSSOutput(css)) {
    const customStylesClassName =
      _customStylesClassName ?? `brz-css-${murmurhash2(css + id)}`;
    const cache = createCache({ id, componentId, sheet });
    const { className } = createSheet({ cache, css, customStylesClassName });

    const classNames = className.split(" ").filter(Boolean);

    classNames.forEach((cn) => {
      if (sheet.isIncrementalClassName(cn) && !cssClassNames.current.has(cn)) {
        sheet.incrementClassNameCounter(cn);
      }
      cssClassNames.current.add(cn);
    });

    return className;
  }

  return undefined;
};
