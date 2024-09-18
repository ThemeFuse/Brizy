import { ButtonStyle } from "./types";
import classNames from "classnames";

export const getButtonClassName = ({
  type,
  value,
  reverseTheme
}: ButtonStyle) => {
  switch (type) {
    case "square":
      return classNames("brz-ed-option__toggle-button", {
        "brz-ed-option__toggle-button-active": value
      });
    default:
      return classNames({
        "brz-ed-toolbar--active": value,
        reverseTheme: type !== "default" || reverseTheme
      });
  }
};
