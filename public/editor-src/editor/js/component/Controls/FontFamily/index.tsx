import classNames from "classnames";
import React, {
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import EditorIcon from "visual/component/EditorIcon";
import { Scrollbar, ScrollbarRef } from "visual/component/Scrollbar";
import { useTranslation } from "visual/providers/I18nProvider";
import { scrollToActiveFont } from "visual/utils/fonts/scrollHelpers";
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
  className,
  shouldSortFonts
}) => {
  const [searchValue, setSearchValue] = useState("");
  const { t } = useTranslation();

  const scrollbarRef = useRef<ScrollbarRef>(null);
  const normalizedFonts = useMemo(
    () => normalizeFonts(fonts, shouldSortFonts),
    [fonts, shouldSortFonts]
  );

  const filteredFonts = useMemo(() => {
    if (searchValue === "") {
      return normalizedFonts;
    }

    return normalizedFonts.filter((font) =>
      font.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [normalizedFonts, searchValue]);

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
      <div className="brz-ed-font__typography-search">
        <input
          className="brz-input"
          type="text"
          placeholder={t("Search fonts")}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <Scrollbar theme="dark" ref={scrollbarRef} absolute>
        {filteredFonts.map((font) => (
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
