import { Font, FontFamily } from "./FontFamily";
import { FontLetterSpacing } from "./FontLetterSpacing";
import { FontLineHeight } from "./FontLineHeight";
import { FontSize } from "./FontSize";
import { FontStyle } from "./FontStyle";
import { FontStyle as FontStyleType } from "./FontStyle";
import { FontWeight } from "./FontWeight";
import { Value } from "./Value";

type changeValue = Value[keyof Value] | Font;
type changeMeta = {
  isChanged: keyof Value;
};

export interface TypographyProps
  extends FontLetterSpacing,
    FontLineHeight,
    FontSize,
    FontStyle,
    FontWeight,
    FontFamily {
  className?: string;
  onChange: (v: changeValue, meta: changeMeta) => void;

  icons?: string[];
  activeIcon?: string;
  onIconClick: (icon: string) => void;
}

export interface FontStyleProps {
  className?: string;
  styles: FontStyleType["styles"];
  openSettings: FontStyleType["styleOpenSettings"];
  onChange: (v: Value["fontStyle"]) => void;
  value: FontStyleType["style"];
}
