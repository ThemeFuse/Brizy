import classNames from "classnames";
import React, { FC, ReactElement, SyntheticEvent } from "react";
import { IconsName } from "../EditorIcon/types";
import { Scrollbar } from "../Scrollbar";
import { EditorIcon } from "../index";
import { FontFamilyType } from "../types/fonts/familyType";
import { t } from "../utils/i18n";
import { FontList, FontObject, FontSizes, FontWithType, Props } from "./types";

const fontSizeMap: FontSizes = {
  default: "17px", // 16
  great_vibes: "18px", // 18
  alex_brush: "18px",
  allura: "18px",
  parisienne: "18px"
};

export const FontFamily: FC<Props> = ({
  addFont,
  addFontLabel,
  fonts,
  onChange,
  value,
  className
}): ReactElement => {
  const {
    config: configFonts = [],
    blocks: blocksFonts = [],
    google: googleFonts = [],
    upload: uploadFonts = []
  } = fonts;
  const handleOpenFonts = (event: SyntheticEvent<HTMLDivElement>) => {
    event.preventDefault();
    addFont?.();
  };

  const renderFontList = ({ fonts, type }: FontList) => {
    return fonts.map((font: FontObject) => {
      const { id, family, title } = font;

      const fontId = id as keyof FontSizes;
      const fontWithType: FontWithType = { ...font, type };

      const className = classNames("brz-ed-font__name", {
        active: id === value
      });
      const style = {
        fontFamily: family,
        fontSize: fontSizeMap[fontId] || fontSizeMap.default
      };

      return (
        <div
          key={id}
          className={className}
          style={style}
          onClick={() => onChange(fontWithType)}
        >
          {title}
        </div>
      );
    });
  };

  const needSeparator = uploadFonts.length > 0 || googleFonts.length > 0;
  const _className = classNames("brz-ed-font__typography", className);

  return (
    <div className={_className}>
      <Scrollbar theme="dark">
        {uploadFonts.length > 0 &&
          renderFontList({
            fonts: uploadFonts,
            type: FontFamilyType.upload
          })}

        {googleFonts.length > 0 &&
          renderFontList({
            fonts: googleFonts,
            type: FontFamilyType.google
          })}

        {needSeparator && <hr className="brz-hr brz-ed-font__separator" />}

        {blocksFonts &&
          renderFontList({
            fonts: blocksFonts,
            type: FontFamilyType.google
          })}
        {renderFontList({
          fonts: configFonts,
          type: FontFamilyType.google
        })}
      </Scrollbar>
      {addFont && (
        <div
          className="brz-ed-font__typography-adder"
          onClick={handleOpenFonts}
        >
          <EditorIcon icon={IconsName.PlusCircle} />
          {addFontLabel ?? t("Add New Font")}
        </div>
      )}
    </div>
  );
};
