import classNames from "classnames";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "visual/providers/I18nProvider";
import { FCC } from "visual/utils/react/types";
import { FontSizes, FontWithType } from "./types";

interface Props {
  font: FontWithType;
  isActive: boolean;
  onChange: (font: FontWithType) => void;
}

const fontSizeMap: FontSizes = {
  default: "17px", // 16
  great_vibes: "18px", // 18
  alex_brush: "18px",
  allura: "18px",
  parisienne: "18px"
};

export const FontFamilyItem: FCC<Props> = ({ font, isActive, onChange }) => {
  const { t } = useTranslation();
  const { id, title, family, variations } = font;

  const className = classNames("brz-ed-font__name", {
    active: isActive
  });

  const fontId = id as keyof FontSizes;

  const needVariableBadge = variations && variations.length > 0;

  const style = useMemo(
    () => ({
      fontFamily: family,
      fontSize: fontSizeMap[fontId] || fontSizeMap.default
    }),
    [family, fontId]
  );

  const handleClick = useCallback(() => {
    onChange(font);
  }, [font, onChange]);

  return (
    <div className={className} style={style} onClick={handleClick}>
      {title}
      {needVariableBadge && (
        <span className="brz-ed-font-variable-badge" title={t("VARIABLE")}>
          {t("VARIABLE")}
        </span>
      )}
    </div>
  );
};
