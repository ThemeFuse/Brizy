import { Theme } from "visual/global/Config/types/configs/ConfigCommon";

export const makeVariablesColor = (colors: Theme["colors"]) => {
  if (Object.keys(colors).length > 0) {
    const varConfig: string[] = [];

    Object.entries(colors).forEach((entry) => {
      const [key, value] = entry;
      if (value) {
        const vars = `${key}:${value}`;
        varConfig.push(vars);
      }
    });

    return `:root{${varConfig.join(";")}}`;
  }
};
