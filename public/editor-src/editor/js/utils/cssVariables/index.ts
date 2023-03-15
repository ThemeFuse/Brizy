import Config from "visual/global/Config";

export const makeVariablesColor = () => {
  const config = Config.getAll();
  const variables = config?.ui?.theme?.colors ?? {};

  if (Object.keys(variables).length > 0) {
    const varConfig: string[] = [];

    Object.entries(variables).forEach((entry) => {
      const [key, value] = entry;
      if (value) {
        const vars = `${key}:${value}`;
        varConfig.push(vars);
      }
    });

    return `:root{${varConfig.join(";")}}`;
  }
};
