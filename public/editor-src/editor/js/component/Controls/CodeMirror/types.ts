import type { SimpleValue } from "visual/component/Options/Type";
import type {
  WithClassName,
  WithOnChange,
  WithPlaceholder,
  WithSize,
  WithValue
} from "visual/types/attributes";

export type ThemeList = "default" | "idea";

export type Props = WithClassName &
  WithValue<string> &
  WithOnChange<string> &
  WithPlaceholder &
  WithSize &
  SimpleValue<string> & {
    language: "html" | "css" | "markdown" | "xml";
    theme?: ThemeList;
  };
