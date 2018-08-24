import translations from "visual/config/translations";

export const t = key => {
  if (process.env.NODE_ENV === "development") {
    if (translations[key] === undefined) {
      throw new Error(`Translation not found for key ${key}`);
    }
  }

  return translations[key];
};
