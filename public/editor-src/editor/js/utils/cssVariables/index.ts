import { Theme } from "visual/global/Config/types/configs/ConfigCommon";

export const makeVariablesColor = (colors: Theme["colors"]) => {
  if (Object.keys(colors).length > 0) {
    const vars: string[] = [];

    Object.entries(colors).forEach((entry) => {
      const [key, varValue] = entry;
      if (varValue) {
        const cssVar = `${key}:${varValue}`;
        vars.push(cssVar);
      }
    });

    return `:root{${vars.join(";")}}`;
  }
};
