import { JSX } from "react";
import { Choice } from "visual/component/Controls/Toggle/types";
import { OnChange } from "visual/component/Options/Type";
import { VariationFont } from "visual/types/Fonts";
import { FontTransform, TextScripts } from "visual/types/Style";
import { WithValue } from "visual/types/attributes";
import { Font, FontFamily } from "./FontFamily";
import { FontLetterSpacing } from "./FontLetterSpacing";
import { FontLineHeight } from "./FontLineHeight";
import { FontSize } from "./FontSize";
import { FontStyle, FontStyle as FontStyleType } from "./FontStyle";
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
    FontFamily,
    FontTransform {
  className?: string;
  onChange: (v: changeValue, meta: changeMeta) => void;

  icons?: string[];
  activeIcon?: string;
  onIconClick: (icon: string) => void;
  variations?: VariationFont[];
  scriptChoices?: Choice<FontTransform["script"]>[];
  showTextTransform?: boolean;
  showFontSize?: boolean;
  showFontStyles?: boolean;
  isFontStyleSettingsDisabled?: boolean;
  label?: JSX.Element;
  disabledFields?: string[];
}

export interface FontStyleProps {
  className?: string;
  styles: FontStyleType["styles"];
  openSettings: FontStyleType["styleOpenSettings"];
  onChange: (v: Value["fontStyle"]) => void;
  value: FontStyleType["style"];
  isFontStyleSettingsDisabled?: boolean;
  disabled?: boolean;
}

export interface FontWeightProps extends FontWeight {
  label?: string;
  onFontWeightChange: OnChange<Value["fontWeight"]>;
  onVariableFontWeightChange: OnChange<Value["variableFontWeight"]>;
  onFontWidthChange: OnChange<Value["fontWidth"]>;
  onSoftnessChange: OnChange<Value["fontSoftness"]>;
  isVariable?: boolean;
  variations?: VariationFont[];
  className?: string;
}

export type FontVariationProps = Omit<
  FontWeightProps,
  "onFontWeightChange" | "weights" | "weight"
>;

export interface FontScript {
  script: TextScripts;
  scriptChoices: Choice<TextScripts>[];
}

export interface FontTransformProps extends FontTransform {
  onBoldChange: OnChange<FontTransform["bold"]>;
  onItalicChange: OnChange<FontTransform["italic"]>;
  onUnderlineChange: OnChange<FontTransform["underline"]>;
  onStrikeChange: OnChange<FontTransform["strike"]>;
  onUppercaseChange: OnChange<FontTransform["uppercase"]>;
  onLowercaseChange: OnChange<FontTransform["lowercase"]>;
  onScriptChange: OnChange<WithValue<FontTransform["script"]>>;
  scriptChoices?: Choice<FontTransform["script"]>[];
  disabledFields?: string[];
}
