import classNames from "classnames";
import React, {
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef
} from "react";
import EditorIcon from "visual/component/EditorIcon";
import { Scrollbar } from "visual/component/Scrollbar";
import {
  ScrollbarType,
  scrollToActiveFont
} from "visual/utils/fonts/scrollHelpers";
import { FCC } from "visual/utils/react/types";
import { FontFamilyItem } from "./Item";
import { Props } from "./types";
import { normalizeFonts } from "./utils";

export const FontFamily: FCC<Props> = ({
  fonts,
  value,
  onChange,
  addFont,
  addFontLabel,
  className
}) => {
  const scrollbarRef = useRef<ScrollbarType>(null);
  const normalizedFonts = useMemo(() => normalizeFonts(fonts), [fonts]);

  useEffect(() => {
    scrollToActiveFont(scrollbarRef);
  }, []);

  const handleOpenFonts = useCallback(
    (event: SyntheticEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (addFont) {
        addFont();
      }
    },
    [addFont]
  );

  const _className = classNames("brz-ed-font__typography", className);

  return (
    <div className={_className}>
      <Scrollbar theme="dark" ref={scrollbarRef}>
        {normalizedFonts.map((font) => (
          <FontFamilyItem
            key={font.id}
            font={font}
            isActive={font.id === value}
            onChange={onChange}
          />
        ))}
      </Scrollbar>
      {addFont && (
        <div
          className="brz-ed-font__typography-adder"
          onClick={handleOpenFonts}
        >
          <EditorIcon icon="nc-add" />
          {addFontLabel}
        </div>
      )}
    </div>
  );
};
