import translations from "visual/config/translations";

export const t = key => {
  if (process.env.NODE_ENV === "development") {
    if (translations[key] === undefined) {
      console.warn(`Translation not found for key "${key}". Returning key`);
    }
  }

  return translations[key] || key;
};
