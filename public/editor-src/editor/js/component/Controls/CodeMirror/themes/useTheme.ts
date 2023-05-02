import { ThemeList } from "../types";
import { defaultTheme } from "./default";
import { ideaTheme } from "./idea";

export const useTheme = (theme: ThemeList) => {
  const themePreset = () => {
    switch (theme) {
      case "default":
        return defaultTheme;
      case "idea":
        return ideaTheme;
      default:
        return defaultTheme;
    }
  };
  return { themePreset };
};
