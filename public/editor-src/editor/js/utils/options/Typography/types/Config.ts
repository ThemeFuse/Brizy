import { TextScripts } from "visual/types/Style";

type Boundaries = Partial<{
  min: number;
  max: number;
}>;

export interface Config {
  fontFamily?: boolean;
  fontSize?: Boundaries;
  lineHeight?: Boundaries;
  letterSpacing?: Boundaries;

  icons?: string[];
  scriptChoices?: TextScripts[];

  isAddNewFontDisabled?: boolean;
  isFontStyleSettingsDisabled?: boolean;
  disabledFields?: string[];
}
